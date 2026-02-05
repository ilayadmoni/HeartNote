"""
Authentication Schemas

Pydantic models for authentication request/response validation.
"""

from typing import Optional

from pydantic import EmailStr, Field

from app.schemas.base import BaseSchema


class Token(BaseSchema):
    """JWT token response schema."""
    
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenPayload(BaseSchema):
    """JWT token payload schema."""
    
    sub: str  # Subject (user ID)
    exp: int  # Expiration timestamp
    iat: int  # Issued at timestamp
    type: str  # Token type (access, refresh)


class LoginRequest(BaseSchema):
    """Login request schema."""
    
    email: EmailStr
    password: str = Field(..., min_length=1)


class RegisterRequest(BaseSchema):
    """User registration request schema."""
    
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=100)
    full_name: Optional[str] = Field(None, max_length=255)


class RefreshTokenRequest(BaseSchema):
    """Refresh token request schema."""
    
    refresh_token: str


class PasswordChangeRequest(BaseSchema):
    """Password change request schema."""
    
    current_password: str
    new_password: str = Field(..., min_length=8, max_length=100)
