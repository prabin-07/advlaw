"""
FastAPI main application for Law AI Assistant.
Provides REST API endpoints for legal case analysis using AI.
"""

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import json
import logging
from datetime import datetime
from typing import Dict, Any

from models import CaseInput, AnalysisResponse, ErrorResponse
from rag import retrieve_sections, get_section_count
from groq_client import analyse_case
from database import cases_collection, create_indexes, close_connection, verify_collections

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for startup and shutdown events.
    """
    # Startup
    logger.info("Starting Law AI Assistant API...")
    
    # Create indexes
    create_indexes()
    
    # Verify collections
    collections_status = verify_collections()
    logger.info(f"Collections status: {collections_status}")
    
    section_count = get_section_count()
    logger.info(f"Database contains {section_count} law sections")
    
    yield
    
    # Shutdown
    logger.info("Shutting down Law AI Assistant API...")
    close_connection()


# Initialize FastAPI app
app = FastAPI(
    title="Law AI Assistant API",
    description="AI-powered legal case analysis using Groq LLM and RAG",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["Health"])
async def root():
    """
    Root endpoint - API health check.
    """
    return {
        "status": "online",
        "service": "Law AI Assistant API",
        "version": "1.0.0",
        "database": "ai_law",
        "endpoints": {
            "analyze": "/analyze",
            "health": "/health",
            "docs": "/docs"
        }
    }


@app.get("/health", tags=["Health"])
async def health_check():
    """
    Detailed health check endpoint.
    Returns database status and section count.
    """
    try:
        collections_status = verify_collections()
        section_count = get_section_count()
        
        return {
            "status": "healthy",
            "database": "ai_law",
            "collections": collections_status,
            "sections_available": section_count,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "status": "unhealthy",
                "error": str(e)
            }
        )


def validate_analysis_structure(analysis: Dict[str, Any]) -> Dict[str, Any]:
    """
    Validate and ensure analysis has required structure.
    
    Args:
        analysis: Parsed analysis dictionary
        
    Returns:
        Validated analysis with all required fields
    """
    required_fields = {
        "summary": "",
        "applicable_sections": [],
        "legal_issues": [],
        "loopholes": [],
        "recommended_actions": []
    }
    
    # Ensure all required fields exist
    for field, default_value in required_fields.items():
        if field not in analysis:
            logger.warning(f"Missing field '{field}' in analysis, using default")
            analysis[field] = default_value
        elif field != "summary" and not isinstance(analysis[field], list):
            logger.warning(f"Field '{field}' is not a list, converting")
            analysis[field] = []
    
    return analysis


@app.post(
    "/analyze",
    response_model=AnalysisResponse,
    responses={
        400: {"model": ErrorResponse, "description": "Invalid input"},
        500: {"model": ErrorResponse, "description": "Server error"},
        503: {"model": ErrorResponse, "description": "AI service unavailable"}
    },
    tags=["Analysis"]
)
async def analyze_case(data: CaseInput):
    """
    Analyze a legal case using AI and RAG.
    
    Process:
    1. Validate input case text
    2. Retrieve relevant law sections using RAG
    3. Generate AI analysis using Groq LLM
    4. Parse and validate JSON response
    5. Store case and analysis in database
    6. Return structured response
    
    Args:
        data: CaseInput containing case_text
    
    Returns:
        AnalysisResponse with case_id, analysis, and metadata
    
    Raises:
        HTTPException: For validation, parsing, or server errors
    """
    try:
        logger.info(f"Received case analysis request (length: {len(data.case_text)} chars)")
        
        # Step 1: Retrieve relevant law sections
        logger.info("Retrieving relevant law sections...")
        retrieved_sections = retrieve_sections(data.case_text)
        
        # Step 2: Call AI for case analysis
        logger.info("Calling Groq AI for case analysis...")
        try:
            ai_result = analyse_case(data.case_text, retrieved_sections)
        except Exception as e:
            logger.error(f"Groq API error: {e}")
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"AI service temporarily unavailable: {str(e)}"
            )
        
        # Step 3: Parse and validate JSON response
        logger.info("Parsing AI response...")
        try:
            # Clean the response (remove markdown code blocks if present)
            cleaned_result = ai_result.strip()
            if cleaned_result.startswith("```json"):
                cleaned_result = cleaned_result[7:]
            if cleaned_result.startswith("```"):
                cleaned_result = cleaned_result[3:]
            if cleaned_result.endswith("```"):
                cleaned_result = cleaned_result[:-3]
            cleaned_result = cleaned_result.strip()
            
            # Parse JSON
            parsed_analysis = json.loads(cleaned_result)
            
            # Validate structure
            parsed_analysis = validate_analysis_structure(parsed_analysis)
            
            logger.info("AI response parsed and validated successfully")
            
        except json.JSONDecodeError as e:
            logger.error(f"JSON parsing error: {e}")
            logger.error(f"Raw AI response: {ai_result[:500]}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="AI model did not return valid JSON. Please try again."
            )
        
        # Step 4: Store in database with improved schema
        logger.info("Storing case analysis in database...")
        timestamp = datetime.utcnow()
        
        case_document = {
            "case_text": data.case_text,
            "retrieved_sections": retrieved_sections,
            "analysis": {
                "summary": parsed_analysis.get("summary", ""),
                "applicable_sections": parsed_analysis.get("applicable_sections", []),
                "legal_issues": parsed_analysis.get("legal_issues", []),
                "loopholes": parsed_analysis.get("loopholes", []),
                "recommended_actions": parsed_analysis.get("recommended_actions", [])
            },
            "created_at": timestamp
        }
        
        try:
            result = cases_collection.insert_one(case_document)
            case_id = str(result.inserted_id)
            logger.info(f"Case stored successfully with ID: {case_id}")
        except Exception as e:
            logger.error(f"Database insertion error: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to store case analysis: {str(e)}"
            )
        
        # Step 5: Return response
        return AnalysisResponse(
            case_id=case_id,
            case_text=data.case_text,
            retrieved_sections=retrieved_sections,
            analysis=parsed_analysis,
            timestamp=timestamp
        )
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        # Catch any unexpected errors
        logger.error(f"Unexpected error in analyze_case: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred: {str(e)}"
        )


@app.get("/cases/{case_id}", tags=["Cases"])
async def get_case(case_id: str):
    """
    Retrieve a specific case by ID.
    
    Args:
        case_id: MongoDB ObjectId as string
    
    Returns:
        Case document with analysis
    """
    try:
        from bson import ObjectId
        
        case = cases_collection.find_one({"_id": ObjectId(case_id)})
        
        if not case:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Case with ID {case_id} not found"
            )
        
        # Convert ObjectId to string for JSON serialization
        case["_id"] = str(case["_id"])
        
        # Convert datetime to ISO format
        if "created_at" in case and case["created_at"]:
            case["created_at"] = case["created_at"].isoformat()
        
        return case
        
    except Exception as e:
        logger.error(f"Error retrieving case: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@app.get("/cases", tags=["Cases"])
async def list_cases(limit: int = 10, skip: int = 0):
    """
    List recent cases with pagination.
    
    Args:
        limit: Number of cases to return (default: 10, max: 100)
        skip: Number of cases to skip (default: 0)
    
    Returns:
        List of cases with metadata
    """
    try:
        # Limit maximum results
        limit = min(limit, 100)
        
        # Query cases sorted by created_at descending
        cases = list(
            cases_collection.find()
            .sort("created_at", -1)
            .skip(skip)
            .limit(limit)
        )
        
        # Convert ObjectId and datetime to strings
        for case in cases:
            case["_id"] = str(case["_id"])
            if "created_at" in case and case["created_at"]:
                case["created_at"] = case["created_at"].isoformat()
        
        total_count = cases_collection.count_documents({})
        
        return {
            "cases": cases,
            "total": total_count,
            "limit": limit,
            "skip": skip
        }
        
    except Exception as e:
        logger.error(f"Error listing cases: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


# Error handlers
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """
    Global exception handler for unhandled errors.
    """
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "Internal server error",
            "detail": "An unexpected error occurred. Please try again later."
        }
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
