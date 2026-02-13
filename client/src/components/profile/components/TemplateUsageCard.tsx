"use client";

/**
 * TemplateUsageCard Component
 * Displays creation usage stats with a progress bar.
 * Shows "Used / Limit" based on subscription_policies data.
 */

import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import type { SubscriptionTier } from "../types";

interface TemplateUsageCardProps {
  used: number;
  limit: number | null; // null = unlimited
  tier: SubscriptionTier;
}

export function TemplateUsageCard({
  used,
  limit,
  tier,
}: TemplateUsageCardProps) {
  const isPremium = tier === "premium";
  const isUnlimited = limit == null;
  const percent = isUnlimited
    ? 0
    : limit > 0
      ? Math.min((used / limit) * 100, 100)
      : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-[#d4826f]/10 flex items-center justify-center">
          <FileText size={20} className="text-[#d4826f]" />
        </div>
        <h3 className="text-lg font-bold text-[#2e3c52] dark:text-white text-hebrew-heading">
          הכרטיסים שלי
        </h3>
      </div>

      {/* Usage label */}
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 text-center text-hebrew-body">
        {isUnlimited
          ? `נוצרו ${used} יצירות – ללא הגבלה 🎉`
          : `נוצלו ${used} מתוך ${limit} יצירות`}
      </p>

      {/* Progress bar (only for limited tiers) */}
      {!isUnlimited && (
        <div className="w-full h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`h-full rounded-full ${
              percent >= 90
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
