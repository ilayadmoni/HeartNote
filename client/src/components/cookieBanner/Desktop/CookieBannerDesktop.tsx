"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ConsentButtons } from "../components";
import type { CookieBannerContentProps } from "../types";

/**
 * Desktop cookie‑consent banner — full-width bar at the bottom.
 */
export function CookieBannerDesktop({
  onAcceptAll,
  onRejectAll,
}: CookieBannerContentProps): JSX.Element {
  const t = useTranslations("common.cookies");

  return (
    <div
      role="dialog"
      aria-label={t("dialogLabel")}
      aria-modal="false"
      className="fixed bottom-0 start-0 w-full z-50 bg-surface-raised border-t border-line shadow-lift py-4 px-4 md:px-8 animate-[cookieSlideUp_0.4s_ease-out]"
    >
      <div className="max-w-shell mx-auto flex flex-row items-center justify-between gap-8">
        <div className="flex-1">
          <p className="text-body-sm text-ink-muted leading-relaxed m-0 text-start">
            {t.rich("message", {
              link: (chunks) => (
                <Link href="/privacy" className="underline hover:text-ink transition-colors">
                  {chunks}
                </Link>
              ),
            })}
          </p>
        </div>

        <div className="shrink-0">
          <ConsentButtons onAcceptAll={onAcceptAll} onRejectAll={onRejectAll} />
        </div>
      </div>
    </div>
  );
}
