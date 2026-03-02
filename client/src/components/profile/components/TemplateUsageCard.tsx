"use client";

/**
 * TemplateUsageCard Component
 * Displays free-tier creation usage stats with a progress bar.
 * Shows "Used / TotalAllowed" based on creations_count_free, creation_limit,
 * and additional_creation_free.
 *
 * For premium users the bar is hidden and "unlimited" is displayed.
 */

import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import type { SubscriptionTier } from "../types";

interface TemplateUsageCardProps {
  /** Number of free creations the user has made (creations_count_free) */
  used: number;
  /** Total allowed free creations (creation_limit + additional_creation_free). null = unlimited */
  limit: number | null;
  tier: SubscriptionTier;
}

export function TemplateUsageCard({
  used,
  limit,
  tier,
}: TemplateUsageCardProps) {
  const isPremium = tier === "premium";
  const isUnlimited = limit == null || isPremium;
  const totalAllowed = limit ?? 0;
  // Cap at 100% so the bar never overflows
  const percent = isUnlimited
    ? 0
    : totalAllowed > 0
      ? Math.min((used / totalAllowed) * 100, 100)
      : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-[#d4826f]/10 flex items-center justify-center">
          <FileText size={20} className="text-[#d4826f]" />
        </div>
        <h3 className="text-lg font-bold text-[#2e3c52] dark:text-white text-hebrew-heading">
          יתרת היצירות שלי
        </h3>
      </div>

      {/* Usage label */}
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 text-center text-hebrew-body">
        {isUnlimited
          ? `נוצרו ${used} יצירות – ללא הגבלה 🎉`
          : `נוצלו ${used} מתוך ${totalAllowed} יצירות`}
      </p>

      {/* Progress bar (only for limited / free tier) */}
      {!isUnlimited && (
        <div className="w-full h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`h-full rounded-full ${
              percent >= 100
                ? "bg-red-500"
                : percent >= 60
                  ? "bg-amber-500"
                  : "bg-[#d4826f]"
            }`}
          />
        </div>
      )}

      {/* Tier label */}
      <p className="text-center text-xs text-gray-500 dark:text-gray-400 text-hebrew-body">
        {isPremium ? "מנוי פרימיום – ללא הגבלה 🎉" : "מנוי חינמי"}
      </p>
    </div>
  );
}
