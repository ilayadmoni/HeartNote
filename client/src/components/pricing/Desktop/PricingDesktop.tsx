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
  // Reading order ascends free -> lite -> premium in both directions,
  // matching the home teaser, so the upgrade path reads as a climb.
  const order = ["free", "lite", "premium"];
  const orderedPlans = [...plans].sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));

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
