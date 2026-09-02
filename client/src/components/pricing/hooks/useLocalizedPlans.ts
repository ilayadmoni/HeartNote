"use client";

import { useTranslations } from "next-intl";
import { PRICING_PLANS } from "../constants";
import type { PricingPlan } from "../types";

/** Resolves the static plan defs against the `pricing` message namespace. */
export function useLocalizedPlans(): PricingPlan[] {
  const t = useTranslations("pricing");

  return PRICING_PLANS.map((plan) => ({
    id: plan.id,
    tierCode: plan.tierCode,
    price: plan.price,
    isFeatured: plan.isFeatured,
    isComingSoon: plan.isComingSoon,
    name: t(`plans.${plan.id}.name`),
    period: t(`plans.${plan.id}.period`),
    ctaText: t(`plans.${plan.id}.cta`),
    features: plan.features.map((feature) => ({
      id: feature.key,
      included: feature.included,
      text: t(`plans.${plan.id}.features.${feature.key}`),
    })),
  }));
}
