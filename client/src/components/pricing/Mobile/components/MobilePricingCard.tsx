"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ActiveSubscriptionWarningModal } from "../../components/ActiveSubscriptionWarningModal";
import { FeatureList } from "./FeatureList";
import { PlanBadge } from "./PlanBadge";
import { usePricingUpgrade } from "@/hooks/usePricingUpgrade";
import type { PricingCardProps } from "../../types";

const cardVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.96 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.13, duration: 0.48, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function MobilePricingCard({
  plan,
  index,
  upgradesEnabled = false,
  hasActivePaidSubscription = false,
}: PricingCardProps) {
  const {
    isPending,
    canUpgrade,
    isFree,
    isWarningOpen,
    handleUpgradeClick,
    handleWarningConfirm,
    closeWarning,
  } = usePricingUpgrade({ plan, hasActivePaidSubscription, upgradesEnabled });

  const isComingSoon = !upgradesEnabled && !!plan.badge;
  const isRecommended = plan.id === "owner" && !isComingSoon;

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={!isComingSoon ? { y: -5 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className="relative"
    >
      {isComingSoon && <PlanBadge type="coming-soon" label={plan.badge!} />}
      {!isComingSoon && plan.isFeatured && <PlanBadge type="popular" label="הכי פופולרי" />}
      {isRecommended && <PlanBadge type="recommended" label="מומלץ" />}

      <div
        className={`relative rounded-3xl p-7 overflow-hidden transition-shadow duration-300 ${
          isComingSoon ? "opacity-60" : ""
        } ${
          plan.isFeatured
            ? "bg-gradient-to-br from-[#d4826f] via-[#c87565] to-[#b86a57] border border-white/15"
            : "bg-white/95 dark:bg-[#1a1f2e]/90 backdrop-blur-xl border border-[#d4826f]/10 dark:border-white/8"
        }`}
        style={{
          boxShadow: plan.isFeatured
            ? "0 24px 48px -12px rgba(212,130,111,0.52), 0 4px 10px rgba(184,106,87,0.22)"
            : "0 8px 32px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        {plan.isFeatured && (
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/8 to-white/0 pointer-events-none" />
        )}

        <h3
          className={`text-lg font-black text-center mb-4 text-hebrew-heading tracking-tight ${
            plan.isFeatured ? "text-white" : "text-[#2e3c52] dark:text-white"
          }`}
        >
          {plan.name}
        </h3>

        <div className="text-center mb-6">
          <div className="flex items-end justify-center gap-1 leading-none">
            <span
              className={`text-6xl font-black text-hebrew-heading leading-none ${
                plan.isFeatured ? "text-white" : "text-[#2e3c52] dark:text-white"
              }`}
            >
              {plan.price}
            </span>
            <span
              className={`text-2xl font-bold pb-1 text-hebrew-heading ${
                plan.isFeatured ? "text-white/75" : "text-[#d4826f]"
              }`}
            >
              ₪
            </span>
          </div>
          {plan.period && (
            <p
              className={`text-sm mt-2 font-medium text-hebrew-body ${
                plan.isFeatured ? "text-white/72" : "text-[#4a5a72] dark:text-gray-400"
              }`}
            >
              {plan.period}
            </p>
          )}
        </div>

        <FeatureList features={plan.features} isFeatured={!!plan.isFeatured} />

        {isFree ? (
          <Link href="/gallery" className="block w-full">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3.5 px-6 rounded-2xl font-black text-sm cursor-pointer text-hebrew-heading bg-white text-[#d4826f] shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              {plan.ctaText}
            </motion.button>
          </Link>
        ) : (
          <motion.button
            type="button"
            whileTap={canUpgrade ? { scale: 0.97 } : undefined}
            onClick={handleUpgradeClick}
            disabled={!canUpgrade || isPending}
            className={`w-full py-3.5 px-6 rounded-2xl font-black text-sm text-hebrew-heading transition-all duration-200 ${
              canUpgrade
                ? "bg-gradient-to-r from-[#d4826f] to-[#b86a57] text-white shadow-md hover:shadow-lg cursor-pointer"
                : "bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-500 cursor-not-allowed"
            }`}
          >
            {isPending ? "משדרגים..." : canUpgrade ? "שדרגו עכשיו" : plan.ctaText}
          </motion.button>
        )}
      </div>

      <ActiveSubscriptionWarningModal
        isOpen={isWarningOpen}
        onCancel={closeWarning}
        onConfirm={handleWarningConfirm}
        isSubmitting={isPending}
      />
    </motion.div>
  );
}
