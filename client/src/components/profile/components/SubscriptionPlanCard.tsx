"use client";

import { useTranslations } from "next-intl";
import { TIER_CONFIGS } from "../constants";
import type { SubscriptionTier } from "../types";
import { SubscriptionStatusBadge } from "./SubscriptionStatusBadge";
import type { SubscriptionData } from "./SubscriptionCard";

interface SubscriptionPlanCardProps {
  subscription: SubscriptionData;
  creationLimit: number | null | undefined;
  isQuotaFull?: boolean;
  onRenew?: () => void;
  onUpgrade?: () => void;
}

export function SubscriptionPlanCard({
  subscription,
  creationLimit,
  isQuotaFull = false,
  onRenew,
  onUpgrade,
}: SubscriptionPlanCardProps): JSX.Element {
  const t = useTranslations("profile");
  const tierConfig = TIER_CONFIGS[subscription.tier];

  const featureText =
    subscription.tier === "free"
      ? t("subscription.featureFree", { limit: creationLimit ?? 0 })
      : creationLimit == null
        ? t("subscription.featureUnlimited")
        : t("subscription.featurePaid", { limit: creationLimit });

  const expiryDate = subscription.expiryDate || "-";

  return (
    <div className="bg-surface-raised rounded-card p-6 shadow-soft border border-line">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tierConfig.iconBg}`}>
            <span className={`text-body-sm font-bold ${tierConfig.iconColor}`}>
              {t(`tier.${subscription.tier}`).charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="text-title-sm font-bold text-ink">{t(`tier.${subscription.tier}`)}</h3>
            <p className="text-caption text-ink-muted">{featureText}</p>
          </div>
        </div>

        <SubscriptionStatusBadge isActive={subscription.isActive} isQuotaFull={isQuotaFull} />
      </div>

      {subscription.tier !== "free" && isQuotaFull && subscription.isActive && (
        <p className="text-caption text-accent mb-4 leading-relaxed">
          {t("subscription.quotaFullNotice", { date: expiryDate })}
        </p>
      )}

      <div className="space-y-3 mb-6">
        <DateRow label={t("subscription.startDate")} value={subscription.startDate || "-"} />
        <DateRow label={t("subscription.endDate")} value={expiryDate} />
      </div>

      <div className="flex gap-3">
        {subscription.tier === "free" && onUpgrade && (
          <ActionButton label={t("subscription.actions.upgradeToPremium")} onClick={onUpgrade} />
        )}
        {subscription.tier !== "free" && onRenew && (
          <ActionButton label={t("subscription.actions.renew")} onClick={onRenew} />
        )}
        {subscription.tier !== "free" && isQuotaFull && subscription.isActive && onUpgrade && (
          <ActionButton
            label={
              subscription.tier === "lite"
                ? t("subscription.actions.upgradeToPro")
                : t("subscription.actions.addCreations")
            }
            onClick={onUpgrade}
          />
        )}
      </div>
    </div>
  );
}

function DateRow({ label, value }: { label: string; value: string }): JSX.Element {
  return (
    <div className="flex items-center justify-between py-2 border-b border-line last:border-0">
      <span className="text-body-sm text-ink-muted">{label}</span>
      <span className="text-body-sm font-medium text-ink">{value}</span>
    </div>
  );
}

function ActionButton({ label, onClick }: { label: string; onClick: () => void }): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 py-2.5 rounded-control text-body-sm font-medium bg-accent hover:bg-accent-hover text-accent-ink transition-colors duration-base ease-out-quint"
    >
      {label}
    </button>
  );
}
