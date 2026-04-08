/**
 * Profile Constants
 * Tier configurations for profile page.
 * Aligned with new DB schema (subscription_tier: free | premium).
 */

import type { TierConfig, SubscriptionTier } from "../types";

/** Tier configurations */
export const TIER_CONFIGS: Record<SubscriptionTier, TierConfig> = {
  free: {
    name: "Free",
    nameHe: "חינמי",
    color: "#6b7280", // gray
    features: ["3 יצירות חינם"],
  },
  lite: {
    name: "Lite",
    nameHe: "לייט",
    color: "#d4826f",
    features: ["מסלול לייט"],
  },
  premium: {
    name: "Premium",
    nameHe: "פרימיום",
    color: "#8b5cf6", // purple
    features: ["ללא הגבלה - הכל כלול"],
  },
};
