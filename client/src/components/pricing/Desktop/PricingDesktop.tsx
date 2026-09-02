"use client";

/**
 * PricingDesktop Component
 * Desktop layout for pricing page with 3-column grid
 */

import { PricingHeader, PricingCard } from "../components";
import { useLocalizedPlans } from "../hooks/useLocalizedPlans";
import type { PricingProps } from "../types";

export function PricingDesktop({
  className = "",
  upgradesEnabled = false,
  hasActivePaidSubscription = false,
}: PricingProps): JSX.Element {
  const plans = useLocalizedPlans();
  // Reorder for desktop: premium (start), lite (center), free (end).
  const orderedPlans = [
    plans.find((p) => p.id === "premium")!,
    plans.find((p) => p.id === "lite")!,
    plans.find((p) => p.id === "free")!,
  ];

  return (
    <section className={`relative py-section-sm px-gutter min-h-[100dvh] bg-surface ${className}`}>
      <div className="section-shell relative z-10">
        <PricingHeader />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-5xl mx-auto">
          {orderedPlans.map((plan, index) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              index={index}
              upgradesEnabled={upgradesEnabled}
              hasActivePaidSubscription={hasActivePaidSubscription}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
