"use client";

/**
 * PricingCard Component
 * Free is the calm baseline; Lite and Premium read as the upgrade
 * (accent-outlined / accent-filled with a badge).
 */

import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { useFormatter, useTranslations } from "next-intl";
import { Check, Lock, Sparkles, Crown } from "lucide-react";
import { usePricingUpgrade } from "@/hooks/usePricingUpgrade";
import { ActiveSubscriptionWarningModal } from "./ActiveSubscriptionWarningModal";
import { transitions } from "@/lib/motion";
import type { PricingCardProps } from "../types";

export function PricingCard({
  plan,
  index,
  upgradesEnabled = false,
  hasActivePaidSubscription = false,
}: PricingCardProps): JSX.Element {
  const t = useTranslations("pricing");
  const format = useFormatter();
  const {
    isPending,
    canUpgrade,
    isFree,
    isWarningOpen,
    handleUpgradeClick,
    handleWarningConfirm,
    closeWarning,
  } = usePricingUpgrade({ plan, hasActivePaidSubscription, upgradesEnabled });

  const isComingSoon = !upgradesEnabled && !!plan.isComingSoon;
  const isAccentCard = plan.isFeatured;

  const priceText = format.number(plan.price, {
    style: "currency",
    currency: "ILS",
    maximumFractionDigits: 0,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...transitions.enter, delay: index * 0.1 }}
      className={`relative rounded-card p-8 transition-shadow duration-base ease-out-quint ${
        isAccentCard
          ? "bg-accent text-accent-ink shadow-glow"
          : plan.tierCode
            ? "bg-surface-raised border-2 border-accent text-ink shadow-card"
            : "bg-surface-raised border border-line text-ink shadow-card"
      } ${isComingSoon ? "opacity-70" : ""}`}
    >
      {(isComingSoon || (isAccentCard && !isComingSoon)) && (
        <div
          className={`absolute -top-4 start-1/2 ltr:-translate-x-1/2 rtl:translate-x-1/2 rtl:translate-x-1/2 flex items-center gap-1.5 px-4 py-1.5 rounded-pill text-body-sm font-bold shadow-soft z-10 ${
            isComingSoon ? "bg-ink text-surface" : "bg-surface text-accent"
          }`}
        >
          {isComingSoon ? <Crown size={14} /> : <Sparkles size={14} />}
          <span>{isComingSoon ? t("badge.comingSoon") : t("badge.bestValue")}</span>
        </div>
      )}

      <h3 className="text-title-md font-bold text-center mb-4">{plan.name}</h3>

      <div className="text-center mb-6">
        <span className="text-display-md font-black">{priceText}</span>
        {plan.period && (
          <p className={`text-body-sm mt-1 ${isAccentCard ? "text-accent-ink/80" : "text-ink-muted"}`}>
            {plan.period}
          </p>
        )}
      </div>

      <ul className="space-y-3 mb-8">
        {plan.features.map((feature) => (
          <li key={feature.id} className="flex items-center gap-3">
            {feature.included ? (
              <Check size={18} className={isAccentCard ? "text-accent-ink" : "text-accent"} />
            ) : (
              <Lock size={16} className={isAccentCard ? "text-accent-ink/50" : "text-ink-subtle"} />
            )}
            <span className="text-body-sm">{feature.text}</span>
          </li>
        ))}
      </ul>

      {isFree ? (
        <Link href="/gallery" className="block w-full">
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            transition={transitions.spring}
            className="w-full py-3 px-6 rounded-pill font-bold bg-ink text-surface hover:bg-ink/90"
          >
            {plan.ctaText}
          </motion.button>
        </Link>
      ) : (
        <button
          type="button"
          onClick={canUpgrade ? handleUpgradeClick : undefined}
          disabled={!canUpgrade || isPending}
          className={
            canUpgrade
              ? `w-full py-3 px-6 rounded-pill font-bold transition-colors duration-base ${
                  isAccentCard
                    ? "bg-surface text-accent hover:bg-surface/90"
                    : "bg-accent text-accent-ink hover:bg-accent-hover"
                }`
              : `w-full py-3 px-6 rounded-pill font-bold cursor-not-allowed ${
                  isAccentCard ? "bg-accent-ink/15 text-accent-ink/60" : "bg-surface-sunken text-ink-subtle"
                }`
          }
        >
          {isPending ? t("cta.upgrading") : canUpgrade ? t("cta.upgradeNow") : plan.ctaText}
        </button>
      )}

      <ActiveSubscriptionWarningModal
        isOpen={isWarningOpen}
        onCancel={closeWarning}
        onConfirm={handleWarningConfirm}
        isSubmitting={isPending}
      />
    </motion.div>
  );
}
