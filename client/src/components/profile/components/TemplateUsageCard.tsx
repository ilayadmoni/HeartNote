"use client";

/**
 * TemplateUsageCard Component
 * Displays free-tier usage and (for paid users) a second paid-tier usage bar.
 */

import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import type { SubscriptionTier } from "../types";

interface UsageTierData {
  tier: SubscriptionTier;
  used: number;
  limit: number | null;
}

interface TemplateUsageCardProps {
  freeUsage: UsageTierData;
  paidUsage?: UsageTierData;
}

export function TemplateUsageCard({
  freeUsage,
  paidUsage,
}: TemplateUsageCardProps) {
  const tierLabel = (tier: SubscriptionTier): string => {
    if (tier === "lite") return "לייט";
    if (tier === "premium") return "פרימיום";
    return "חינמי";
  };

  const renderUsage = (usage: UsageTierData, showTopDivider: boolean) => {
    const isUnlimited = usage.limit == null;
    const totalAllowed = usage.limit ?? 0;
    const percent = isUnlimited
      ? 0
      : totalAllowed > 0
        ? Math.min((usage.used / totalAllowed) * 100, 100)
        : 0;

    return (
      <div
        className={showTopDivider ? "pt-4 mt-4 border-t border-gray-100 dark:border-gray-700" : ""}
      >
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 text-center text-hebrew-body">
          {isUnlimited
            ? `נוצרו ${usage.used} יצירות – ללא הגבלה 🎉`
            : `נוצלו ${usage.used} מתוך ${totalAllowed} יצירות`}
        </p>

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

        <p className="text-center text-xs text-gray-500 dark:text-gray-400 text-hebrew-body">
          מסלול {tierLabel(usage.tier)}
        </p>
      </div>
    );
  };

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

      {renderUsage(freeUsage, false)}
      {paidUsage && renderUsage(paidUsage, true)}
    </div>
  );
}
