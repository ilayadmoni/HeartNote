"""
Database Base - Central import point for all models

Import all models here to ensure they are registered with SQLAlchemy
before database initialization.
"""

# Import Base for model inheritance
from app.db.session import Base

# Import all models to register them with SQLAlchemy
from app.models.user import User  # noqa: F401
from app.models.card import Card  # noqa: F401
from app.models.tag import Tag  # noqa: F401

__all__ = ["Base"]
