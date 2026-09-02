"use client";

import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";

interface SubscriptionStatusBadgeProps {
  isActive: boolean;
  isQuotaFull?: boolean;
}

export function SubscriptionStatusBadge({
  isActive,
  isQuotaFull = false,
}: SubscriptionStatusBadgeProps): JSX.Element {
  const t = useTranslations("profile");
  const isQuotaFullAndActive = isActive && isQuotaFull;

  const colorClass = isQuotaFullAndActive
    ? "bg-accent-soft text-accent"
    : isActive
      ? "bg-surface-sunken text-ink"
      : "bg-surface-sunken text-ink-subtle";

  const icon = isQuotaFullAndActive ? (
    <AlertTriangle size={14} />
  ) : isActive ? (
    <CheckCircle size={14} />
  ) : (
    <AlertCircle size={14} />
  );

  const label = isQuotaFullAndActive
    ? t("subscription.status.quotaFull")
    : isActive
      ? t("subscription.status.active")
      : t("subscription.status.expired");

  return (
    <motion.div
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-body-sm font-medium ${colorClass}`}
    >
      {icon}
      <span>{label}</span>
    </motion.div>
  );
}
