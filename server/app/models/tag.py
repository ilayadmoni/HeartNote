"""
Tag Model

Database model for tags that can be attached to cards.
"""

from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import Column, ForeignKey, String, Table
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base
from app.models.base import TimestampMixin, UUIDMixin

if TYPE_CHECKING:
    from app.models.card import Card


# Association table for many-to-many relationship between cards and tags
card_tags = Table(
    "card_tags",
    Base.metadata,
    Column(
        "card_id",
        UUID(as_uuid=False),
        ForeignKey("cards.id", ondelete="CASCADE"),
        primary_key=True,
    ),
    Column(
        "tag_id",
        UUID(as_uuid=False),
        ForeignKey("tags.id", ondelete="CASCADE"),
        primary_key=True,
    ),
)


class Tag(Base, UUIDMixin, TimestampMixin):
    """
    Tag model for categorizing cards.
    
    Attributes:
        id: Unique identifier (UUID)
        name: Tag name (unique per user)
        color: Hex color code for the tag
        owner_id: Foreign key to user who created the tag
        cards: Many-to-many relationship to Cards
    """
    
    __tablename__ = "tags"

    name: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index=True,
    )
    color: Mapped[Optional[str]] = mapped_column(
        String(7),  # Hex color: #RRGGBB
        default="#6366f1",
        nullable=True,
    )
    owner_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # Relationships
    cards: Mapped[List["Card"]] = relationship(
        "Card",
        secondary=card_tags,
        back_populates="tags",
        lazy="selectin",
    )

    def __repr__(self) -> str:
        return f"<Tag(id={self.id}, name={self.name})>"
