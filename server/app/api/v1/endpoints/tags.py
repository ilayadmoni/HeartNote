"""Tags Endpoints"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.schemas.tag import TagCreate, TagUpdate, TagResponse
from app.models.tag import Tag
from app.api.v1.deps import get_current_user
from app.models.user import User

router = APIRouter()


@router.get("/", response_model=List[TagResponse])
async def get_tags(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Get all tags for current user."""
    result = await db.execute(select(Tag).where(Tag.owner_id == current_user.id))
    return list(result.scalars().all())


@router.post("/", response_model=TagResponse, status_code=status.HTTP_201_CREATED)
async def create_tag(data: TagCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Create a new tag."""
    tag = Tag(name=data.name, color=data.color, owner_id=current_user.id)
    db.add(tag)
    await db.flush()
    await db.refresh(tag)
    return tag


@router.delete("/{tag_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_tag(tag_id: str, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Delete a tag."""
    result = await db.execute(select(Tag).where(Tag.id == tag_id, Tag.owner_id == current_user.id))
    tag = result.scalar_one_or_none()
    if not tag:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tag not found")
    await db.delete(tag)
