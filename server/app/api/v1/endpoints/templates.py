"""
Templates API Endpoint
Handles template listing and retrieval.
Aligned with the new `templates` table schema (005_destructive_reset).

Templates are public data — uses anon-key client.
New columns: slug, category (TEXT[]), tags, config_schema, expiration_policy.
Removed: name_he, description, description_he, component_key, example_data, sort_order.
"""

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from supabase import Client

from app.core import CurrentUser, verify_user_optional
from app.core.config import get_settings

router = APIRouter()


def _get_anon_client() -> Client:
    """Get an anon-key Supabase client for public queries."""
    from supabase import create_client
    settings = get_settings()
    return create_client(settings.supabase_url, settings.supabase_anon_key)


# ---------------------------------------------------------------------------
# Response models
# ---------------------------------------------------------------------------

class TemplateResponse(BaseModel):
    """Template data for frontend — matches new DB columns."""
    id: str
    slug: str
    name: str
    category: list[str] | None = None
    tags: str | None = None
    is_premium: bool = False
    config_schema: dict[str, Any] = {}
    is_active: bool = True
    expiration_policy: dict[str, Any] | None = None


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.get("", response_model=list[TemplateResponse])
async def get_templates(
    current_user: CurrentUser | None = Depends(verify_user_optional),
):
    """Get all active templates (public)."""
    supabase = _get_anon_client()

    result = (
        supabase.table("templates")
        .select("id, slug, name, category, tags, is_premium, config_schema, is_active, expiration_policy")
        .eq("is_active", True)
        .execute()
    )

    return [
        TemplateResponse(
            id=t["id"],
            slug=t["slug"],
            name=t["name"],
            category=t.get("category"),
            tags=t.get("tags"),
            is_premium=t.get("is_premium", False),
            config_schema=t.get("config_schema") or {},
            is_active=t.get("is_active", True),
            expiration_policy=t.get("expiration_policy"),
        )
        for t in (result.data or [])
    ]


@router.get("/{slug}", response_model=TemplateResponse)
async def get_template_by_slug(slug: str):
    """Get a single template by slug (public, anon client)."""
    supabase = _get_anon_client()

    result = (
        supabase.table("templates")
        .select("id, slug, name, category, tags, is_premium, config_schema, is_active, expiration_policy")
        .eq("slug", slug)
        .eq("is_active", True)
        .single()
        .execute()
    )

    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Template not found",
        )

    t = result.data
    return TemplateResponse(
        id=t["id"],
        slug=t["slug"],
        name=t["name"],
        category=t.get("category"),
        tags=t.get("tags"),
        is_premium=t.get("is_premium", False),
        config_schema=t.get("config_schema") or {},
        is_active=t.get("is_active", True),
        expiration_policy=t.get("expiration_policy"),
    )
