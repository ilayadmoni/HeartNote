/**
 * Pricing Component Types
 */

export type PlanId = "free" | "lite" | "premium";

export interface PricingFeatureDef {
  key: string;
  included: boolean;
}

/** Static plan shape — text is resolved from messages via useLocalizedPlans. */
export interface PricingPlanDef {
  id: PlanId;
  tierCode?: "lite" | "premium";
  price: number;
  features: PricingFeatureDef[];
  isFeatured?: boolean;
  isComingSoon?: boolean;
}

/** Plan with every string resolved for the current locale. */
export interface PricingPlan {
  id: PlanId;
  tierCode?: "lite" | "premium";
  name: string;
  price: number;
  period: string;
  features: { id: string; text: string; included: boolean }[];
  ctaText: string;
  isFeatured?: boolean;
  isComingSoon?: boolean;
}

export interface PricingProps {
  className?: string;
  upgradesEnabled?: boolean;
  hasActivePaidSubscription?: boolean;
}

export interface PricingCardProps {
  plan: PricingPlan;
  index: number;
  upgradesEnabled?: boolean;
  hasActivePaidSubscription?: boolean;
}

export interface PricingHeaderProps {
  className?: string;
}
