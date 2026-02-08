"use client";

/**
 * TemplateUsageCard Component
 * Displays template usage progress bar and quota
 */

import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { PLAN_CONFIGS } from "../constants";
import type { PlanType } from "../types";

interface TemplateUsageCardProps {
  used: number;
  plan: PlanType;
}

export function TemplateUsageCard({ used, plan }: TemplateUsageCardProps) {
  const planConfig = PLAN_CONFIGS[plan];
  const max = planConfig.maxTemplates;
  const isUnlimited = max >= 999;
  const percentage = isUnlimited ? 0 : Math.min((used / max) * 100, 100);
  const remaining = isUnlimited ? "∞" : max - used;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-[#d4826f]/10 flex items-center justify-center">
          <FileText size={20} className="text-[#d4826f]" />
        </div>
        <h3 className="text-lg font-bold text-[#2e3c52] dark:text-white text-hebrew-heading">
          שימוש בתבניות
        </h3>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-[#d4826f]">{used}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-hebrew-body">
            נוצרו
          </p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-[#2e3c52] dark:text-white">
            {remaining}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-hebrew-body">
            נותרו
          </p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-400">
            {isUnlimited ? "∞" : max}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-hebrew-body">
            מקסימום
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      {!isUnlimited && (
        <div className="relative h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-y-0 right-0 bg-gradient-to-l from-[#d4826f] to-[#e8917a] rounded-full"
          />
        </div>
      )}

      {/* Percentage Text */}
      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-3 text-hebrew-body">
        {isUnlimited
          ? "ללא הגבלה 🎉"
          : `${used} מתוך ${max} תבניות (${Math.round(percentage)}%)`}
      </p>
    </div>
  );
}
