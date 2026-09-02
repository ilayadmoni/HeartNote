"use client";

import { Link } from "@/i18n/navigation";
import { ConsentButtons } from "../components";
import type { CookieBannerContentProps } from "../types";

/**
 * Mobile cookie‑consent banner — full‑width bar fixed at the bottom.
 */
export function CookieBannerMobile({
  onAcceptAll,
  onRejectAll,
}: CookieBannerContentProps) {
  return (
    <div
      dir="rtl"
      role="dialog"
      aria-label="הגדרות עוגיות"
      aria-modal="false"
      className="fixed bottom-0 left-0 w-full z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] py-5 px-4 animate-[cookieSlideUp_0.35s_ease-out]"
    >
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-hebrew-body text-sm text-[#2e3c52] dark:text-gray-300 leading-relaxed text-right m-0">
            אתר זה עושה שימוש בקובצי עוגיות (Cookies) כדי לשפר את חוויית הגלישה
            שלך, להציג תוכן מותאם אישית ולנתח את נתוני התנועה שלנו. בהמשך
            הגלישה, הנך מסכים/ה{" "}
            <Link
              href="/privacy"
              className="underline hover:text-gray-800 dark:hover:text-white transition-colors"
            >
              למדיניות הפרטיות
            </Link>{" "}
            שלנו.
          </p>
        </div>

        <ConsentButtons onAcceptAll={onAcceptAll} onRejectAll={onRejectAll} />
      </div>
    </div>
  );
}
