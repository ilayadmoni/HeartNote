import "server-only";

import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/utils/logger";

interface SubscriptionProfileShape {
  id: string;
  subscription_tier: string | null;
  premium_start?: string | null;
  premium_expiry?: string | null;
  creations_count_pro?: number | null;
}

interface CheckAndDowngradeResult<T extends SubscriptionProfileShape> {
  profile: T;
  wasExpired: boolean;
  wasDowngraded: boolean;
}

function isExpiredPremium(tier: string, premiumExpiry: string | null | undefined): boolean {
  if (tier === "free" || !premiumExpiry) return false;

  const expiryDate = new Date(premiumExpiry);
  if (Number.isNaN(expiryDate.getTime())) return false;

  return expiryDate < new Date();
}

export async function checkAndDowngradeSubscription<T extends SubscriptionProfileShape>(
  profile: T,
): Promise<CheckAndDowngradeResult<T>> {
  const currentTier = profile.subscription_tier ?? "free";
  const expired = isExpiredPremium(currentTier, profile.premium_expiry ?? null);

  if (!expired) {
    return {
      profile,
      wasExpired: false,
      wasDowngraded: false,
    };
  }

  const downgradedProfile = {
    ...profile,
    subscription_tier: "free",
    premium_start: null,
    premium_expiry: null,
    creations_count_pro: 0,
  } as T;

  try {
    await prisma.profile.update({
      where: { id: profile.id },
      data: {
        subscriptionTier: "free",
        premiumStart: null,
        premiumExpiry: null,
        creationsCountPro: 0,
      },
    });
  } catch (error) {
    logger.error("[checkAndDowngradeSubscription] Unexpected downgrade failure", {
      userId: profile.id,
      error,
    });
  }

  return {
    profile: downgradedProfile,
    wasExpired: true,
    wasDowngraded: true,
  };
}
