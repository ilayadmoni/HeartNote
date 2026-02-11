"""
Auth Endpoints
Provides user info for authenticated requests (Auth is handled by Supabase on Frontend).

Security: Uses ``get_rls_client`` so all Supabase queries respect RLS.
"""

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from supabase import Client

from app.core import CurrentUser, verify_user, get_rls_client

router = APIRouter()


class UserProfile(BaseModel):
    """User profile response"""
    id: str
    email: str | None
    first_name: str | None
    last_name: str | None
    avatar_url: str | None
    subscription_tier: str
    created_at: str


@router.get("/me", response_model=UserProfile)
async def get_current_user_profile(
    current_user: CurrentUser = Depends(verify_user),
    supabase: Client = Depends(get_rls_client),
):
    """
    Get the current authenticated user's profile.
    Token is verified locally, then profile is fetched with RLS enforced.
    """
    result = supabase.table("profiles").select(
        "id, email, first_name, last_name, avatar_url, subscription_tier, created_at"
    ).eq("id", current_user.id).single().execute()

    if not result.data:
        return UserProfile(
            id=current_user.id,
            email=current_user.email,
            first_name=None,
            last_name=None,
            avatar_url=None,
            subscription_tier="free",
            created_at="",
        )

    profile = result.data
    return UserProfile(
        id=profile["id"],
        email=profile.get("email"),
        first_name=profile.get("first_name"),
        last_name=profile.get("last_name"),
        avatar_url=profile.get("avatar_url"),
        subscription_tier=profile.get("subscription_tier", "free"),
        created_at=profile.get("created_at", ""),
    )


class UpdateProfileRequest(BaseModel):
    """Request to update profile"""
    first_name: str | None = None
    last_name: str | None = None
    avatar_url: str | None = None


@router.patch("/me", response_model=UserProfile)
async def update_profile(
    request: UpdateProfileRequest,
    current_user: CurrentUser = Depends(verify_user),
    supabase: Client = Depends(get_rls_client),
):
    """Update the current user's profile (RLS enforced)"""
    update_data = {}
    if request.first_name is not None:
        update_data["first_name"] = request.first_name
    if request.last_name is not None:
        update_data["last_name"] = request.last_name
    if request.avatar_url is not None:
        update_data["avatar_url"] = request.avatar_url

    if not update_data:
        return await get_current_user_profile(current_user, supabase)

    result = supabase.table("profiles").update(
        update_data
    ).eq("id", current_user.id).execute()

    if not result.data:
        return await get_current_user_profile(current_user, supabase)

    profile = result.data[0]
    return UserProfile(
        id=profile["id"],
        email=profile.get("email"),
        first_name=profile.get("first_name"),
        last_name=profile.get("last_name"),
        avatar_url=profile.get("avatar_url"),
        subscription_tier=profile.get("subscription_tier", "free"),
        created_at=profile.get("created_at", ""),
    )
