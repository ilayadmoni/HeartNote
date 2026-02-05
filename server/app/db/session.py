"""
Database Session Management

Async PostgreSQL connection using SQLAlchemy 2.0.
Provides dependency injection for FastAPI routes.
"""

from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import text

from app.core.config import settings


# Create async engine with connection pooling
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
    pool_recycle=3600,
)

# Create async session factory
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


class Base(DeclarativeBase):
    """
    Base class for all SQLAlchemy models.
    All models should inherit from this class.
    """
    pass


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency injection for database sessions.
    
    Usage:
        @router.get("/items")
        async def get_items(db: AsyncSession = Depends(get_db)):
            ...
    
    Yields:
        AsyncSession: Database session that auto-closes after request
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def init_db() -> None:
    """
    Initialize database tables.
    Called during application startup.
    """
    async with engine.begin() as conn:
        # Import all models to ensure they're registered
        from app.models import user, card, tag  # noqa: F401
        
        # Create all tables
        await conn.run_sync(Base.metadata.create_all)


async def check_db_connection() -> bool:
    """
    Check database connectivity for health checks.
    
    Returns:
        bool: True if database is accessible, False otherwise
    """
    try:
        async with AsyncSessionLocal() as session:
            await session.execute(text("SELECT 1"))
            return True
    except Exception:
        return False
