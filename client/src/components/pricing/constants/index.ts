/**
 * Pricing Constants
 * Plan shape only — every user-facing string lives in messages/*\/pricing.json
 * and is resolved by `useLocalizedPlans()`.
 */

import type { PricingPlanDef } from "../types";

export const PRICING_PLANS: PricingPlanDef[] = [
  {
    id: "free",
    price: 0,
    isFeatured: false,
    features: [
      { key: "1", included: true },
      { key: "2", included: true },
      { key: "3", included: false },
      { key: "4", included: false },
      { key: "5", included: false },
    ],
  },
  {
    id: "lite",
    tierCode: "lite",
    price: 12,
    isComingSoon: true,
    features: [
      { key: "1", included: true },
      { key: "2", included: true },
      { key: "3", included: true },
      { key: "4", included: true },
      { key: "5", included: true },
      { key: "6", included: true },
    ],
  },
  {
    id: "premium",
    tierCode: "premium",
    price: 29,
    isFeatured: true,
    isComingSoon: true,
    features: [
      { key: "1", included: true },
      { key: "2", included: true },
      { key: "3", included: true },
      { key: "4", included: true },
      { key: "5", included: true },
      { key: "6", included: true },
    ],
  },
];
