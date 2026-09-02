"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Crown, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export interface TierCardProps {
  tier: "free" | "pro";
  /** Creations already used this period */
  used: number;
  /** Max allowed (null = unlimited) */
  totalAllowed: number | null;
  isSelected: boolean;
  /** Card is disabled because quota is exhausted */
  isDisabled: boolean;
  /** Free user viewing the paid card — show upgrade badge */
  isUpgradeRequired: boolean;
  onSelect: () => void;
}

const TIER_ICON = {
  free: <Sparkles className="h-3.5 w-3.5" />,
  pro: <Crown className="h-3.5 w-3.5" />,
} as const;

export function TierCard({ tier, used, totalAllowed, isSelected, isDisabled, isUpgradeRequired, onSelect }: TierCardProps): JSX.Element {
  const t = useTranslations("editor");
  const isPro = tier === "pro";
  const isClickable = !isDisabled && !isUpgradeRequired;
  const remaining = totalAllowed == null ? null : Math.max(0, totalAllowed - used);
  const benefits = isPro
    ? [t("tier.pro.benefit1"), t("tier.pro.benefit2")]
    : [t("tier.free.benefit1")];

  const borderClass = isSelected
    ? "border-accent bg-accent-soft shadow-card"
    : isDisabled
    ? "border-line bg-surface-sunken opacity-60 cursor-not-allowed"
    : "border-line bg-surface-raised hover:border-accent/50 hover:shadow-soft cursor-pointer";

  return (
    <motion.div
      whileHover={isClickable ? { scale: 1.02 } : {}}
      whileTap={isClickable ? { scale: 0.98 } : {}}
      onClick={isClickable ? onSelect : undefined}
      className={`relative overflow-hidden rounded-card border-2 p-2 transition-colors select-none ${borderClass}`}
      aria-pressed={isSelected}
    >
      {/* Selected checkmark */}
      {isSelected && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2 end-2">
          <CheckCircle2 className="h-4 w-4 text-accent" />
        </motion.div>
      )}

      {/* Disabled dim overlay + corner-to-corner upgrade ribbon */}
      {isUpgradeRequired && (
        <>
          <div className="pointer-events-none absolute inset-0 bg-black/30 dark:bg-black/50 z-[5]" aria-hidden />
          <Link
            href="/pricing"
            onClick={(e) => e.stopPropagation()}
            aria-label={t("tier.upgradeCta")}
            className="absolute top-1/2 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 -translate-y-1/2 w-[160%] rotate-[-45deg] rtl:rotate-[45deg] bg-amber-400/70 hover:bg-amber-400/90 text-white text-[11px] font-bold text-center py-1 shadow-soft transition-colors z-10"
          >
            {t("tier.upgradeCta")}
          </Link>
        </>
      )}

      {/* Header */}
      <div className="flex items-center justify-end gap-1 mb-1.5">
        <span className={`text-caption font-bold ${isPro ? "text-accent" : "text-ink"}`}>
          {isPro ? t("tier.pro.name") : t("tier.free.name")}
        </span>
        <span className={isPro ? "text-accent" : "text-ink-muted"}>{TIER_ICON[tier]}</span>
      </div>

      {/* Benefit tags */}
      <div className="flex flex-wrap justify-center gap-1 mb-1.5">
        {benefits.map((b) => (
          <span key={b} className="text-[10px] px-1.5 py-0.5 rounded-pill bg-surface-sunken text-ink-muted">
            {b}
          </span>
        ))}
      </div>

      {/* Remaining / disabled */}
      {isDisabled ? (
        <p className="text-[10px] text-red-500 font-bold text-center mt-0.5">{t("tier.limitReached")}</p>
      ) : (
        <p className="text-[10px] text-ink-muted text-end">
          {t("tier.remainingOf", { remaining: remaining ?? 0, total: totalAllowed ?? 0 })}
        </p>
      )}
    </motion.div>
  );
}
