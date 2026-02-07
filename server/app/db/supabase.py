"""
Supabase Client
Provides a singleton instance of the Supabase client.
"""

from supabase import create_client, Client
from app.core.config import settings


def get_supabase_client() -> Client:
    """
    Get the Supabase client instance.
    
    Uses the service role key if available, otherwise the anon key.
    Note: Ideally, for RLS context, you should create a client 
    scoped to the user's JWT, but for now we use the global client.
    """
    if not settings.supabase_url:
        raise ValueError("SUPABASE_URL is not set")
        
    key = settings.supabase_service_role_key or settings.supabase_anon_key
    
    if not key:
        raise ValueError("SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY is not set")
        
    return create_client(settings.supabase_url, key)
