"use client";

/**
 * TemplateUsageCard Component
 * Displays creation usage stats.
 */

import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import type { SubscriptionTier } from "../types";

interface TemplateUsageCardProps {
  used: number;
  tier: SubscriptionTier;
}

export function TemplateUsageCard({ used, tier }: TemplateUsageCardProps) {
  const isPremium = tier === "premium";

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

      {/* Stats */}
      <div className="flex items-center justify-center">
        <div className="text-center">
          <p className="text-3xl font-bold text-[#d4826f]">{used}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-hebrew-body">
            כרטיסים נוצרו
          </p>
        </div>
      </div>

      {/* Tier label */}
      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-3 text-hebrew-body">
        {isPremium ? "מנוי פרימיום – ללא הגבלה 🎉" : `מנוי חינמי`}
      </p>
    </div>
  );
}
