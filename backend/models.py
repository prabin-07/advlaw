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


class DocumentInput(BaseModel):
    """
    Input model for document upload.
    """
    name: str = Field(..., description="Document filename")
    type: str = Field(..., description="Document type (Contract, Brief, Evidence, Statement)")
    size: str = Field(..., description="File size (e.g., '2.4 MB')")
    content: Optional[str] = Field(None, description="Document content (optional)")


class UserRegistration(BaseModel):
    """
    Input model for user registration.
    """
    email: str = Field(..., description="User email address")
    password: str = Field(..., min_length=6, description="User password (minimum 6 characters)")
    full_name: str = Field(..., description="User's full name")
    
    @validator('email')
    def validate_email(cls, v):
        """Basic email validation"""
        if '@' not in v or '.' not in v:
            raise ValueError('Invalid email format')
        return v.lower().strip()


class UserLogin(BaseModel):
    """
    Input model for user login.
    """
    email: str = Field(..., description="User email address")
    password: str = Field(..., description="User password")


class UserStatusUpdate(BaseModel):
    """Update user active status."""
    is_active: bool = Field(..., description="Whether the user account is active")


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