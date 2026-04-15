"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Crown, Sparkles } from "lucide-react";
import Link from "next/link";

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

const TIER_CONFIG = {
  free: {
    name: "חינם",
    icon: <Sparkles className="h-4 w-4" />,
    description: "שימוש ביתרה חינמית",
    benefits: ["כולל סימן מים", "ללא תוקף"],
    iconColor: "text-navy-500 dark:text-gray-300",
    nameColor: "text-navy-700 dark:text-white",
  },
  pro: {
    name: "פרימיום",
    icon: <Crown className="h-4 w-4" />,
    description: "שימוש ביתרת פרימיום",
    benefits: ["ללא סימן מים", "תוקף מורחב"],
    iconColor: "text-coral-500",
    nameColor: "text-coral-600 dark:text-coral-300",
  },
} as const;

export function TierCard({ tier, used, totalAllowed, isSelected, isDisabled, isUpgradeRequired, onSelect }: TierCardProps) {
  const cfg = TIER_CONFIG[tier];
  const isClickable = !isDisabled && !isUpgradeRequired;
  const remaining = totalAllowed == null ? null : Math.max(0, totalAllowed - used);

  const borderClass = isSelected
    ? "border-coral-500 bg-coral-50 dark:bg-coral-900/20 shadow-md"
    : isDisabled
    ? "border-gray-200 dark:border-navy-600 bg-gray-50 dark:bg-navy-800 opacity-60 cursor-not-allowed"
    : "border-gray-200 dark:border-navy-600 bg-white dark:bg-navy-700 hover:border-coral-300 hover:shadow-sm cursor-pointer";

  return (
    <motion.div
      whileHover={isClickable ? { scale: 1.02 } : {}}
      whileTap={isClickable ? { scale: 0.98 } : {}}
      onClick={isClickable ? onSelect : undefined}
      className={`relative rounded-2xl border-2 p-3 transition-all select-none ${borderClass}`}
      aria-pressed={isSelected}
    >
      {/* Selected checkmark */}
      {isSelected && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2 left-2">
          <CheckCircle2 className="h-4 w-4 text-coral-500" />
        </motion.div>
      )}

      {/* Upgrade badge */}
      {isUpgradeRequired && (
        <Link href="/pricing" onClick={(e) => e.stopPropagation()}
          className="absolute top-2 left-2 bg-amber-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full hover:bg-amber-500 transition-colors">
          שדרג
        </Link>
      )}

      {/* Header */}
      <div className="flex items-center justify-end gap-1.5 mb-2">
        <span className={`text-sm font-bold text-hebrew-heading ${cfg.nameColor}`}>{cfg.name}</span>
        <span className={cfg.iconColor}>{cfg.icon}</span>
      </div>

      {/* Description */}
      <p className="text-xs text-gray-500 dark:text-gray-400 text-right text-hebrew-body mb-2 leading-relaxed">
        {cfg.description}
      </p>

      {/* Benefit tags */}
      <div className="flex flex-wrap justify-end gap-1 mb-2">
        {cfg.benefits.map((b) => (
          <span key={b} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-navy-600 text-gray-600 dark:text-gray-300 text-hebrew-body">
            {b}
          </span>
        ))}
      </div>

      {/* Remaining / disabled */}
      {isDisabled ? (
        <p className="text-[11px] text-red-500 font-bold text-center mt-1 text-hebrew-body">מגבלה הושגה</p>
      ) : (
        <p className="text-[11px] text-gray-500 dark:text-gray-300 text-right text-hebrew-body">
          נותר {remaining == null ? "∞" : remaining} מתוך {totalAllowed ?? "∞"}
        </p>
      )}
    </motion.div>
  );
}
