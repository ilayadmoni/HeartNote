"""
User Schemas

Pydantic models for user request/response validation.
"""

from typing import Optional

from pydantic import EmailStr, Field

from app.schemas.base import BaseSchema, IDSchema, TimestampSchema
from app.core.constants import UserRole


class UserBase(BaseSchema):
    """Base user schema with common fields."""
    
    email: EmailStr
    full_name: Optional[str] = Field(None, max_length=255)


class UserCreate(UserBase):
    """Schema for creating a new user."""
    
    password: str = Field(..., min_length=8, max_length=100)


class UserUpdate(BaseSchema):
    """Schema for updating a user. All fields optional."""
    
    email: Optional[EmailStr] = None
    full_name: Optional[str] = Field(None, max_length=255)
    avatar_url: Optional[str] = None
    preferences: Optional[dict] = None


class UserResponse(UserBase, IDSchema, TimestampSchema):
    """Schema for user response (public data)."""
    
    role: str = UserRole.USER.value
    is_active: bool = True
    is_verified: bool = False
    avatar_url: Optional[str] = None
    preferences: Optional[dict] = None


class UserInDB(UserResponse):
    """Schema for user in database (includes hashed password)."""
    
    hashed_password: str
