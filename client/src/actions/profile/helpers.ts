/**
 * Profile Helpers
 *
 * Shared helper functions for profile server actions.
 * Ported from ProfileService._is_subscription_active / _parse_*
 */

import type { Profile } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { ProfileResponse, SubscriptionTier } from "@/lib/validations";

export function isSubscriptionActive(profile: Pick<Profile, "subscriptionTier" | "premiumExpiry">): boolean {
  if (profile.subscriptionTier === "free") return true;
  if (!profile.premiumExpiry) return true;
  return profile.premiumExpiry > new Date();
}

export async function buildProfileResponse(profile: Profile): Promise<ProfileResponse> {
  const tier = profile.subscriptionTier;

  const policy = await prisma.subscriptionPolicy.findUnique({ where: { tierCode: tier } });
  const creationLimit = policy?.creationLimit ?? (tier === "free" ? 3 : null);

  return {
    id: profile.id,
    email: profile.email,
    first_name: profile.firstName,
    last_name: profile.lastName,
    date_of_birth: profile.dateOfBirth ? profile.dateOfBirth.toISOString().slice(0, 10) : null,
    avatar_url: profile.avatarUrl,
    created_at: profile.createdAt.toISOString(),
    updated_at: profile.updatedAt ? profile.updatedAt.toISOString() : null,
    subscription: {
      tier: tier as SubscriptionTier,
      creations_count_free: profile.creationsCountFree,
      creations_count_pro: profile.creationsCountPro,
      additional_creation_free: profile.additionalCreationFree,
      additional_creation_pro: profile.additionalCreationPro,
      premium_start: profile.premiumStart ? profile.premiumStart.toISOString() : null,
      premium_expiry: profile.premiumExpiry ? profile.premiumExpiry.toISOString() : null,
      is_active: isSubscriptionActive(profile),
      creation_limit: creationLimit,
    },
  };
}
