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

export interface StepItem {
  id: number;
  icon: string;
  title: string;
  description: string;
}
