"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ConsentButtons } from "../components";
import type { CookieBannerContentProps } from "../types";

/**
 * Mobile cookie‑consent banner — full‑width bar fixed at the bottom.
 */
export function CookieBannerMobile({
  onAcceptAll,
  onRejectAll,
}: CookieBannerContentProps): JSX.Element {
  const t = useTranslations("common.cookies");

  return (
    <div
      role="dialog"
      aria-label={t("dialogLabel")}
      aria-modal="false"
      className="fixed bottom-0 start-0 w-full z-50 bg-surface-raised border-t border-line shadow-lift py-5 px-4 animate-[cookieSlideUp_0.35s_ease-out]"
    >
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-body-sm text-ink-muted leading-relaxed text-start m-0">
            {t.rich("message", {
              link: (chunks) => (
                <Link href="/privacy" className="underline hover:text-ink transition-colors">
                  {chunks}
                </Link>
              ),
            })}
          </p>
        </div>

        <ConsentButtons onAcceptAll={onAcceptAll} onRejectAll={onRejectAll} />
      </div>
    </div>
  );
}
