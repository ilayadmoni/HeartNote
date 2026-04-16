"use client";

/**
 * SubscriptionCard Component
 * Always displays free plan card and optionally a paid plan card.
 */

import { motion } from "framer-motion";
import { Calendar, AlertCircle, CheckCircle, Crown, AlertTriangle } from "lucide-react";
import { TIER_CONFIGS } from "../constants";
import type { SubscriptionTier } from "../types";

interface SubscriptionData {
  tier: SubscriptionTier;
  startDate: string | undefined;
  expiryDate: string | undefined;
  isActive: boolean;
}

interface SubscriptionCardProps {
  freeSubscription: SubscriptionData;
  paidSubscription?: SubscriptionData;
  onRenew: () => void;
  onUpgrade: () => void;
  freeCreationLimit: number | null;
  paidCreationLimit?: number | null;
  /** True when the paid plan is active but all creation slots have been used. */
  isPaidQuotaFull?: boolean;
}

export function SubscriptionCard({
  freeSubscription,
  paidSubscription,
  onRenew,
  onUpgrade,
  freeCreationLimit,
  paidCreationLimit,
  isPaidQuotaFull = false,
}: SubscriptionCardProps) {
  const hasActivePaidSubscription = Boolean(paidSubscription?.isActive);

  return (
    <div className="space-y-4">
      <SingleSubscriptionPlanCard
        subscription={freeSubscription}
        creationLimit={freeCreationLimit}
        onUpgrade={hasActivePaidSubscription ? undefined : onUpgrade}
      />

      {paidSubscription && (
        <SingleSubscriptionPlanCard
          subscription={paidSubscription}
          creationLimit={paidCreationLimit}
          isQuotaFull={isPaidQuotaFull}
          onRenew={paidSubscription.isActive ? undefined : onRenew}
          onUpgrade={isPaidQuotaFull ? onUpgrade : undefined}
        />
      )}
    </div>
  );
}

function SingleSubscriptionPlanCard({
  subscription,
  creationLimit,
  isQuotaFull = false,
  onRenew,
  onUpgrade,
}: {
  subscription: SubscriptionData;
  creationLimit: number | null | undefined;
  isQuotaFull?: boolean;
  onRenew?: () => void;
  onUpgrade?: () => void;
}) {
  const tierConfig = TIER_CONFIGS[subscription.tier];

  const featureText =
    subscription.tier === "free"
      ? `${creationLimit ?? 0} יצירות חינם`
      : creationLimit == null
        ? "ללא הגבלה - הכל כלול"
        : `${creationLimit} יצירות במסלול`;

  const startDate = subscription.startDate
    ? new Date(subscription.startDate).toLocaleDateString("he-IL")
    : "—";
  const expiryDate = subscription.expiryDate || "—";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-3">
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
              {featureText}
            </p>
          </div>
        </div>

        <StatusBadge isActive={subscription.isActive} isQuotaFull={isQuotaFull} />
      </div>

      {/* Secondary line — shown only when quota is full and subscription is active */}
      {subscription.tier !== "free" && isQuotaFull && subscription.isActive && (
        <p
          className="text-xs text-amber-700 dark:text-amber-400 mb-4 text-right leading-relaxed"
          style={{ fontFamily: "'Open Sans', sans-serif" }}
        >
          נוצלו כל היצירות בתוכנית. המנוי פעיל עד {expiryDate}.
        </p>
      )}

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

      <div className="flex gap-3">
        {subscription.tier === "free" && onUpgrade && (
          <ActionButton label="שדרוג לפרימיום" onClick={onUpgrade} variant="primary" />
        )}
        {subscription.tier !== "free" && onRenew && (
          <ActionButton label="חידוש מנוי" onClick={onRenew} variant="primary" />
        )}
        {subscription.tier !== "free" && isQuotaFull && subscription.isActive && onUpgrade && (
          <ActionButton
            label={subscription.tier === "lite" ? "שדרג לפרו" : "הוסף ברכות"}
            onClick={onUpgrade}
            variant="primary"
          />
        )}
      </div>
    </div>
  );
}

function StatusBadge({
  isActive,
  isQuotaFull = false,
}: {
  isActive: boolean;
  isQuotaFull?: boolean;
}) {
  const isQuotaFullAndActive = isActive && isQuotaFull;

  const colorClass = isQuotaFullAndActive
    ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
    : isActive
      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
      : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400";

  const icon = isQuotaFullAndActive
    ? <AlertTriangle size={14} />
    : isActive
      ? <CheckCircle size={14} />
      : <AlertCircle size={14} />;

  const label = isQuotaFullAndActive ? "מכסה מלאה" : isActive ? "פעיל" : "פג תוקף";

  return (
    <motion.div
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${colorClass}`}
    >
      {icon}
      <span className="text-hebrew-body">{label}</span>
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
