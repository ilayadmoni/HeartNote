"""Cards Endpoints"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.schemas.card import CardCreate, CardUpdate, CardResponse
from app.services.card_service import CardService
from app.api.v1.deps import get_current_user
from app.models.user import User

router = APIRouter()


@router.get("/", response_model=List[CardResponse])
async def get_cards(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get all cards for current user."""
    card_service = CardService(db)
    return await card_service.get_by_owner(current_user.id)


@router.post("/", response_model=CardResponse, status_code=status.HTTP_201_CREATED)
async def create_card(
    data: CardCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new card."""
    card_service = CardService(db)
    return await card_service.create_with_tags(data, current_user.id)


@router.get("/{card_id}", response_model=CardResponse)
async def get_card(
    card_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a specific card."""
    card_service = CardService(db)
    card = await card_service.get(card_id)
    if not card or card.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Card not found")
    return card


@router.patch("/{card_id}", response_model=CardResponse)
async def update_card(
    card_id: str,
    data: CardUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update a card."""
    card_service = CardService(db)
    card = await card_service.get(card_id)
    if not card or card.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Card not found")
    return await card_service.update(db_obj=card, obj_in=data)


@router.delete("/{card_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_card(
    card_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a card."""
    card_service = CardService(db)
    card = await card_service.get(card_id)
    if not card or card.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Card not found")
    await card_service.delete(card_id)
