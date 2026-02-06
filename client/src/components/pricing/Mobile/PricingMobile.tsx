"use client";

/**
 * PricingMobile Component
 * Mobile layout for pricing page with stacked cards
 */

import { Settings } from "lucide-react";
import { PricingHeader, PricingCard } from "../components";
import { PRICING_PLANS } from "../constants";
import type { PricingProps } from "../types";

export function PricingMobile({ className = "" }: PricingProps) {
  // Order for mobile: Featured first (manager), then starter, then owner
  const orderedPlans = [PRICING_PLANS[1], PRICING_PLANS[0], PRICING_PLANS[2]];

  return (
    <section
      className={`relative py-12 px-4 min-h-screen bg-[#faf7f5] dark:bg-gray-900 ${className}`}
    >
      {/* Background Decorative Gear */}
      <div className="absolute top-10 right-0 opacity-10 pointer-events-none">
        <Settings size={120} className="animate-spin-slow text-[#2e3c52]" />
      </div>

      <div className="container mx-auto max-w-md relative z-10">
        <PricingHeader />

        {/* Pricing Cards Stack */}
        <div className="flex flex-col gap-8">
          {orderedPlans.map((plan, index) => (
            <PricingCard key={plan.id} plan={plan} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
