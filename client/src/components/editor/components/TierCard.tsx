"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Crown, Sparkles } from "lucide-react";
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

const TIER_CONFIG = {
  free: {
    name: "חינם",
    icon: <Sparkles className="h-3.5 w-3.5" />,
    description: "שימוש ביתרה חינמית",
    benefits: ["כולל סימן מים"],
    iconColor: "text-navy-500 dark:text-gray-300",
    nameColor: "text-navy-700 dark:text-white",
  },
  pro: {
    name: "פרימיום",
    icon: <Crown className="h-3.5 w-3.5" />,
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
      className={`relative overflow-hidden rounded-xl border-2 p-2 transition-all select-none ${borderClass}`}
      aria-pressed={isSelected}
    >
      {/* Selected checkmark */}
      {isSelected && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2 right-2">
          <CheckCircle2 className="h-4 w-4 text-coral-500" />
        </motion.div>
      )}

      {/* Disabled dim overlay + corner-to-corner upgrade ribbon */}
      {isUpgradeRequired && (
        <>
          <div className="pointer-events-none absolute inset-0 bg-black/30 dark:bg-black/50 z-[5]" aria-hidden />
          <Link
            href="/pricing"
            onClick={(e) => e.stopPropagation()}
            aria-label="שדרג"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] rotate-[-45deg] bg-amber-400/70 hover:bg-amber-400/90 text-white text-[11px] font-bold text-center py-1 shadow-sm transition-colors text-hebrew-heading z-10"
          >
          לחץ לשדרג
          </Link>
        </>
      )}

      {/* Header */}
      <div className="flex items-center justify-end gap-1 mb-1.5">
        <span className={`text-xs font-bold text-hebrew-heading ${cfg.nameColor}`}>{cfg.name}</span>
        <span className={cfg.iconColor}>{cfg.icon}</span>
      </div>



      {/* Benefit tags */}
      <div className="flex flex-wrap justify-center gap-1 mb-1.5">
        {cfg.benefits.map((b) => (
          <span key={b} className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-navy-600 text-gray-600 dark:text-gray-300 text-hebrew-body">
            {b}
          </span>
        ))}
      </div>

      {/* Remaining / disabled */}
      {isDisabled ? (
        <p className="text-[10px] text-red-500 font-bold text-center mt-0.5 text-hebrew-body">מגבלה הושגה</p>
      ) : (
        <p className="text-[10px] text-gray-500 dark:text-gray-300 text-right text-hebrew-body">
          נותר {remaining == null ? "0" : remaining} מתוך {totalAllowed ?? "0"}
        </p>
      )}
    </motion.div>
  );
}
