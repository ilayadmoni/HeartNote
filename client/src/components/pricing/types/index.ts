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
}

export interface PricingCardProps {
  plan: PricingPlan;
  index: number;
}

export interface PricingHeaderProps {
  className?: string;
}
