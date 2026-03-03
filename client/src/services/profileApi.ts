/**
 * Profile API Service
 *
 * Handles all profile-related data calls using server actions.
 * Aligned with new DB schema (profiles table, subscription_tier).
 */

import {
  getMyProfile,
  updateMyProfile,
  deleteMyAccount,
  getAvatarOptions as getAvatarOptionsAction,
} from "@/actions/profile";

// =============================================================================
// Types (aligned with new DB schema)
// =============================================================================

export interface SubscriptionInfo {
  tier: "free" | "premium";
  is_active: boolean;
  creations_count_free: number;
  creations_count_pro: number;
  additional_creation_free: number;
  additional_creation_pro: number;
  premium_start: string | null;
  premium_expiry: string | null;
  creation_limit: number | null;
}

export interface ProfileData {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  date_of_birth: string | null;
  avatar_url: string | null;
  created_at: string | null;
  updated_at: string | null;
  subscription: SubscriptionInfo;
}

export interface ProfileUpdateData {
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
  avatar_url?: string;
}

export interface AvatarOptions {
  avatars: string[];
}

// Re-export ApiError for convenience
export interface ApiError {
  message: string;
  detail?: string;
  status: number;
}

// =============================================================================
// Profile API Functions
// =============================================================================

/**
 * Fetch the current user's profile from the backend.
 */
export async function getProfile(): Promise<ProfileData> {
  const result = await getMyProfile();

  if ("error" in result) {
    throw { message: result.error, status: result.status };
  }

  return result.data;
}

/**
 * Update the current user's profile (PATCH).
 */
export async function updateProfile(updateData: ProfileUpdateData): Promise<ProfileData> {
  const result = await updateMyProfile({ ...updateData });

  if ("error" in result) {
    throw { message: result.error, status: result.status };
  }

  return result.data;
}

/**
 * Delete the current user's account.
 */
export async function deleteAccount(): Promise<void> {
  const result = await deleteMyAccount();
  if ("error" in result) {
    throw { message: result.error, status: result.status };
  }
}

/**
 * Get available avatar options (Netflix-style).
 * This endpoint doesn't require authentication.
 */
export async function getAvatarOptions(): Promise<string[]> {
  const result = await getAvatarOptionsAction();
  return result.avatars;
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Format subscription tier name in Hebrew.
 */
export function formatTierName(tier: string): string {
  const tiers: Record<string, string> = {
    free: "חינמי",
    premium: "פרימיום",
  };
  return tiers[tier] || tier;
}

/**
 * Check if premium subscription is expiring soon (within 7 days).
 */
export function isExpiringSoon(premiumExpiry: string | null): boolean {
  if (!premiumExpiry) return false;

  const expiry = new Date(premiumExpiry);
  const now = new Date();
  const daysUntilExpiry = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

  return daysUntilExpiry > 0 && daysUntilExpiry <= 7;
}
