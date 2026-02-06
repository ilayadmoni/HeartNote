"use client";

/**
 * HomeMobile Component
 * Mobile view for home page
 */

import {
  HeroSection,
  GalleryTeaser,
  PricingTeaser,
  HowItWorks,
} from "../components";
import type { HomeProps } from "../types";

export function HomeMobile({ className = "" }: HomeProps) {
  return (
    <div className={className}>
      <HeroSection />
      <GalleryTeaser />
      <PricingTeaser />
      <HowItWorks />
    </div>
  );
}
