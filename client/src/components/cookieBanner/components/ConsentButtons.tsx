"use client";

import { useTranslations } from "next-intl";
import type { CookieBannerContentProps } from "../types";

/**
 * Shared Accept / Reject button pair used by both
 * Desktop and Mobile cookie‑banner layouts.
 */
export function ConsentButtons({
  onAcceptAll,
  onRejectAll,
}: CookieBannerContentProps): JSX.Element {
  const t = useTranslations("common.cookies");
  return (
    <div className="flex flex-col-reverse md:flex-row items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
      <button
        onClick={onRejectAll}
        className="w-full md:w-auto min-h-[2.75rem] border border-line-strong bg-transparent text-ink hover:bg-surface-sunken px-6 py-2.5 rounded-pill text-body-sm font-medium transition-all duration-200 whitespace-nowrap"
        aria-label={t("rejectAriaLabel")}
      >
        {t("reject")}
      </button>

      <button
        onClick={onAcceptAll}
        className="w-full md:w-auto min-h-[2.75rem] bg-accent hover:bg-accent-hover text-accent-ink px-8 py-2.5 rounded-pill text-body-sm font-bold transition-all duration-200 whitespace-nowrap shadow-soft"
        aria-label={t("acceptAllAriaLabel")}
      >
        {t("acceptAll")}
      </button>
    </div>
  );
}
