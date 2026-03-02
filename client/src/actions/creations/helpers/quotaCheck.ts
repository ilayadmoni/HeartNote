/**
 * Quota Check & Premium Guard Helpers
 *
 * Shared logic for verifying user subscription tier,
 * premium template access, and creation quota limits.
 *
 * Quota model (since migration 018):
 *   free  → TotalAllowed = subscription_policies.creation_limit + profiles.additional_creation_free
 *            blocked when creations_count_free >= TotalAllowed
 *   premium → unlimited (creations_count_pro tracked for analytics only)
 */

import { SupabaseClient } from "@supabase/supabase-js";

// ── Types ────────────────────────────────────────────────────────────────

export interface ProfileQuotaData {
  subscription_tier: string | null;
  creations_count_free: number;
  creations_count_pro: number;
  additional_creation_free: number;
  additional_creation_pro: number;
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
      "subscription_tier, creations_count_free, creations_count_pro, additional_creation_free, additional_creation_pro",
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

// ── Fetch Policy Limit ───────────────────────────────────────────────────

/**
 * Fetches the creation_limit from subscription_policies for a given tier.
 * Returns a fallback of 3 for free tier if the row is missing.
 */
export async function fetchPolicyLimit(
  supabase: SupabaseClient,
  tierCode: string,
): Promise<number | null> {
  const { data } = await supabase
    .from("subscription_policies")
    .select("creation_limit")
    .eq("tier_code", tierCode)
    .single();

  return (data?.creation_limit as number) ?? (tierCode === "free" ? 3 : null);
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
 *
 * For free tier: compares creations_count_free against totalAllowed
 *   (policy creation_limit + additional_creation_free).
 * For premium: unlimited — always passes.
 */
export function checkQuotaLimit(
  profile: ProfileQuotaData,
  userTier: string,
  policyLimit: number | null,
): { error: string; status: number } | null {
  if (userTier === "free") {
    const limit = policyLimit ?? 3;
    const totalAllowed = limit + (profile.additional_creation_free ?? 0);

    if (profile.creations_count_free >= totalAllowed) {
      return { error: "QUOTA_EXCEEDED", status: 403 };
    }
  }
  // Premium tier is unlimited — no check needed
  return null;
}

// ── Note ─────────────────────────────────────────────────────────────────
// Quota decrement is handled exclusively by the database trigger
// `trg_handle_new_creation_quota` (see 018_update_profiles_creation_counters.sql).
// No application-level decrement logic should exist here.

