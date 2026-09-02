"use client";

/**
 * PhoneScreen Component
 * Sample date-invitation UI shown inside the hero phone frame.
 */

import { Heart } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { dirFor, isLocale, DEFAULT_LOCALE } from "@/i18n/locale";

interface PhoneScreenProps {
  isDodging?: boolean;
  motionOk?: boolean;
}

export function PhoneScreen({ isDodging = false, motionOk = true }: PhoneScreenProps): JSX.Element {
  const t = useTranslations("home.phone");
  const rawLocale = useLocale();
  const dir = dirFor(isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE);

  return (
    <div className="w-full h-full flex flex-col bg-surface" dir={dir}>
      <div className="bg-surface-sunken px-3 py-4 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Heart size={16} className="text-accent" fill="currentColor" />
          <span className="text-ink text-[11px] font-bold">HeartNote</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-line-strong" />
        </div>
      </div>

      <div className="bg-surface px-3 py-1.5 flex items-center justify-between border-b border-line">
        <span className="text-[10px] font-bold text-ink">{t("screenTitle")}</span>
        <div className="bg-accent text-accent-ink text-[7px] px-2 py-0.5 rounded-pill">{t("screenBadge")}</div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-3 gap-2">
        <div className="bg-accent-soft p-1.5 rounded-control">
          <Heart size={16} className="text-accent" fill="currentColor" />
        </div>

        <div className="bg-surface rounded-card shadow-soft p-4 w-full text-center">
          <p className="text-[12px] font-bold text-ink mb-1">{t("question")}</p>
          <p className="text-[8px] text-ink-subtle mb-3">{t("hint")}</p>

          <div className="flex gap-3 justify-center items-center">
            <button
              className="text-[10px] text-ink-muted px-4 py-1.5 rounded-pill border border-line bg-surface"
              style={{
                transform: `translateX(${isDodging && motionOk ? -22 : 0}px)`,
                opacity: isDodging && motionOk ? 0.4 : 1,
                transition: motionOk ? "transform 0.4s cubic-bezier(.4,0,.2,1), opacity 0.4s ease" : "none",
              }}
            >
              {t("no")}
            </button>
            <button className="text-[10px] text-accent-ink bg-accent px-4 py-1.5 rounded-pill flex items-center gap-1">
              {t("yes")} <Heart size={10} fill="currentColor" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-surface border-t border-line px-3 py-1.5 flex items-center justify-center gap-1">
        <span className="text-[8px] font-bold text-ink">HeartNote</span>
        <span className="text-[7px] text-ink-subtle">{t("createdBy")}</span>
      </div>

      <div className="bg-navy-800 px-3 py-1.5 flex items-center justify-center">
        <span className="text-[8px] text-white">{t("editHint")}</span>
      </div>
    </div>
  );
}
