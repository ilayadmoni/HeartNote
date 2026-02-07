"""API Dependencies - Authentication and authorization"""

from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.user import User
from app.core.security import decode_token
from app.core.supabase_auth import decode_supabase_token, extract_user_info
from app.services.user_service import UserService

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db),
) -> User:
    """
    Dependency to get current authenticated user.
    
    Supports both:
    1. Supabase JWT tokens (from frontend auth)
    2. Internal JWT tokens (from backend auth)
    
    For Supabase tokens, it will auto-create/sync the user in local DB.
    """
    token = credentials.credentials
    user_service = UserService(db)
    
    # Try internal JWT first
    internal_payload = decode_token(token)
    if internal_payload and internal_payload.get("type") == "access":
        user = await user_service.get(internal_payload["sub"])
        if user and user.is_active:
            return user
    
    # Try Supabase JWT
    supabase_payload = decode_supabase_token(token)
    if supabase_payload:
        user_info = extract_user_info(supabase_payload)
        supabase_id = user_info.get("supabase_id")
        email = user_info.get("email")
        
        if not supabase_id or not email:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid Supabase token: missing user info",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Try to find existing user by supabase_id or email
        user = await user_service.get_by_supabase_id(supabase_id)
        if not user:
            user = await user_service.get_by_email(email)
        
        if user:
            # Update supabase_id if not set
            if not user.supabase_id:
                user = await user_service.update_supabase_id(user.id, supabase_id)
            if user and user.is_active:
                return user
        else:
            # Auto-create user from Supabase
            from app.schemas.user import UserCreate
            user = await user_service.create_from_supabase(
                supabase_id=supabase_id,
                email=email,
                full_name=user_info.get("full_name") or email.split("@")[0],
            )
            if user:
                return user
    
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired token",
        headers={"WWW-Authenticate": "Bearer"},
    )


async def get_current_active_superuser(current_user: User = Depends(get_current_user)) -> User:
    """Dependency to require superuser role."""
    from app.core.constants import UserRole
    if current_user.role != UserRole.SUPER_ADMIN.value:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
    return current_user
