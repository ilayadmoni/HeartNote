"""
Database Migration: Add supabase_id column to users table

Run this script to add the supabase_id column for Supabase authentication integration.

Usage:
    python -m scripts.add_supabase_id_column
"""

import asyncio
from sqlalchemy import text
from app.db.session import engine


async def migrate():
    """Add supabase_id column to users table if it doesn't exist."""
    async with engine.begin() as conn:
        # Check if column exists
        result = await conn.execute(text("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'supabase_id'
        """))
        
        if result.fetchone() is None:
            # Add the column
            await conn.execute(text("""
                ALTER TABLE users 
                ADD COLUMN supabase_id VARCHAR(255) UNIQUE
            """))
            
            # Create index
            await conn.execute(text("""
                CREATE INDEX ix_users_supabase_id ON users(supabase_id)
            """))
            
            print("✅ Added supabase_id column to users table")
        else:
            print("ℹ️ supabase_id column already exists")


if __name__ == "__main__":
    asyncio.run(migrate())
