"use client";

/**
 * HomeDesktop Component
 * Desktop view for home page
 */

import {
  HeroSection,
  GalleryTeaser,
  PricingTeaser,
  HowItWorks,
} from "../components";
import type { HomeProps } from "../types";

export function HomeDesktop({ className = "" }: HomeProps) {
  return (
    <div className={className}>
      <HeroSection />
      <GalleryTeaser />
      <PricingTeaser />
      <HowItWorks />
    </div>
  );
}
