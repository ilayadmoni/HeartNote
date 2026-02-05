"""Card Service - Card business logic"""

from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.card import Card
from app.models.tag import Tag
from app.schemas.card import CardCreate, CardUpdate
from app.services.base import BaseService
from app.core.constants import CardStatus


class CardService(BaseService[Card, CardCreate, CardUpdate]):
    def __init__(self, db: AsyncSession):
        super().__init__(Card, db)

    async def get_by_owner(self, owner_id: str, status: Optional[CardStatus] = None) -> List[Card]:
        query = select(Card).where(Card.owner_id == owner_id)
        if status:
            query = query.where(Card.status == status.value)
        query = query.order_by(Card.position)
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def create_with_tags(self, obj_in: CardCreate, owner_id: str) -> Card:
        card = Card(
            title=obj_in.title,
            card_type=obj_in.card_type.value,
            content=obj_in.content,
            owner_id=owner_id,
        )
        if obj_in.tag_ids:
            result = await self.db.execute(select(Tag).where(Tag.id.in_(obj_in.tag_ids)))
            card.tags = list(result.scalars().all())
        self.db.add(card)
        await self.db.flush()
        await self.db.refresh(card)
        return card
