/**
 * Profile Types
 * TypeScript interfaces for profile data structures.
 * Aligned with new DB schema (profiles table, subscription_tier).
 */

// =============================================================================
// Subscription Types
// =============================================================================

export type SubscriptionTier = "free" | "lite" | "premium";

export interface SubscriptionInfo {
  tier: SubscriptionTier;
  is_active: boolean;
  creations_count_free: number;
  creations_count_pro: number;
  additional_creation_free: number;
  additional_creation_pro: number;
  premium_start: string | null;
  premium_expiry: string | null;
  creation_limit: number | null;
}

/** Token classes for the tier badge; display name/features come from `profile` messages. */
export interface TierConfig {
  iconBg: string;
  iconColor: string;
}

// =============================================================================
// Profile Types
// =============================================================================

export interface UserProfile {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  dateOfBirth: string | null;
  avatarUrl: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  subscription: SubscriptionInfo;
}

export interface ProfileUpdateData {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  avatarUrl?: string;
}

// =============================================================================
// Creation Types (replaces UserTemplate / page types)
// =============================================================================

export interface UserCreation {
  id: string;
  templateSlug: string;
  templateName: string;
  createdAt: string;
  expiresAt: string | null;
  isPaid: boolean | null;
}

// =============================================================================
// Component Props
// =============================================================================

export interface ProfileDesktopProps {
  className?: string;
}

export interface ProfileMobileProps {
  className?: string;
}

export interface ProfileProps {
  className?: string;
}

// Avatar options moved to ../constants/avatars.ts (kept re-exported below).
export type { AvatarOption } from "../constants/avatars";
export { HAPPY_AVATAR_OPTIONS, DEFAULT_AVATAR_OPTIONS, AVATAR_URLS } from "../constants/avatars";

// =============================================================================
// API Response Mapping
// =============================================================================

/**
 * Convert snake_case API response to camelCase frontend format.
 */
export function mapApiProfileToUserProfile(apiProfile: {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  date_of_birth: string | null;
  avatar_url: string | null;
  created_at: string | null;
  updated_at: string | null;
  subscription: SubscriptionInfo;
}): UserProfile {
  return {
    id: apiProfile.id,
    email: apiProfile.email,
    firstName: apiProfile.first_name,
    lastName: apiProfile.last_name,
    dateOfBirth: apiProfile.date_of_birth,
    avatarUrl: apiProfile.avatar_url,
    createdAt: apiProfile.created_at,
    updatedAt: apiProfile.updated_at,
    subscription: apiProfile.subscription,
  };
}

/**
 * Convert camelCase frontend format to snake_case for API.
 */
export function mapProfileUpdateToApi(data: ProfileUpdateData): Record<string, unknown> {
  const apiData: Record<string, unknown> = {};
  
  if (data.firstName !== undefined) apiData.first_name = data.firstName;
  if (data.lastName !== undefined) apiData.last_name = data.lastName;
  if (data.dateOfBirth !== undefined) apiData.date_of_birth = data.dateOfBirth;
  if (data.avatarUrl !== undefined) apiData.avatar_url = data.avatarUrl;
  
  return apiData;
}
