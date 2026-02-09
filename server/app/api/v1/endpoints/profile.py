"""
Profile API Endpoints

Secure profile management endpoints using JWT authentication.
All data queries use the user's own JWT (RLS enforced via PostgREST).
"""

from fastapi import APIRouter, Depends, HTTPException, status
from supabase import Client

from app.core import CurrentUser, verify_user, get_rls_client
from app.schemas.profile import (
    ProfileResponse,
    ProfileUpdate,
    AvatarOptionsResponse,
    AVATAR_OPTIONS_LIST,
)
from app.services.profile_service import ProfileService, ProfileServiceError

router = APIRouter()


@router.get(
    "/me",
    response_model=ProfileResponse,
    summary="Get current user's profile",
    description="Retrieves the authenticated user's profile including subscription status.",
)
async def get_my_profile(
    current_user: CurrentUser = Depends(verify_user),
    db: Client = Depends(get_rls_client),
) -> ProfileResponse:
    """
    Get the current user's profile.
    
    - Validates JWT token
    - Fetches profile from Supabase using RLS-bound client
    - Returns profile with subscription info
    """
    service = ProfileService(db)
    
    try:
        profile = await service.get_profile(current_user.id)
        
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Profile not found. Please complete registration.",
            )
        
        return profile
        
    except ProfileServiceError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e),
        )


@router.put(
    "/me",
    response_model=ProfileResponse,
    summary="Update current user's profile",
    description="Updates the authenticated user's profile details.",
)
async def update_my_profile(
    update_data: ProfileUpdate,
    current_user: CurrentUser = Depends(verify_user),
    db: Client = Depends(get_rls_client),
) -> ProfileResponse:
    """
    Update the current user's profile.
    
    - Validates JWT token
    - Validates input using Pydantic
    - Updates ONLY the authenticated user's record (enforced by RLS)
    - Returns updated profile
    """
    service = ProfileService(db)
    
    try:
        updated_profile = await service.update_profile(current_user.id, update_data)
        return updated_profile
        
    except ProfileServiceError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e),
        )


@router.delete(
    "/me",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete current user's account",
    description="Permanently deletes the authenticated user's account and all associated data.",
)
async def delete_my_account(
    current_user: CurrentUser = Depends(verify_user),
    db: Client = Depends(get_rls_client),
) -> None:
    """
    Delete the current user's account.
    
    - Validates JWT token
    - Deletes user from Supabase Auth (cascades to profiles)
    - Note: delete_account internally uses admin client for auth.admin
    - Returns 204 No Content on success
    """
    service = ProfileService(db)
    
    try:
        await service.delete_account(current_user.id)
        
    except ProfileServiceError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e),
        )


@router.get(
    "/avatars",
    response_model=AvatarOptionsResponse,
    summary="Get available avatar options",
    description="Returns a list of Netflix-style avatar URLs to choose from.",
)
async def get_avatar_options() -> AvatarOptionsResponse:
    """
    Get available avatar options.
    
    This endpoint is public (no auth required) as it just returns
    the list of available avatar URLs.
    """
    return AvatarOptionsResponse(avatars=AVATAR_OPTIONS_LIST)
