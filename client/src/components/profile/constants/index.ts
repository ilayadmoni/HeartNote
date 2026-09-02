/**
 * Profile Constants
 * Token-based tier badge styling. Tier display names/features live in
 * messages/*\/profile.json and are resolved via useTranslations("profile").
 */

import type { TierConfig, SubscriptionTier } from "../types";

export const TIER_CONFIGS: Record<SubscriptionTier, TierConfig> = {
  free: { iconBg: "bg-surface-sunken", iconColor: "text-ink-muted" },
  lite: { iconBg: "bg-accent-soft", iconColor: "text-accent" },
  premium: { iconBg: "bg-accent-soft", iconColor: "text-accent" },
};
