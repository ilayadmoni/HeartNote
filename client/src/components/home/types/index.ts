/**
 * Home Page Types
 */

export interface HomeProps {
  className?: string;
}

export interface HeroSectionProps {
  className?: string;
}

export interface GalleryTeaserProps {
  className?: string;
}

export interface PricingTeaserProps {
  className?: string;
}

export interface HowItWorksProps {
  className?: string;
}

export type StepIconKey = "click" | "settings" | "send";

export interface StepItem {
  id: 1 | 2 | 3;
  icon: StepIconKey;
}
