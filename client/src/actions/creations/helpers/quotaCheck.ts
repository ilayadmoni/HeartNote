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

import { prisma } from "@/lib/prisma";
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

// ── Fetch Profile ────────────────────────────────────────────────────────

/**
 * Fetches the user's profile quota fields.
 * Throws ActionError(404) if the profile is missing.
 */
export async function fetchProfileForQuota(userId: string): Promise<ProfileQuotaData> {
  const profile = await prisma.profile.findUnique({ where: { id: userId } });

  if (!profile) {
    throw new ActionError("Profile not found. Please complete registration.", 404);
  }

  const { profile: normalizedProfile, wasExpired } = await checkAndDowngradeSubscription({
    id: profile.id,
    subscription_tier: profile.subscriptionTier,
    premium_start: profile.premiumStart?.toISOString() ?? null,
    premium_expiry: profile.premiumExpiry?.toISOString() ?? null,
    creations_count_pro: profile.creationsCountPro,
  });

  return {
    id: normalizedProfile.id,
    subscription_tier: normalizedProfile.subscription_tier,
    premium_expiry: normalizedProfile.premium_expiry ?? null,
    creations_count_free: profile.creationsCountFree,
    creations_count_pro: normalizedProfile.creations_count_pro ?? 0,
    additional_creation_free: profile.additionalCreationFree,
    additional_creation_pro: profile.additionalCreationPro,
    subscription_expired: wasExpired,
  };
}

// ── Fetch Policy Limit ───────────────────────────────────────────────────

/**
 * Fetches the creation_limit from subscription_policies for a given tier.
 * Throws ActionError(500) if the policy row is missing — this is a DB misconfiguration.
 */
export async function fetchPolicyLimit(tierCode: string): Promise<number | null> {
  const policy = await prisma.subscriptionPolicy.findUnique({ where: { tierCode } });

  if (!policy) {
    throw new ActionError(
      `Subscription policy for tier "${tierCode}" is not configured. Please contact support.`,
      500,
    );
  }

  return policy.creationLimit;
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
// Quota decrement is no longer a DB trigger (Supabase's trg_handle_new_
// creation_quota) — it's an atomic guarded increment inside the same
// transaction as the creation insert. See actions/creations/create.ts and
// actions/creations/helpers/persistCreation.ts.
