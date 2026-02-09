"""
Profile Schemas
Pydantic models for profile request/response validation.
"""

from datetime import date, datetime
from typing import Optional
from enum import Enum

from pydantic import BaseModel, Field, EmailStr


class SubscriptionType(str, Enum):
    """Subscription plan types."""
    FREE = "free"
    PRO = "pro"
    PREMIUM = "premium"


class AvatarOption(str, Enum):
    """Available Netflix-style avatar options."""
    AVATAR_1 = "https://api.dicebear.com/7.x/personas/svg?seed=felix&backgroundColor=b6e3f4"
    AVATAR_2 = "https://api.dicebear.com/7.x/personas/svg?seed=aneka&backgroundColor=c0aede"
    AVATAR_3 = "https://api.dicebear.com/7.x/personas/svg?seed=jade&backgroundColor=d1d4f9"
    AVATAR_4 = "https://api.dicebear.com/7.x/personas/svg?seed=chase&backgroundColor=ffd5dc"
    AVATAR_5 = "https://api.dicebear.com/7.x/personas/svg?seed=bella&backgroundColor=ffdfbf"
    AVATAR_6 = "https://api.dicebear.com/7.x/personas/svg?seed=oliver&backgroundColor=c1f0c1"
    AVATAR_7 = "https://api.dicebear.com/7.x/personas/svg?seed=luna&backgroundColor=f9d1f9"
    AVATAR_8 = "https://api.dicebear.com/7.x/personas/svg?seed=max&backgroundColor=b8e0f7"


# List of avatar URLs for frontend consumption
AVATAR_OPTIONS_LIST = [avatar.value for avatar in AvatarOption]


class SubscriptionInfo(BaseModel):
    """Subscription status information."""
    plan: SubscriptionType = SubscriptionType.FREE
    is_active: bool = True
    expires_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class ProfileBase(BaseModel):
    """Base profile fields."""
    first_name: Optional[str] = Field(None, min_length=1, max_length=50)
    last_name: Optional[str] = Field(None, min_length=1, max_length=50)
    date_of_birth: Optional[date] = None
    avatar_url: Optional[str] = None


class ProfileUpdate(ProfileBase):
    """Schema for updating profile. All fields optional."""
    pass


class ProfileResponse(ProfileBase):
    """Full profile response with subscription info."""
    id: str
    email: EmailStr
    full_name: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    subscription: SubscriptionInfo
    
    class Config:
        from_attributes = True


class AvatarOptionsResponse(BaseModel):
    """Response containing available avatar options."""
    avatars: list[str]
