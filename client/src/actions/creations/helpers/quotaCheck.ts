/**
 * Quota Check & Premium Guard Helpers
 *
 * Shared logic for verifying user subscription tier,
 * premium template access, and creation quota limits.
 */

import { SupabaseClient } from "@supabase/supabase-js";

// ── Types ────────────────────────────────────────────────────────────────

export interface ProfileQuotaData {
  subscription_tier: string | null;
  creations_count: number | null;
  creations_left_free: number | null;
  creations_left_pro: number | null;
}

export interface QuotaCheckResult {
  profile: ProfileQuotaData;
  userTier: string;
  isPaid: boolean;
}

// ── Fetch Profile ────────────────────────────────────────────────────────

/**
 * Fetches the user's profile quota fields.
 * Returns `null` with an error payload if the profile is missing.
 */
export async function fetchProfileForQuota(
  supabase: SupabaseClient,
  userId: string,
): Promise<
  { data: ProfileQuotaData } | { error: string; status: number }
> {
  const { data: profile, error: profErr } = await supabase
    .from("profiles")
    .select(
      "subscription_tier, creations_count, creations_left_free, creations_left_pro",
    )
    .eq("id", userId)
    .single();

  if (profErr || !profile) {
    return {
      error: "Profile not found. Please complete registration.",
      status: 404,
    };
  }

  return { data: profile as ProfileQuotaData };
}

// ── Premium Guard ────────────────────────────────────────────────────────

/**
 * Returns an error payload if a free-tier user tries to use a premium template.
 */
export function checkPremiumAccess(
  isPremiumTemplate: boolean,
  userTier: string,
): { error: string; status: number } | null {
  if (isPremiumTemplate && userTier === "free") {
    return { error: "TEMPLATE_NOT_ALLOWED", status: 402 };
  }
  return null;
}

// ── Quota Guard ──────────────────────────────────────────────────────────

/**
 * Returns an error payload if the user has exhausted their creation quota.
 */
export function checkQuotaLimit(
  profile: ProfileQuotaData,
  userTier: string,
): { error: string; status: number } | null {
  if (userTier === "free") {
    const left: number = profile.creations_left_free ?? 0;
    if (left <= 0) {
      return { error: "QUOTA_EXCEEDED", status: 403 };
    }
  } else if (userTier === "premium") {
    const left: number | null = profile.creations_left_pro;
    // NULL means unlimited for premium
    if (left !== null && left <= 0) {
      return { error: "QUOTA_EXCEEDED", status: 403 };
    }
  }
  return null;
}

// ── Note ─────────────────────────────────────────────────────────────────
// Quota decrement is handled exclusively by the database trigger
// `trg_handle_new_creation_quota` (see 012_creation_quota_trigger.sql).
// No application-level decrement logic should exist here.

