"use client";

/**
 * Pricing Component
 * Main responsive wrapper that switches between Desktop and Mobile layouts
 */

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { PricingDesktop } from "./Desktop/PricingDesktop";
import { PricingMobile } from "./Mobile/PricingMobile";
import type { PricingProps } from "./types";

export function Pricing(props: PricingProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return isMobile ? (
    <PricingMobile {...props} />
  ) : (
    <PricingDesktop {...props} />
  );
}
