"use client";

/**
 * PaidQuotaBody — active-subscription notice, feature list, and tier-aware
 * CTA for PaidQuotaModal. Extracted for modularity (150-line file cap).
 */

import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

interface PaidQuotaBodyProps {
  isLite: boolean;
  expiryDate: string | null;
  onClose: () => void;
  onRequestUpgrade: () => void;
  onDismiss: () => void;
}

export function PaidQuotaBody({ isLite, expiryDate, onClose, onRequestUpgrade, onDismiss }: PaidQuotaBodyProps): JSX.Element {
  const t = useTranslations("editor");
  const features = isLite
    ? [t("quota.liteFeature1"), t("quota.liteFeature2")]
    : [t("quota.premiumFeature1"), t("quota.premiumFeature2")];

  return (
    <>
      <div className="p-6 space-y-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 rounded-control p-4">
          <p className="text-body-sm text-blue-800 dark:text-blue-300 leading-relaxed text-center">
            {t("quota.activeNoticeActive")}
            {expiryDate ? ` ${t("quota.activeNoticeExpiry", { date: expiryDate })}` : null}
            {t("quota.activeNoticeTail")}
          </p>
        </div>

        <div className="space-y-2.5">
          {features.map((feature) => (
            <div key={feature} className="flex items-center gap-2.5">
              <Sparkles size={14} className="text-accent flex-shrink-0" />
              <span className="text-body-sm text-ink-muted">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-line space-y-2.5">
        <button
          onClick={() => { onClose(); onRequestUpgrade(); }}
          className="w-full py-3.5 bg-accent hover:bg-accent-hover text-accent-ink rounded-pill font-bold text-body-sm shadow-glow-sm transition-colors flex items-center justify-center gap-2"
        >
          {isLite ? t("quota.upgradeToPremium") : t("quota.contactSupport")}
        </button>

        <button
          onClick={onDismiss}
          className="w-full py-2.5 text-body-sm text-ink-muted hover:text-ink transition-colors"
        >
          {t("quota.stayWithCurrent")}
        </button>
      </div>
    </>
  );
}
