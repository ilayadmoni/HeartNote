"use client";

import { motion } from "framer-motion";
import { PricingHeader, PricingCard } from "../components";
import { useLocalizedPlans } from "../hooks/useLocalizedPlans";
import { stagger } from "@/lib/motion";
import type { PricingProps } from "../types";

export function PricingMobile({
  className = "",
  upgradesEnabled = false,
  hasActivePaidSubscription = false,
}: PricingProps): JSX.Element {
  const plans = useLocalizedPlans();

  return (
    <section className={`relative py-section-sm px-gutter min-h-[100dvh] bg-surface ${className}`}>
      <div className="max-w-md mx-auto relative z-10">
        <PricingHeader />

        <motion.div
          className="flex flex-col gap-8 mt-2"
          variants={stagger(0.1)}
          initial="hidden"
          animate="visible"
        >
          {plans.map((plan, index) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              index={index}
              upgradesEnabled={upgradesEnabled}
              hasActivePaidSubscription={hasActivePaidSubscription}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
