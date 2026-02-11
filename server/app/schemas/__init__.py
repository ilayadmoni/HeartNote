"""
Pydantic Schemas (Request/Response Validation)

All request and response models are defined here.
Uses Pydantic v2 with strict validation.
"""

from app.schemas.user import (
    UserCreate,
    UserUpdate,
    UserResponse,
    UserInDB,
)
from app.schemas.card import (
    CardCreate,
    CardUpdate,
    CardResponse,
)
from app.schemas.tag import (
    TagCreate,
    TagUpdate,
    TagResponse,
)
from app.schemas.auth import (
    Token,
    TokenPayload,
    LoginRequest,
    RegisterRequest,
)
from app.schemas.profile import (
    ProfileResponse,
    ProfileUpdate,
    SubscriptionInfo,
    SubscriptionTier,
    AvatarOptionsResponse,
    AVATAR_OPTIONS_LIST,
)

__all__ = [
    # User
    "UserCreate",
    "UserUpdate",
    "UserResponse",
    "UserInDB",
    # Card
    "CardCreate",
    "CardUpdate",
    "CardResponse",
    # Tag
    "TagCreate",
    "TagUpdate",
    "TagResponse",
    # Auth
    "Token",
    "TokenPayload",
    "LoginRequest",
    "RegisterRequest",
    # Profile
    "ProfileResponse",
    "ProfileUpdate",
    "SubscriptionInfo",
    "SubscriptionTier",
    "AvatarOptionsResponse",
    "AVATAR_OPTIONS_LIST",
]
