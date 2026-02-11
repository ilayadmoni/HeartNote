"use client";

/**
 * SubscriptionCard Component
 * Displays user's subscription tier, dates, and status.
 * Aligned with new DB schema (subscription_tier: free | premium).
 */

import { motion } from "framer-motion";
import { Calendar, AlertCircle, CheckCircle, Crown } from "lucide-react";
import { TIER_CONFIGS } from "../constants";

interface SubscriptionData {
  tier: string;
  startDate: string | undefined;
  expiryDate: string | undefined;
  isActive: boolean;
}

interface SubscriptionCardProps {
  subscription: SubscriptionData;
  onRenew: () => void;
  onUpgrade: () => void;
}

export function SubscriptionCard({
  subscription,
  onRenew,
  onUpgrade,
}: SubscriptionCardProps) {
  const tierKey = (subscription.tier === "premium" ? "premium" : "free") as keyof typeof TIER_CONFIGS;
  const tierConfig = TIER_CONFIGS[tierKey];
  const startDate = subscription.startDate
    ? new Date(subscription.startDate).toLocaleDateString("he-IL")
    : "—";
  const expiryDate = subscription.expiryDate
    ? new Date(subscription.expiryDate).toLocaleDateString("he-IL")
    : "—";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${tierConfig.color}20` }}
          >
            <Crown size={20} style={{ color: tierConfig.color }} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#2e3c52] dark:text-white text-hebrew-heading">
              {tierConfig.nameHe}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-hebrew-body">
              {tierConfig.features[0]}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <StatusBadge isActive={subscription.isActive} />
      </div>

      {/* Dates */}
      <div className="space-y-3 mb-6">
        <DateRow
          icon={<Calendar size={16} />}
          label="תאריך התחלה"
          value={startDate}
        />
        <DateRow
          icon={<Calendar size={16} />}
          label="תאריך סיום"
          value={expiryDate}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {subscription.tier !== "premium" && (
          <ActionButton label="שדרוג לפרימיום" onClick={onUpgrade} variant="primary" />
        )}
        {subscription.tier === "premium" && (
          <ActionButton label="חידוש מנוי" onClick={onRenew} variant="primary" />
        )}
      </div>
    </div>
  );
}

function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <motion.div
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      className={`
        flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
        ${
          isActive
            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
            : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
        }
      `}
    >
      {isActive ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
      <span className="text-hebrew-body">{isActive ? "פעיל" : "פג תוקף"}</span>
    </motion.div>
  );
}

function DateRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
        {icon}
        <span className="text-sm text-hebrew-body">{label}</span>
      </div>
      <span className="text-sm font-medium text-[#2e3c52] dark:text-white">
        {value}
      </span>
    </div>
  );
}

function ActionButton({
  label,
  onClick,
  variant,
}: {
  label: string;
  onClick: () => void;
  variant: "primary" | "secondary";
}) {
  const baseStyles =
    "flex-1 py-2.5 rounded-xl text-sm font-medium transition-all text-hebrew-body";
  const variantStyles =
    variant === "primary"
      ? "bg-[#d4826f] hover:bg-[#c4735f] text-white"
      : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-[#2e3c52] dark:text-white";

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`${baseStyles} ${variantStyles}`}
    >
      {label}
    </motion.button>
  );
}
