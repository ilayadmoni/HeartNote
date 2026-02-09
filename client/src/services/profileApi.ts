/**
 * Profile API Service
 * 
 * Handles all profile-related API calls to the FastAPI backend.
 * Uses the centralized fetchClient for all requests.
 */

import { api, fetchClient, type ApiResponse, type ApiError } from "@/lib/fetchClient";

// =============================================================================
// Types
// =============================================================================

export interface SubscriptionInfo {
  plan: "free" | "pro" | "premium";
  is_active: boolean;
  expires_at: string | null;
}

export interface ProfileData {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  date_of_birth: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
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
export type { ApiError };

// =============================================================================
// Profile API Functions
// =============================================================================

/**
 * Fetch the current user's profile from the backend.
 */
export async function getProfile(): Promise<ProfileData> {
  const { data, error } = await api.get<ProfileData>("/profile/me");
  
  if (error) {
    throw error;
  }
  
  if (!data) {
    throw { message: "No profile data returned", status: 500 };
  }
  
  return data;
}

/**
 * Update the current user's profile.
 */
export async function updateProfile(updateData: ProfileUpdateData): Promise<ProfileData> {
  const { data, error } = await api.put<ProfileData>("/profile/me", updateData);
  
  if (error) {
    throw error;
  }
  
  if (!data) {
    throw { message: "No profile data returned", status: 500 };
  }
  
  return data;
}

/**
 * Delete the current user's account.
 */
export async function deleteAccount(): Promise<void> {
  const { error } = await api.delete<void>("/profile/me");
  
  if (error) {
    throw error;
  }
}

/**
 * Get available avatar options (Netflix-style).
 * This endpoint doesn't require authentication.
 */
export async function getAvatarOptions(): Promise<string[]> {
  const { data, error } = await fetchClient<AvatarOptions>("/profile/avatars", {
    skipAuth: true,
  });
  
  if (error) {
    console.warn("[getAvatarOptions] Failed to fetch avatars:", error);
    return [];
  }
  
  return data?.avatars || [];
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Format subscription plan name in Hebrew.
 */
export function formatPlanName(plan: string): string {
  const plans: Record<string, string> = {
    free: "חינמי",
    pro: "פרו",
    premium: "פרימיום",
  };
  return plans[plan] || plan;
}

/**
 * Check if subscription is expiring soon (within 7 days).
 */
export function isExpiringSoon(expiresAt: string | null): boolean {
  if (!expiresAt) return false;
  
  const expiry = new Date(expiresAt);
  const now = new Date();
  const daysUntilExpiry = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  
  return daysUntilExpiry > 0 && daysUntilExpiry <= 7;
}
