"use client";

import type { AccessibilitySettings } from "./AccessibilityProvider";
import { KEYS } from "./constants";
import { ToggleRow } from "./ToggleRow";

interface AccessibilityModalContentProps {
  settings: AccessibilitySettings;
  increaseText: () => void;
  decreaseText: () => void;
  toggleHighContrast: () => void;
  toggleGrayscale: () => void;
  toggleHighlightLinks: () => void;
  toggleReadableFont: () => void;
  toggleStopAnimations: () => void;
  reset: () => void;
  onClose: () => void;
}

export function AccessibilityModalContent({
  settings,
  increaseText,
  decreaseText,
  toggleHighContrast,
  toggleGrayscale,
  toggleHighlightLinks,
  toggleReadableFont,
  toggleStopAnimations,
  reset,
  onClose,
}: AccessibilityModalContentProps) {
  return (
    <div
      className="flex flex-col gap-4 p-5 text-sm text-gray-800 dark:text-gray-200 overflow-y-auto max-h-[80vh] lg:max-h-[calc(100vh-6rem)]"
      role="dialog"
      aria-modal="true"
      aria-label="תפריט נגישות"
      onKeyDown={(event) => {
        if (event.key === KEYS.ESCAPE) {
          event.preventDefault();
          onClose();
        }
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm sm:text-base font-semibold">נגישות</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            התאם את הממשק
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-1 text-gray-500 hover:text-gray-900 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4826f]"
          aria-label="סגור תפריט נגישות"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6L6 18" />
            <path d="M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="space-y-3">
        {/* Text Size Control */}
        <div className="flex items-center justify-between rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2">
          <span className="text-xs sm:text-sm font-medium">גודל טקסט</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={decreaseText}
              disabled={settings.fontScale <= 0.85}
              className="h-8 w-8 rounded-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4826f]"
              aria-label="הקטן טקסט"
            >
              A−
            </button>
            <span className="w-8 text-center text-xs text-gray-500 dark:text-gray-400">
              {Math.round(settings.fontScale * 100)}%
            </span>
            <button
              type="button"
              onClick={increaseText}
              disabled={settings.fontScale >= 1.3}
              className="h-8 w-8 rounded-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4826f]"
              aria-label="הגדל טקסט"
            >
              A+
            </button>
          </div>
        </div>

        {/* Toggles */}
        <ToggleRow
          label="ניגודיות גבוהה"
          description="ערכת צבעים כהה עם ניגודיות גבוהה"
          checked={settings.highContrast}
          onChange={toggleHighContrast}
        />
        <ToggleRow
          label="מצב אפור"
          description="הסר צבעים מהדף"
          checked={settings.grayscale}
          onChange={toggleGrayscale}
        />
        <ToggleRow
          label="הדגש קישורים"
          description="הוסף קו תחתון וצבע לקישורים"
          checked={settings.highlightLinks}
          onChange={toggleHighlightLinks}
        />
        <ToggleRow
          label="גופן קריא"
          description="השתמש בגופן סטנדרטי"
          checked={settings.readableFont}
          onChange={toggleReadableFont}
        />
        <ToggleRow
          label="עצור אנימציה"
          description="עצור את כל האנימציות באתר"
          checked={settings.stopAnimations}
          onChange={toggleStopAnimations}
        />
      </div>

      {/* Reset Button */}
      <button
        type="button"
        onClick={reset}
        className="mt-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4826f]"
      >
        איפוס הגדרות
      </button>
    </div>
  );
}
