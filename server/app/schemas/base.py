"""
Base Pydantic Schemas

Common schema configurations and mixins.
"""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class BaseSchema(BaseModel):
    """
    Base schema with common configuration.
    All schemas should inherit from this.
    """
    
    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
        str_strip_whitespace=True,
    )


class TimestampSchema(BaseModel):
    """Schema mixin for timestamp fields."""
    
    created_at: datetime
    updated_at: datetime


class IDSchema(BaseModel):
    """Schema mixin for ID field."""
    
    id: str


class PaginationParams(BaseModel):
    """Pagination query parameters."""
    
    page: int = 1
    page_size: int = 20
    
    @property
    def offset(self) -> int:
        return (self.page - 1) * self.page_size


class PaginatedResponse(BaseModel):
    """Generic paginated response wrapper."""
    
    items: list
    total: int
    page: int
    page_size: int
    total_pages: int
