"""
Pydantic models for request/response validation.
Ensures data integrity and provides automatic API documentation.
"""

from pydantic import BaseModel, Field, validator
from typing import List, Optional
from datetime import datetime


class CaseInput(BaseModel):
    """
    Input model for case analysis requests.
    Validates that case text meets minimum requirements.
    """
    case_text: str = Field(
        ...,
        min_length=20,
        description="Detailed description of the legal case (minimum 20 characters)",
        example="A contract dispute between two parties regarding breach of payment terms..."
    )
    
    @validator('case_text')
    def validate_case_text(cls, v):
        """Validate case text is not just whitespace"""
        if not v or not v.strip():
            raise ValueError('Case text cannot be empty or only whitespace')
        if len(v.strip()) < 20:
            raise ValueError('Case text must be at least 20 characters long')
        return v.strip()


class AnalysisResponse(BaseModel):
    """
    Response model for successful case analysis.
    """
    case_id: str = Field(..., description="Unique identifier for the stored case")
    case_text: str = Field(..., description="Original case text submitted")
    retrieved_sections: str = Field(..., description="Relevant law sections retrieved")
    analysis: dict = Field(..., description="AI-generated legal analysis")
    timestamp: datetime = Field(..., description="When the analysis was performed")
    
    class Config:
        json_schema_extra = {
            "example": {
                "case_id": "507f1f77bcf86cd799439011",
                "case_text": "Contract dispute case...",
                "retrieved_sections": "Section 73 - Compensation for loss...",
                "analysis": {
                    "summary": "This is a contract breach case...",
                    "applicable_sections": ["Section 73", "Section 74"],
                    "legal_issues": ["Breach of contract", "Damages"],
                    "loopholes": ["Limitation period may apply"],
                    "recommended_actions": ["Send legal notice", "File suit"]
                },
                "timestamp": "2025-01-29T10:30:00"
            }
        }


class ErrorResponse(BaseModel):
    """
    Standard error response model.
    """
    error: str = Field(..., description="Error message")
    detail: Optional[str] = Field(None, description="Additional error details")
    
    class Config:
        json_schema_extra = {
            "example": {
                "error": "Invalid input",
                "detail": "Case text must be at least 20 characters long"
            }
        }