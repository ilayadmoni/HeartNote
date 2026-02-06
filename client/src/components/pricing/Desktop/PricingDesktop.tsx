"use client";

/**
 * PricingDesktop Component
 * Desktop layout for pricing page with 3-column grid
 */

import { Settings } from "lucide-react";
import { PricingHeader, PricingCard } from "../components";
import { PRICING_PLANS } from "../constants";
import type { PricingProps } from "../types";

export function PricingDesktop({ className = "" }: PricingProps) {
  // Reorder plans for desktop: starter (right), manager (center), owner (left)
  const orderedPlans = [PRICING_PLANS[2], PRICING_PLANS[1], PRICING_PLANS[0]];

  return (
    <section
      className={`relative py-16 lg:py-24 px-4 min-h-screen bg-[#faf7f5] dark:bg-gray-900 ${className}`}
    >
      {/* Background Decorative Gears */}
      <div className="absolute top-20 left-10 opacity-15 pointer-events-none">
        <Settings size={200} className="animate-spin-slow text-[#2e3c52]" />
      </div>
      <div className="absolute bottom-20 right-10 opacity-15 pointer-events-none">
        <Settings
          size={180}
          className="animate-spin-slow-reverse text-[#2e3c52]"
        />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <PricingHeader />

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-3 gap-8 items-center max-w-5xl mx-auto">
          {orderedPlans.map((plan, index) => (
            <PricingCard key={plan.id} plan={plan} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
