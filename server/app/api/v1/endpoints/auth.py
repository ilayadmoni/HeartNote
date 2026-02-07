"""
Auth Endpoints
Provides user info for authenticated requests (Auth is handled by Supabase on Frontend)
"""

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.core import CurrentUser, verify_user
from app.db.supabase import get_supabase_client

router = APIRouter()


class UserProfile(BaseModel):
    """User profile response"""
    id: str
    email: str | None
    full_name: str | None
    avatar_url: str | None
    subscription_type: str
    created_at: str


@router.get("/me", response_model=UserProfile)
async def get_current_user_profile(
    current_user: CurrentUser = Depends(verify_user),
):
    """
    Get the current authenticated user's profile.
    Token is verified locally, then profile is fetched from DB.
    """
    supabase = get_supabase_client()

    result = supabase.table("profiles").select(
        "id, email, full_name, avatar_url, subscription_type, created_at"
    ).eq("id", current_user.id).single().execute()

    if not result.data:
        # Profile doesn't exist yet - this shouldn't happen if trigger works
        # But handle gracefully
        return UserProfile(
            id=current_user.id,
            email=current_user.email,
            full_name=None,
            avatar_url=None,
            subscription_type="free",
            created_at="",
        )

    profile = result.data
    return UserProfile(
        id=profile["id"],
        email=profile.get("email"),
        full_name=profile.get("full_name"),
        avatar_url=profile.get("avatar_url"),
        subscription_type=profile.get("subscription_type", "free"),
        created_at=profile.get("created_at", ""),
    )


class UpdateProfileRequest(BaseModel):
    """Request to update profile"""
    full_name: str | None = None
    avatar_url: str | None = None


@router.patch("/me", response_model=UserProfile)
async def update_profile(
    request: UpdateProfileRequest,
    current_user: CurrentUser = Depends(verify_user),
):
    """Update the current user's profile"""
    supabase = get_supabase_client()

    update_data = {}
    if request.full_name is not None:
        update_data["full_name"] = request.full_name
    if request.avatar_url is not None:
        update_data["avatar_url"] = request.avatar_url

    if not update_data:
        # Nothing to update, just return current profile
        return await get_current_user_profile(current_user)

    result = supabase.table("profiles").update(
        update_data
    ).eq("id", current_user.id).execute()

    if not result.data:
        return await get_current_user_profile(current_user)

    profile = result.data[0]
    return UserProfile(
        id=profile["id"],
        email=profile.get("email"),
        full_name=profile.get("full_name"),
        avatar_url=profile.get("avatar_url"),
        subscription_type=profile.get("subscription_type", "free"),
        created_at=profile.get("created_at", ""),
    )
