"""
Card Schemas

Pydantic models for card request/response validation.
Supports multiple card types with JSONB content validation.
"""

from typing import Any, Dict, List, Optional

from pydantic import Field, field_validator

from app.schemas.base import BaseSchema, IDSchema, TimestampSchema
from app.schemas.tag import TagResponse
from app.core.constants import CardType, CardStatus, MAX_CARD_TITLE_LENGTH


class CardBase(BaseSchema):
    """Base card schema with common fields."""
    
    title: str = Field(..., max_length=MAX_CARD_TITLE_LENGTH)
    card_type: CardType = CardType.TEXT
    content: Dict[str, Any] = Field(default_factory=dict)


class CardCreate(CardBase):
    """Schema for creating a new card."""
    
    tag_ids: Optional[List[str]] = Field(default_factory=list)
    
    @field_validator("content", mode="before")
    @classmethod
    def validate_content_for_type(cls, v: Dict[str, Any], info) -> Dict[str, Any]:
        """Validate content structure based on card type."""
        # Add type-specific validation here
        return v or {}


class CardUpdate(BaseSchema):
    """Schema for updating a card. All fields optional."""
    
    title: Optional[str] = Field(None, max_length=MAX_CARD_TITLE_LENGTH)
    content: Optional[Dict[str, Any]] = None
    status: Optional[CardStatus] = None
    position: Optional[int] = None
    tag_ids: Optional[List[str]] = None


class CardResponse(CardBase, IDSchema, TimestampSchema):
    """Schema for card response."""
    
    status: CardStatus = CardStatus.ACTIVE
    position: int = 0
    owner_id: str
    tags: List[TagResponse] = Field(default_factory=list)


# Type-specific content schemas for validation
class TextCardContent(BaseSchema):
    """Content schema for text cards."""
    
    text: str = ""
    format: str = "markdown"  # markdown, plain, html


class ChecklistCardContent(BaseSchema):
    """Content schema for checklist cards."""
    
    class ChecklistItem(BaseSchema):
        text: str
        checked: bool = False
    
    items: List[ChecklistItem] = Field(default_factory=list)


class ImageCardContent(BaseSchema):
    """Content schema for image cards."""
    
    url: str
    caption: Optional[str] = None
    alt_text: Optional[str] = None


class LinkCardContent(BaseSchema):
    """Content schema for link cards."""
    
    url: str
    title: Optional[str] = None
    description: Optional[str] = None
    thumbnail_url: Optional[str] = None


class CodeCardContent(BaseSchema):
    """Content schema for code cards."""
    
    code: str = ""
    language: str = "plaintext"
