"use client";

/**
 * Scrollable, tier-aware body content for UpgradeSlideOver.
 * Extracted for modularity (150-line file cap).
 */

import { CheckCircle2, ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

interface UpgradeSlideOverBodyProps {
  isLite: boolean;
  creationLimit: number;
  formattedExpiry: string | null;
}

const PRO_FEATURE_KEYS = ["upgrade.feature1", "upgrade.feature2", "upgrade.feature3", "upgrade.feature4", "upgrade.feature5"];

export function UpgradeSlideOverBody({ isLite, creationLimit, formattedExpiry }: UpgradeSlideOverBodyProps): JSX.Element {
  const t = useTranslations("editor");
  const locale = useLocale();
  const ArrowIcon = locale === "he" ? ArrowLeft : ArrowRight;
  const expirySuffix = formattedExpiry ? t("upgrade.expirySuffix", { date: formattedExpiry }) : "";

  if (isLite) {
    return (
      <>
        <div>
          <p className="text-body-sm font-bold text-ink mb-3 text-end">{t("upgrade.comparePlans")}</p>
          <div className="grid grid-cols-2 gap-3 text-body-sm">
            <div className="bg-surface-sunken rounded-card p-4 border border-line">
              <p className="text-caption text-ink-subtle mb-2 font-medium">{t("upgrade.currentLitePlan")}</p>
              <p className="text-title-sm font-bold text-ink mb-1">{creationLimit}</p>
              <p className="text-caption text-ink-muted">{t("upgrade.creationsPerPeriod")}</p>
              <p className="text-caption text-ink-muted mt-1">{t("upgrade.validity30")}</p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-card p-4 border border-amber-200 dark:border-amber-700 relative overflow-hidden">
              <div className="absolute top-2 start-2 bg-amber-400 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-pill">
                {t("upgrade.recommended")}
              </div>
              <p className="text-caption text-amber-600 dark:text-amber-400 mb-2 font-medium">{t("upgrade.proPlan")}</p>
              <p className="text-title-sm font-bold text-amber-600 dark:text-amber-400 mb-1">6</p>
              <p className="text-caption text-amber-700 dark:text-amber-500">{t("upgrade.creationsPerPeriod")}</p>
              <p className="text-caption text-amber-700 dark:text-amber-500 mt-1">{t("upgrade.validity45")}</p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-body-sm font-bold text-ink mb-3 text-end">{t("upgrade.proIncludes")}</p>
          <div className="space-y-2.5">
            {PRO_FEATURE_KEYS.map((key) => (
              <div key={key} className="flex items-center gap-2.5">
                <CheckCircle2 size={15} className="text-amber-500 flex-shrink-0" />
                <span className="text-body-sm text-ink-muted">{t(key)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 rounded-card p-4">
          <p className="text-caption text-blue-700 dark:text-blue-400 leading-relaxed">
            {t("upgrade.activeNoteLite", { expiry: expirySuffix })}
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-card p-5">
        <p className="text-body-sm text-amber-800 dark:text-amber-300 leading-relaxed">
          {t("upgrade.premiumUsedUp", { limit: creationLimit })}
          <br /><br />
          {t("upgrade.premiumContactHint")}
        </p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 rounded-card p-4">
        <p className="text-caption text-blue-700 dark:text-blue-400 leading-relaxed">
          {t("upgrade.activeNotePremium", { expiry: expirySuffix })}
        </p>
      </div>

      <div>
        <p className="text-body-sm font-bold text-ink mb-3">{t("upgrade.yourOptions")}</p>
        <div className="space-y-2.5">
          {["upgrade.optionContact", "upgrade.optionExisting", "upgrade.optionWait"].map((key) => (
            <div key={key} className="flex items-center gap-2.5">
              <ArrowIcon size={14} className="text-accent flex-shrink-0" />
              <span className="text-body-sm text-ink-muted">{t(key)}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
