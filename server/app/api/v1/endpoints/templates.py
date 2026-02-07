"""
Templates API Endpoint
Handles template listing and management
"""

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from app.core import CurrentUser, verify_user_optional
from app.db.supabase import get_supabase_client

router = APIRouter()


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
    
    Public endpoint but premium templates may be marked for authenticated users.
    """
    supabase = get_supabase_client()

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
    """Get a single template by ID"""
    supabase = get_supabase_client()

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
    """Get a template by its component key"""
    supabase = get_supabase_client()

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
