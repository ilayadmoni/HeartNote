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

/**
 * Static avatar options – Netflix-style selection grid.
 * Uses DiceBear Avataaars v9 (free, no API key required, deterministic SVGs).
 * 12 diverse characters with varied hair, accessories, skin tones.
 */
export const DEFAULT_AVATAR_OPTIONS: AvatarOption[] = [
  { id: "1",  url: "https://api.dicebear.com/9.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4",   label: "פליקס" },
  { id: "2",  url: "https://api.dicebear.com/9.x/avataaars/svg?seed=Aneka&backgroundColor=c0aede",   label: "אנקה" },
  { id: "3",  url: "https://api.dicebear.com/9.x/avataaars/svg?seed=Zoe&backgroundColor=d1d4f9",     label: "זואי" },
  { id: "4",  url: "https://api.dicebear.com/9.x/avataaars/svg?seed=Chase&backgroundColor=ffd5dc",   label: "צ׳ייס" },
  { id: "5",  url: "https://api.dicebear.com/9.x/avataaars/svg?seed=Bella&backgroundColor=ffdfbf",   label: "בלה" },
  { id: "6",  url: "https://api.dicebear.com/9.x/avataaars/svg?seed=Oliver&backgroundColor=c1f0c1",  label: "אוליבר" },
  { id: "7",  url: "https://api.dicebear.com/9.x/avataaars/svg?seed=Luna&backgroundColor=f9d1f9",    label: "לונה" },
  { id: "8",  url: "https://api.dicebear.com/9.x/avataaars/svg?seed=Max&backgroundColor=b8e0f7",     label: "מקס" },
  { id: "9",  url: "https://api.dicebear.com/9.x/avataaars/svg?seed=Riley&backgroundColor=ffc3a0",   label: "ריילי" },
  { id: "10", url: "https://api.dicebear.com/9.x/avataaars/svg?seed=Noa&backgroundColor=c4f1be",     label: "נועה" },
  { id: "11", url: "https://api.dicebear.com/9.x/avataaars/svg?seed=Sasha&backgroundColor=e8d5b7",   label: "סאשה" },
  { id: "12", url: "https://api.dicebear.com/9.x/avataaars/svg?seed=Jade&backgroundColor=b5d8eb",    label: "ג׳ייד" },
];

/** Flat URL list for components that only need strings (e.g. AvatarSelector). */
export const AVATAR_URLS: string[] = DEFAULT_AVATAR_OPTIONS.map((a) => a.url);

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
