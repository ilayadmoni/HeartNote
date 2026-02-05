"""
User Model

Database model for user accounts.
"""

from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import Boolean, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base
from app.models.base import TimestampMixin, UUIDMixin
from app.core.constants import UserRole

if TYPE_CHECKING:
    from app.models.card import Card


class User(Base, UUIDMixin, TimestampMixin):
    """
    User account model.
    
    Attributes:
        id: Unique identifier (UUID)
        email: User's email address (unique)
        hashed_password: Bcrypt hashed password
        full_name: User's display name
        role: User role (user, admin, super_admin)
        is_active: Whether the account is active
        is_verified: Whether email is verified
        avatar_url: URL to user's avatar image
        preferences: JSONB field for user preferences
        cards: Relationship to user's cards
    """
    
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
        nullable=False,
    )
    hashed_password: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    full_name: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
    )
    role: Mapped[str] = mapped_column(
        String(50),
        default=UserRole.USER.value,
        nullable=False,
    )
    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )
    is_verified: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )
    avatar_url: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )
    preferences: Mapped[Optional[dict]] = mapped_column(
        JSONB,
        default=dict,
        nullable=True,
    )

    # Relationships
    cards: Mapped[List["Card"]] = relationship(
        "Card",
        back_populates="owner",
        cascade="all, delete-orphan",
        lazy="selectin",
    )

    def __repr__(self) -> str:
        return f"<User(id={self.id}, email={self.email})>"
