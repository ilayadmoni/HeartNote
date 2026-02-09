"""
Templates API Endpoint
Handles template listing and management.

Templates are public data so most endpoints are unauthenticated.
We use the ANON key client (not admin) to respect any RLS policies on the
templates table.  When a user is authenticated, their JWT is forwarded so
RLS can distinguish premium access if needed.
"""

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from supabase import Client

from app.core import CurrentUser, verify_user_optional
from app.db.supabase import get_user_supabase_client
from app.core.config import get_settings

router = APIRouter()


def _get_anon_client() -> Client:
    """Get an anon-key Supabase client for public queries."""
    from supabase import create_client
    settings = get_settings()
    return create_client(settings.supabase_url, settings.supabase_anon_key)


class TemplateResponse(BaseModel):
    """Template data for frontend"""
    id: str
    name: str
    name_he: str | None
    description: str | None
    description_he: str | None
    component_key: str
    is_premium: bool
    category: str | None
    config_schema: dict[str, Any]
    example_data: dict[str, Any]


class TemplateSyncItem(BaseModel):
    """Template item for sync endpoint"""
    component_key: str
    name: str
    name_he: str | None = None
    description: str | None = None
    description_he: str | None = None
    category: str = "general"
    is_premium: bool = False
    config_schema: dict[str, Any] = {}
    example_data: dict[str, Any] = {}


@router.get("", response_model=list[TemplateResponse])
async def get_templates(
    current_user: CurrentUser | None = Depends(verify_user_optional),
):
    """
    Get all active templates.
    
    Public endpoint — uses the user's RLS client when authenticated,
    otherwise falls back to anon-key client.
    """
    if current_user and current_user.access_token:
        supabase = get_user_supabase_client(current_user.access_token)
    else:
        supabase = _get_anon_client()

    result = supabase.table("templates").select(
        "id, name, name_he, description, description_he, "
        "component_key, is_premium, category, config_schema, example_data"
    ).eq(
        "is_active", True
    ).order(
        "sort_order", desc=False
    ).execute()

    templates = []
    for t in result.data or []:
        templates.append(TemplateResponse(
            id=t["id"],
            name=t["name"],
            name_he=t.get("name_he"),
            description=t.get("description"),
            description_he=t.get("description_he"),
            component_key=t["component_key"],
            is_premium=t.get("is_premium", False),
            category=t.get("category"),
            config_schema=t.get("config_schema", {}),
            example_data=t.get("example_data", {}),
        ))

    return templates


@router.get("/{template_id}", response_model=TemplateResponse)
async def get_template(template_id: str):
    """Get a single template by ID (public, anon client)"""
    supabase = _get_anon_client()

    result = supabase.table("templates").select(
        "id, name, name_he, description, description_he, "
        "component_key, is_premium, category, config_schema, example_data"
    ).eq("id", template_id).eq("is_active", True).single().execute()

    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Template not found",
        )

    t = result.data
    return TemplateResponse(
        id=t["id"],
        name=t["name"],
        name_he=t.get("name_he"),
        description=t.get("description"),
        description_he=t.get("description_he"),
        component_key=t["component_key"],
        is_premium=t.get("is_premium", False),
        category=t.get("category"),
        config_schema=t.get("config_schema", {}),
        example_data=t.get("example_data", {}),
    )


@router.get("/by-key/{component_key}", response_model=TemplateResponse)
async def get_template_by_key(component_key: str):
    """Get a template by its component key (public, anon client)"""
    supabase = _get_anon_client()

    result = supabase.table("templates").select(
        "id, name, name_he, description, description_he, "
        "component_key, is_premium, category, config_schema, example_data"
    ).eq("component_key", component_key).eq("is_active", True).single().execute()

    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Template not found",
        )

    t = result.data
    return TemplateResponse(
        id=t["id"],
        name=t["name"],
        name_he=t.get("name_he"),
        description=t.get("description"),
        description_he=t.get("description_he"),
        component_key=t["component_key"],
        is_premium=t.get("is_premium", False),
        category=t.get("category"),
        config_schema=t.get("config_schema", {}),
        example_data=t.get("example_data", {}),
    )
