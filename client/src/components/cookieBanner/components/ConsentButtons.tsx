"use client";

import type { CookieBannerContentProps } from "../types";

/**
 * Shared Accept / Reject button pair used by both
 * Desktop and Mobile cookie‑banner layouts.
 */
export function ConsentButtons({
  onAcceptAll,
  onRejectAll,
}: CookieBannerContentProps) {
  return (
    <div className="flex flex-col-reverse md:flex-row items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
      <button
        onClick={onRejectAll}
        className="w-full md:w-auto border border-gray-300 dark:border-gray-600 bg-transparent text-[#2e3c52] dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 px-6 py-2.5 rounded-full text-hebrew-body text-sm font-medium transition-all duration-200 whitespace-nowrap"
        aria-label="דחיית כל העוגיות"
      >
        דחייה
      </button>

      <button
        onClick={onAcceptAll}
        className="w-full md:w-auto bg-[#d4826f] hover:bg-[#c4735f] text-white px-8 py-2.5 rounded-full text-hebrew-body text-sm font-bold transition-all duration-200 whitespace-nowrap shadow-sm"
        aria-label="אישור כל העוגיות"
      >
        אישור הכל
      </button>
    </div>
  );
}
