"use client";

import { useTranslations } from "next-intl";
import type { UserProfile } from "../types";
import type { SubscriptionUsage } from "../ProfileClient";

/** Derived, locale-aware view model shared by the Desktop and Mobile layouts. */
export function useProfileViewModel(profile: UserProfile, subscriptionUsage: SubscriptionUsage) {
  const t = useTranslations("profile");

  const premiumExpiryRaw = profile.subscription.premium_expiry;
  const premiumExpiryDate = premiumExpiryRaw ? new Date(premiumExpiryRaw) : null;
  const isPaidSubscriptionActive = Boolean(
    premiumExpiryDate && !Number.isNaN(premiumExpiryDate.getTime()) && premiumExpiryDate > new Date(),
  );

  const isPaidQuotaFull = Boolean(
    subscriptionUsage.paid?.isActive &&
      subscriptionUsage.paid.limit !== null &&
      subscriptionUsage.paid.used >= subscriptionUsage.paid.limit,
  );

  const formatExpiryDays = (days: number | null | undefined): string =>
    t("subscription.expiryDays", { days: days ?? 0 });

  const freeSubscriptionData = {
    tier: "free" as const,
    startDate: profile.createdAt?.split("T")[0],
    expiryDate: formatExpiryDays(subscriptionUsage.free.expiryDays),
    isActive: true,
  };

  const paidSubscriptionData = subscriptionUsage.paid
    ? {
        tier: subscriptionUsage.paid.tier,
        startDate: subscriptionUsage.paid.startDate ?? undefined,
        expiryDate: formatExpiryDays(subscriptionUsage.paid.expiryDays),
        isActive: isPaidSubscriptionActive,
      }
    : undefined;

  return {
    isPaidSubscriptionActive,
    isPaidQuotaFull,
    freeSubscriptionData,
    paidSubscriptionData,
  };
}
