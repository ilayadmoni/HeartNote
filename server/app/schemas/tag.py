"""
Tag Schemas

Pydantic models for tag request/response validation.
"""

from typing import Optional

from pydantic import Field, field_validator
import re

from app.schemas.base import BaseSchema, IDSchema, TimestampSchema
from app.core.constants import MAX_TAG_NAME_LENGTH


class TagBase(BaseSchema):
    """Base tag schema with common fields."""
    
    name: str = Field(..., max_length=MAX_TAG_NAME_LENGTH)
    color: Optional[str] = Field("#6366f1", pattern=r"^#[0-9A-Fa-f]{6}$")
    
    @field_validator("color", mode="before")
    @classmethod
    def validate_color(cls, v: Optional[str]) -> Optional[str]:
        """Validate hex color format."""
        if v is None:
            return "#6366f1"
        if not re.match(r"^#[0-9A-Fa-f]{6}$", v):
            raise ValueError("Color must be a valid hex color (e.g., #6366f1)")
        return v


class TagCreate(TagBase):
    """Schema for creating a new tag."""
    pass


class TagUpdate(BaseSchema):
    """Schema for updating a tag. All fields optional."""
    
    name: Optional[str] = Field(None, max_length=MAX_TAG_NAME_LENGTH)
    color: Optional[str] = Field(None, pattern=r"^#[0-9A-Fa-f]{6}$")


class TagResponse(TagBase, IDSchema, TimestampSchema):
    """Schema for tag response."""
    
    owner_id: str
