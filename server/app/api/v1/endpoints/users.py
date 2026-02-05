"""Users Endpoints"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.schemas.user import UserResponse, UserUpdate
from app.services.user_service import UserService
from app.api.v1.deps import get_current_user
from app.models.user import User

router = APIRouter()


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current authenticated user."""
    return current_user


@router.patch("/me", response_model=UserResponse)
async def update_current_user(
    data: UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update current user profile."""
    user_service = UserService(db)
    return await user_service.update(db_obj=current_user, obj_in=data)


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: str, db: AsyncSession = Depends(get_db)):
    """Get user by ID."""
    user_service = UserService(db)
    user = await user_service.get(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user
