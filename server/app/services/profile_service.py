"""
Profile Service
Handles all profile-related database operations via Supabase.

Security model:
- Read / update operations receive an RLS-bound client (user's JWT)
  so that Postgres enforces row-level access automatically.
- Account deletion requires admin privileges (auth.admin.delete_user)
  and uses the admin client explicitly.
"""

from datetime import datetime, date
from typing import Optional, Any

from supabase import Client

from app.db.supabase import get_admin_supabase_client
from app.schemas.profile import (
    ProfileResponse,
    ProfileUpdate,
    SubscriptionInfo,
    SubscriptionType,
)


class ProfileServiceError(Exception):
    """Custom exception for profile service errors."""
    pass


class ProfileService:
    """
    Service for profile CRUD operations via Supabase.

    The caller is responsible for passing the correct ``Client``:
    - user-facing operations → RLS client (``get_user_supabase_client``)
    - admin operations → admin client (``get_admin_supabase_client``)
    """
    
    def __init__(self, client: Client):
        """
        Args:
            client: A Supabase ``Client`` – either RLS-bound or admin.
        """
        self.client = client
        self.table = "profiles"
    
    async def get_profile(self, user_id: str) -> Optional[ProfileResponse]:
        """
        Fetch user profile by Supabase user ID.
        
        Args:
            user_id: The Supabase auth.users.id (UUID)
            
        Returns:
            ProfileResponse or None if not found
        """
        try:
            response = self.client.table(self.table).select("*").eq("id", user_id).single().execute()
            
            if not response.data:
                return None
            
            data = response.data
            
            # Build subscription info
            subscription = SubscriptionInfo(
                plan=SubscriptionType(data.get("subscription_type", "free")),
                is_active=self._is_subscription_active(data.get("subscription_expires_at")),
                expires_at=self._parse_datetime(data.get("subscription_expires_at")),
            )
            
            # Build full profile response
            return ProfileResponse(
                id=data["id"],
                email=data["email"],
                first_name=data.get("first_name"),
                last_name=data.get("last_name"),
                full_name=data.get("full_name"),
                date_of_birth=self._parse_date(data.get("date_of_birth")),
                avatar_url=data.get("avatar_url"),
                created_at=self._parse_datetime(data["created_at"]),
                updated_at=self._parse_datetime(data["updated_at"]),
                subscription=subscription,
            )
            
        except Exception as e:
            raise ProfileServiceError(f"Failed to fetch profile: {str(e)}")
    
    async def update_profile(
        self,
        user_id: str,
        update_data: ProfileUpdate
    ) -> ProfileResponse:
        """
        Update user profile.
        
        Args:
            user_id: The Supabase auth.users.id (UUID)
            update_data: ProfileUpdate with fields to update
            
        Returns:
            Updated ProfileResponse
        """
        try:
            # Build update dict, excluding None values
            update_dict: dict[str, Any] = {}
            
            if update_data.first_name is not None:
                update_dict["first_name"] = update_data.first_name
            
            if update_data.last_name is not None:
                update_dict["last_name"] = update_data.last_name
            
            if update_data.date_of_birth is not None:
                update_dict["date_of_birth"] = update_data.date_of_birth.isoformat()
            
            if update_data.avatar_url is not None:
                update_dict["avatar_url"] = update_data.avatar_url
            
            # Update full_name if first or last name changed
            if "first_name" in update_dict or "last_name" in update_dict:
                # Fetch current values if not provided
                current = await self.get_profile(user_id)
                first = update_dict.get("first_name", current.first_name if current else "")
                last = update_dict.get("last_name", current.last_name if current else "")
                update_dict["full_name"] = f"{first or ''} {last or ''}".strip()
            
            if not update_dict:
                # Nothing to update, just return current profile
                profile = await self.get_profile(user_id)
                if not profile:
                    raise ProfileServiceError("Profile not found")
                return profile
            
            # Perform update
            response = self.client.table(self.table).update(update_dict).eq("id", user_id).execute()
            
            if not response.data:
                raise ProfileServiceError("Failed to update profile")
            
            # Return updated profile
            updated_profile = await self.get_profile(user_id)
            if not updated_profile:
                raise ProfileServiceError("Profile not found after update")
            
            return updated_profile
            
        except ProfileServiceError:
            raise
        except Exception as e:
            raise ProfileServiceError(f"Failed to update profile: {str(e)}")
    
    async def delete_account(self, user_id: str) -> bool:
        """
        Delete user account. This deletes from auth.users which cascades to profiles.
        
        Note: This **requires** the admin/service-role client because
        ``auth.admin.delete_user`` is a privileged operation.
        
        Args:
            user_id: The Supabase auth.users.id (UUID)
            
        Returns:
            True if successful
        """
        try:
            # Always use admin client for auth admin operations
            admin_client = get_admin_supabase_client()
            admin_client.auth.admin.delete_user(user_id)
            return True
        except Exception as e:
            raise ProfileServiceError(f"Failed to delete account: {str(e)}")
    
    @staticmethod
    def _is_subscription_active(expires_at: Optional[str]) -> bool:
        """Check if subscription is still active."""
        if not expires_at:
            return True  # Free tier is always active
        try:
            expiry = datetime.fromisoformat(expires_at.replace("Z", "+00:00"))
            return expiry > datetime.now(expiry.tzinfo)
        except (ValueError, AttributeError):
            return True
    
    @staticmethod
    def _parse_datetime(dt_str: Optional[str]) -> Optional[datetime]:
        """Parse ISO datetime string."""
        if not dt_str:
            return None
        try:
            return datetime.fromisoformat(dt_str.replace("Z", "+00:00"))
        except (ValueError, AttributeError):
            return None
    
    @staticmethod
    def _parse_date(date_str: Optional[str]) -> Optional[date]:
        """Parse ISO date string."""
        if not date_str:
            return None
        try:
            return date.fromisoformat(date_str)
        except (ValueError, AttributeError):
            return None
