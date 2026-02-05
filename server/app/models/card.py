"""
Card Model

Database model for cards (notes) in HeartNote.
Supports multiple card types via JSONB content field.
"""

from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base
from app.models.base import TimestampMixin, UUIDMixin
from app.core.constants import CardType, CardStatus

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.tag import Tag


class Card(Base, UUIDMixin, TimestampMixin):
    """
    Card (Note) model.
    
    The content field stores type-specific data as JSONB,
    allowing different card types to have different structures.
    
    Attributes:
        id: Unique identifier (UUID)
        title: Card title
        card_type: Type of card (text, checklist, image, etc.)
        content: JSONB field storing card-specific content
        status: Card status (active, archived, deleted)
        position: Order position for sorting
        owner_id: Foreign key to user
        owner: Relationship to User
        tags: Many-to-many relationship to Tags
    
    Example content structures:
        Text card: {"text": "Content here", "format": "markdown"}
        Checklist card: {"items": [{"text": "Item 1", "checked": false}]}
        Image card: {"url": "...", "caption": "...", "alt_text": "..."}
        Link card: {"url": "...", "title": "...", "description": "..."}
        Code card: {"code": "...", "language": "python"}
    """
    
    __tablename__ = "cards"

    title: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )
    card_type: Mapped[str] = mapped_column(
        String(50),
        default=CardType.TEXT.value,
        nullable=False,
        index=True,
    )
    content: Mapped[dict] = mapped_column(
        JSONB,
        default=dict,
        nullable=False,
    )
    status: Mapped[str] = mapped_column(
        String(50),
        default=CardStatus.ACTIVE.value,
        nullable=False,
        index=True,
    )
    position: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )
    
    # Foreign Keys
    owner_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # Relationships
    owner: Mapped["User"] = relationship(
        "User",
        back_populates="cards",
    )
    tags: Mapped[List["Tag"]] = relationship(
        "Tag",
        secondary="card_tags",
        back_populates="cards",
        lazy="selectin",
    )

    def __repr__(self) -> str:
        return f"<Card(id={self.id}, title={self.title}, type={self.card_type})>"
