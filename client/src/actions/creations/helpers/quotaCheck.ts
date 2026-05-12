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
import { ActionError } from "@/lib/action-response";
import { checkAndDowngradeSubscription } from "@/lib/subscription/checkAndDowngradeSubscription";
import { CREATION_ACTION_ERRORS } from "@/lib/creation-flow/errors";

// ── Types ────────────────────────────────────────────────────────────────

export interface ProfileQuotaData {
  id: string;
  subscription_tier: string | null;
  premium_expiry: string | null;
  creations_count_free: number;
  creations_count_pro: number;
  additional_creation_free: number;
  additional_creation_pro: number;
  subscription_expired: boolean;
}

interface RawProfileQuotaData extends Omit<ProfileQuotaData, "subscription_expired"> {
  premium_start?: string | null;
}

// ── Fetch Profile ────────────────────────────────────────────────────────

/**
 * Fetches the user's profile quota fields.
 * Throws ActionError(404) if the profile is missing.
 */
export async function fetchProfileForQuota(
  supabase: SupabaseClient,
  userId: string,
): Promise<ProfileQuotaData> {
  const { data: profile, error: profErr } = await supabase
    .from("profiles")
    .select(
      "id, subscription_tier, premium_expiry, creations_count_free, creations_count_pro, additional_creation_free, additional_creation_pro, premium_start",
    )
    .eq("id", userId)
    .single();

  if (profErr || !profile) {
    throw new ActionError(
      "Profile not found. Please complete registration.",
      404,
    );
  }

  const rawProfile = profile as RawProfileQuotaData;
  const { profile: normalizedProfile, wasExpired } =
    await checkAndDowngradeSubscription(rawProfile);

  return {
    ...normalizedProfile,
    subscription_expired: wasExpired,
  };
}

// ── Fetch Policy Limit ───────────────────────────────────────────────────

/**
 * Fetches the creation_limit from subscription_policies for a given tier.
 * Throws ActionError(500) if the policy row is missing — this is a DB misconfiguration.
 */
export async function fetchPolicyLimit(
  supabase: SupabaseClient,
  tierCode: string,
): Promise<number | null> {
  const { data, error } = await supabase
    .from("subscription_policies")
    .select("creation_limit")
    .eq("tier_code", tierCode)
    .single();

  if (error || !data) {
    throw new ActionError(
      `Subscription policy for tier "${tierCode}" is not configured. Please contact support.`,
      500,
    );
  }

  return data.creation_limit as number | null;
}

// ── Premium Guard ────────────────────────────────────────────────────────

/**
 * Throws ActionError(402) if a free-tier user tries to use a premium template.
 */
export function checkPremiumAccess(
  isPremiumTemplate: boolean,
  userTier: string,
): void {
  if (isPremiumTemplate && userTier === "free") {
    throw new ActionError(CREATION_ACTION_ERRORS.TEMPLATE_NOT_ALLOWED, 402);
  }
}

// ── Quota Guard ──────────────────────────────────────────────────────────

/**
 * Throws ActionError(403) if the user has exhausted their creation quota.
 *
 * For free tier: compares creations_count_free against totalAllowed
 *   (policy creation_limit + additional_creation_free).
 * For premium: unlimited — always passes.
 */
export function checkQuotaLimit(
  profile: ProfileQuotaData,
  userTier: string,
  policyLimit: number | null,
): void {
  if (userTier === "free") {
    if (policyLimit === null) {
      throw new ActionError(
        "Free tier creation limit is not configured. Please contact support.",
        500,
      );
    }
    const totalAllowed = policyLimit + (profile.additional_creation_free ?? 0);

    if (profile.creations_count_free >= totalAllowed) {
      throw new ActionError(CREATION_ACTION_ERRORS.QUOTA_EXCEEDED, 403);
    }
  }
}

// ── Note ─────────────────────────────────────────────────────────────────
// Quota decrement is handled exclusively by the database trigger
// `trg_handle_new_creation_quota` (see 018_update_profiles_creation_counters.sql).
// No application-level decrement logic should exist here.
