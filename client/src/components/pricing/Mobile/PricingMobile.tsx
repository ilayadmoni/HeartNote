"use client";

import { motion } from "framer-motion";
import { PricingHeader } from "../components";
import { MobilePricingCard } from "./components";
import { PRICING_PLANS } from "../constants";
import type { PricingProps } from "../types";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13 } },
};

export function PricingMobile({
  className = "",
  upgradesEnabled = false,
  hasActivePaidSubscription = false,
}: PricingProps) {
  const orderedPlans = [PRICING_PLANS[0], PRICING_PLANS[1], PRICING_PLANS[2]];

  return (
    <section
      className={`relative py-14 px-4 min-h-screen bg-[#faf7f5] dark:bg-[#0f1420] overflow-hidden ${className}`}
    >
      {/* Ambient background glows */}
      <div
        className="absolute top-24 -right-16 w-72 h-72 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(212,130,111,0.13) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-48 -left-20 w-56 h-56 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(212,130,111,0.09) 0%, transparent 70%)",
        }}
      />

      <div className="container mx-auto max-w-md relative z-10">
        <PricingHeader />

        <motion.div
          className="flex flex-col gap-10 mt-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {orderedPlans.map((plan, index) => (
            <MobilePricingCard
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
