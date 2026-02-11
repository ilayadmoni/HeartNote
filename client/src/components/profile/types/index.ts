/**
 * Profile Types
 * TypeScript interfaces for profile data structures.
 * Aligned with new DB schema (profiles table, subscription_tier).
 */

// =============================================================================
// Subscription Types
// =============================================================================

export type SubscriptionTier = "free" | "premium";

export interface SubscriptionInfo {
  tier: SubscriptionTier;
  is_active: boolean;
  creations_count: number;
  creations_left_free: number;
  creations_left_pro: number | null;
  premium_start: string | null;
  premium_expiry: string | null;
}

export interface TierConfig {
  name: string;
  nameHe: string;
  color: string;
  features: string[];
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

// =============================================================================
// Avatar Options (Netflix-style)
// =============================================================================

export interface AvatarOption {
  id: string;
  url: string;
  label: string;
}

// Default avatar options (fetched from API in real usage)
export const DEFAULT_AVATAR_OPTIONS: AvatarOption[] = [
  { id: "1", url: "https://api.dicebear.com/7.x/personas/svg?seed=felix&backgroundColor=b6e3f4", label: "פליקס" },
  { id: "2", url: "https://api.dicebear.com/7.x/personas/svg?seed=aneka&backgroundColor=c0aede", label: "אנקה" },
  { id: "3", url: "https://api.dicebear.com/7.x/personas/svg?seed=jade&backgroundColor=d1d4f9", label: "ג׳ייד" },
  { id: "4", url: "https://api.dicebear.com/7.x/personas/svg?seed=chase&backgroundColor=ffd5dc", label: "צ׳ייס" },
  { id: "5", url: "https://api.dicebear.com/7.x/personas/svg?seed=bella&backgroundColor=ffdfbf", label: "בלה" },
  { id: "6", url: "https://api.dicebear.com/7.x/personas/svg?seed=oliver&backgroundColor=c1f0c1", label: "אוליבר" },
  { id: "7", url: "https://api.dicebear.com/7.x/personas/svg?seed=luna&backgroundColor=f9d1f9", label: "לונה" },
  { id: "8", url: "https://api.dicebear.com/7.x/personas/svg?seed=max&backgroundColor=b8e0f7", label: "מקס" },
];

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
