"""
Application Constants

Centralized location for all application constants.
"""

from enum import Enum


class CardType(str, Enum):
    """
    Available card types in HeartNote.
    Extensible enum for adding new card types.
    """
    TEXT = "text"
    CHECKLIST = "checklist"
    IMAGE = "image"
    LINK = "link"
    CODE = "code"
    QUOTE = "quote"


class CardStatus(str, Enum):
    """Card status options."""
    ACTIVE = "active"
    ARCHIVED = "archived"
    DELETED = "deleted"


class UserRole(str, Enum):
    """User role options."""
    USER = "user"
    ADMIN = "admin"
    SUPER_ADMIN = "super_admin"


# Pagination defaults
DEFAULT_PAGE_SIZE = 20
MAX_PAGE_SIZE = 100

# Content limits
MAX_CARD_TITLE_LENGTH = 200
MAX_CARD_CONTENT_LENGTH = 50000
MAX_TAG_NAME_LENGTH = 50
MAX_TAGS_PER_CARD = 10

# File upload limits
MAX_FILE_SIZE_MB = 10
ALLOWED_IMAGE_EXTENSIONS = {"jpg", "jpeg", "png", "gif", "webp", "svg"}
