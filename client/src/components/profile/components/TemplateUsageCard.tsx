"use client";

/**
 * TemplateUsageCard Component
 * Displays free-tier usage and (for paid users) a second paid-tier usage bar.
 */

import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { useTranslations } from "next-intl";
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

export function TemplateUsageCard({ freeUsage, paidUsage }: TemplateUsageCardProps): JSX.Element {
  const t = useTranslations("profile");

  const renderUsage = (usage: UsageTierData, showTopDivider: boolean): JSX.Element => {
    const isUnlimited = usage.limit == null;
    const totalAllowed = usage.limit ?? 0;
    const percent = isUnlimited ? 0 : totalAllowed > 0 ? Math.min((usage.used / totalAllowed) * 100, 100) : 0;

    return (
      <div className={showTopDivider ? "pt-4 mt-4 border-t border-line" : ""}>
        <p className="text-body-sm text-ink-muted mb-3 text-center">
          {isUnlimited
            ? t("usage.unlimitedUsed", { used: usage.used })
            : t("usage.usedOfLimit", { used: usage.used, limit: totalAllowed })}
        </p>

        {!isUnlimited && (
          <div className="w-full h-3 bg-surface-sunken rounded-pill overflow-hidden mb-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`h-full rounded-pill ${
                percent >= 100 ? "bg-red-500" : percent >= 60 ? "bg-amber-500" : "bg-accent"
              }`}
            />
          </div>
        )}

        <p className="text-center text-caption text-ink-muted">
          {t("usage.planLabel", { tier: t(`tier.${usage.tier}`) })}
        </p>
      </div>
    );
  };

  return (
    <div className="bg-surface-raised rounded-card p-6 shadow-soft border border-line">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-accent-soft flex items-center justify-center">
          <FileText size={20} className="text-accent" />
        </div>
        <h3 className="text-title-sm font-bold text-ink">{t("usage.title")}</h3>
      </div>

      {renderUsage(freeUsage, false)}
      {paidUsage && renderUsage(paidUsage, true)}
    </div>
  );
}
