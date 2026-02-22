"""
FastAPI main application for Law AI Assistant.
Provides REST API endpoints for legal case analysis using AI.
"""

from fastapi import FastAPI, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from contextlib import asynccontextmanager
import json
import logging
from datetime import datetime, timedelta
from typing import Dict, Any
from bson import ObjectId

from models import CaseInput, AnalysisResponse, ErrorResponse, DocumentInput, UserRegistration, UserLogin, UserStatusUpdate
from rag import retrieve_sections, get_section_count
from groq_client import analyse_case
from database import cases_collection, documents_collection, users_collection, create_indexes, close_connection, verify_collections
from config import JWT_SECRET_KEY, JWT_ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
import bcrypt
import jwt

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


security_scheme = HTTPBearer()


def create_access_token(data: Dict[str, Any], expires_delta: timedelta | None = None) -> str:
    """
    Create a signed JWT access token.
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    return encoded_jwt


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security_scheme)):
    """
    Dependency that returns the current authenticated user from a JWT bearer token.
    """
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        user_id: str | None = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
            )
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
        )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )

    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if not user or not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User is inactive or does not exist",
        )

    return user


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
        
        # Additional sanitization for applicable_sections to handle objects if they appear
        if field == "applicable_sections" and isinstance(analysis[field], list):
            sanitized_sections = []
            for item in analysis[field]:
                if isinstance(item, dict):
                    # If it's an object with section/description, flatten it to a string for simpler rendering
                    # (Though the frontend is now robust, this keeps stored data clean)
                    sec = item.get("section") or item.get("title") or "Unknown"
                    desc = item.get("description") or ""
                    sanitized_sections.append(f"{sec}: {desc}" if desc else sec)
                else:
                    sanitized_sections.append(str(item))
            analysis[field] = sanitized_sections
    
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
        case = cases_collection.find_one({"_id": ObjectId(case_id)})
        
        if not case:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Case with ID {case_id} not found"
            )
        
        case["_id"] = str(case["_id"])
        
        if "created_at" in case and case["created_at"]:
            case["created_at"] = case["created_at"].isoformat()
        
        return case
        
    except HTTPException:
        raise
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
        limit = min(limit, 100)
        
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


@app.post("/documents", tags=["Documents"])
async def create_document(data: DocumentInput):
    """
    Create a new document entry.
    
    Args:
        data: DocumentInput with document details
    
    Returns:
        Created document with ID
    """
    try:
        timestamp = datetime.utcnow()
        
        document = {
            "name": data.name,
            "type": data.type,
            "size": data.size,
            "content": data.content,
            "status": "Processed",
            "created_at": timestamp,
            "updated_at": timestamp
        }
        
        result = documents_collection.insert_one(document)
        document["_id"] = str(result.inserted_id)
        document["created_at"] = document["created_at"].isoformat()
        document["updated_at"] = document["updated_at"].isoformat()
        
        return document
        
    except Exception as e:
        logger.error(f"Error creating document: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@app.get("/documents", tags=["Documents"])
async def list_documents(limit: int = 50, skip: int = 0):
    """
    List documents with pagination.
    
    Args:
        limit: Number of documents to return (default: 50, max: 100)
        skip: Number of documents to skip (default: 0)
    
    Returns:
        List of documents
    """
    try:
        limit = min(limit, 100)
        
        documents = list(
            documents_collection.find()
            .sort("created_at", -1)
            .skip(skip)
            .limit(limit)
        )
        
        for doc in documents:
            doc["_id"] = str(doc["_id"])
            if "created_at" in doc and doc["created_at"]:
                doc["created_at"] = doc["created_at"].isoformat()
            if "updated_at" in doc and doc["updated_at"]:
                doc["updated_at"] = doc["updated_at"].isoformat()
        
        total_count = documents_collection.count_documents({})
        
        return {
            "documents": documents,
            "total": total_count,
            "limit": limit,
            "skip": skip
        }
        
    except Exception as e:
        logger.error(f"Error listing documents: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@app.delete("/documents/{document_id}", tags=["Documents"])
async def delete_document(document_id: str):
    """
    Delete a document by ID.
    
    Args:
        document_id: MongoDB ObjectId as string
    
    Returns:
        Success message
    """
    try:
        from bson import ObjectId
        
        result = documents_collection.delete_one({"_id": ObjectId(document_id)})
        
        if result.deleted_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Document with ID {document_id} not found"
            )
        
        return {"message": "Document deleted successfully"}
        
    except Exception as e:
        logger.error(f"Error deleting document: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@app.post("/users/register", tags=["Users"])
async def register_user(data: UserRegistration):
    """
    Register a new user with hashed password.
    
    Args:
        data: UserRegistration with email, password, and full_name
    
    Returns:
        User data without password
    """
    try:
        # Check if user already exists
        existing_user = users_collection.find_one({"email": data.email})
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists"
            )
        
        # Hash password
        hashed_password = bcrypt.hashpw(data.password.encode('utf-8'), bcrypt.gensalt())
        
        timestamp = datetime.utcnow()
        
        user = {
            "email": data.email,
            "password_hash": hashed_password,
            "full_name": data.full_name,
            "created_at": timestamp,
            "updated_at": timestamp,
            "is_active": True,
            "role": "user",
        }
        
        result = users_collection.insert_one(user)

        # Issue JWT token on successful registration
        user_id_str = str(result.inserted_id)
        access_token = create_access_token(
            data={"sub": user_id_str, "email": data.email}
        )
        
        # Return user data without password
        return {
            "user_id": user_id_str,
            "email": data.email,
            "full_name": data.full_name,
            "created_at": timestamp.isoformat(),
            "role": "user",
            "access_token": access_token,
            "token_type": "bearer",
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error registering user: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@app.post("/users/login", tags=["Users"])
async def login_user(data: UserLogin):
    """
    Authenticate user login.
    
    Args:
        data: UserLogin with email and password
    
    Returns:
        User data without password
    """
    try:
        # Find user by email
        user = users_collection.find_one({"email": data.email})
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Verify password
        if not bcrypt.checkpw(data.password.encode('utf-8'), user["password_hash"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )

        user_id_str = str(user["_id"])
        access_token = create_access_token(
            data={"sub": user_id_str, "email": user["email"]}
        )
        
        # Return user data without password
        return {
            "user_id": user_id_str,
            "email": user["email"],
            "full_name": user["full_name"],
            "created_at": user["created_at"].isoformat() if user.get("created_at") else None,
            "role": user.get("role", "user"),
            "access_token": access_token,
            "token_type": "bearer",
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error during login: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@app.get("/users/{user_id}", tags=["Users"])
async def get_user(user_id: str):
    """
    Get user by ID.
    
    Args:
        user_id: MongoDB ObjectId as string
    
    Returns:
        User data without password
    """
    try:
        user = users_collection.find_one({"_id": ObjectId(user_id)})
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with ID {user_id} not found"
            )
        
        # Return user data without password
        return {
            "user_id": str(user["_id"]),
            "email": user["email"],
            "full_name": user["full_name"],
            "created_at": user["created_at"].isoformat() if user.get("created_at") else None,
            "role": user.get("role", "user"),
        }
        
    except Exception as e:
        logger.error(f"Error retrieving user: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@app.get("/users", tags=["Users"])
async def list_users(limit: int = 100, skip: int = 0):
    """
    List all users (admin use).
    
    Args:
        limit: Max users to return (default: 100)
        skip: Number to skip for pagination
    
    Returns:
        List of users without password hashes
    """
    try:
        limit = min(limit, 100)
        users = list(
            users_collection.find()
            .sort("created_at", -1)
            .skip(skip)
            .limit(limit)
        )
        
        result = []
        for user in users:
            user_id_str = str(user["_id"])
            result.append({
                "user_id": user_id_str,
                "id": user_id_str,
                "full_name": user.get("full_name", ""),
                "name": user.get("full_name", ""),
                "email": user["email"],
                "role": user.get("role", "user").capitalize(),
                "is_active": user.get("is_active", True),
                "created_at": user["created_at"].isoformat() if user.get("created_at") else None,
                "status": "Active" if user.get("is_active", True) else "Disabled",
                "casesCount": 0,  # Cases don't have user_id association yet
                "joinDate": user["created_at"].strftime("%Y-%m-%d") if user.get("created_at") else "N/A",
                "lastLogin": "N/A",  # Not tracked
                "subscription": "Basic",
            })
        
        total = users_collection.count_documents({})
        return {
            "users": result,
            "total": total,
            "limit": limit,
            "skip": skip
        }
    except Exception as e:
        logger.error(f"Error listing users: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@app.patch("/users/{user_id}", tags=["Users"])
async def update_user_status(user_id: str, data: UserStatusUpdate):
    """
    Update user active status (admin use).
    """
    try:
        result = users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"is_active": data.is_active, "updated_at": datetime.utcnow()}}
        )
        if result.matched_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User {user_id} not found"
            )
        return {"message": "User updated", "is_active": data.is_active}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating user: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@app.delete("/users/{user_id}", tags=["Users"])
async def delete_user(user_id: str):
    """
    Delete a user by ID (admin use).
    """
    try:
        result = users_collection.delete_one({"_id": ObjectId(user_id)})
        if result.deleted_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User {user_id} not found"
            )
        return {"message": "User deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting user: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@app.delete("/cases/{case_id}", tags=["Cases"])
async def delete_case(case_id: str):
    """
    Delete a case by ID (admin use).
    """
    try:
        result = cases_collection.delete_one({"_id": ObjectId(case_id)})
        if result.deleted_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Case {case_id} not found"
            )
        return {"message": "Case deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting case: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@app.get("/profile", tags=["Users"])
async def get_profile(current_user: dict = Depends(get_current_user)):
    """
    Get the current authenticated user's profile.
    Protected endpoint using JWT bearer authentication.
    """
    return {
        "user_id": str(current_user["_id"]),
        "email": current_user["email"],
        "full_name": current_user.get("full_name"),
        "created_at": current_user["created_at"].isoformat() if current_user.get("created_at") else None,
        "role": current_user.get("role", "user"),
    }


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
