"use client";

import Link from "next/link";
import { ConsentButtons } from "../components";
import type { CookieBannerContentProps } from "../types";

/**
 * Desktop cookie‑consent banner — full-width bar at the bottom.
 */
export function CookieBannerDesktop({
  onAcceptAll,
  onRejectAll,
}: CookieBannerContentProps) {
  return (
    <div
      dir="rtl"
      role="dialog"
      aria-label="הגדרות עוגיות"
      aria-modal="false"
      className="fixed bottom-0 left-0 w-full z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] py-4 px-4 md:px-8 animate-[cookieSlideUp_0.4s_ease-out]"
    >
      <div className="max-w-7xl mx-auto flex flex-row items-center justify-between gap-8">
        <div className="flex-1">
          <p className="text-hebrew-body text-sm text-[#2e3c52] dark:text-gray-300 leading-relaxed m-0 text-right">
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

        <div className="flex-shrink-0">
          <ConsentButtons onAcceptAll={onAcceptAll} onRejectAll={onRejectAll} />
        </div>
      </div>
    </div>
  );
}
