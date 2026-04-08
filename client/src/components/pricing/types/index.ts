/**
 * Pricing Component Types
 */

export interface PricingFeature {
  id: string;
  text: string;
  included: boolean;
}

export interface PricingPlan {
  id: string;
  tierCode?: "lite" | "premium";
  name: string;
  price: number;
  period: string;
  features: PricingFeature[];
  ctaText: string;
  isFeatured?: boolean;
  badge?: string;
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
