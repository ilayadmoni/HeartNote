"use client";

import { useEffect, useRef, useState } from "react";
import { FocusTrap } from "@/components/accessibility";
import { useAccessibility } from "@/components/accessibility/AccessibilityProvider";
import { KEYS } from "@/components/accessibility/constants";

export function AccessibilityWidget() {
  const {
    settings,
    increaseText,
    decreaseText,
    toggleHighContrast,
    toggleGrayscale,
    toggleHighlightLinks,
    toggleReadableFont,
    reset,
  } = useAccessibility();
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen && triggerRef.current) {
      triggerRef.current.focus();
    }
  }, [isOpen]);

  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen((prev) => !prev);

  return (
    <div
      className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 md:bottom-6 md:right-6"
      dir="rtl"
    >
      <button
        ref={triggerRef}
        type="button"
        aria-label="פתח תפריט נגישות"
        onClick={toggle}
        className="h-12 w-12 rounded-full bg-[#d4826f] hover:bg-[#c4735f] dark:bg-[#b87156] dark:hover:bg-[#a85f42] text-white shadow-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8b5a47]"
      >
        <span className="sr-only">נגישות</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="mx-auto h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="4" r="2" />
          <path d="M6 22l2-7h8l2 7" />
          <path d="M4 10h16" />
          <path d="M9 10l-2 7" />
          <path d="M15 10l2 7" />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={close}
            aria-hidden="true"
          />
          <div
            className="absolute bottom-6 right-6 w-[320px] max-w-[95vw] max-h-[90dvh] overflow-y-auto rounded-2xl bg-white dark:bg-gray-800 shadow-2xl ring-1 ring-black/5"
            dir="rtl"
          >
            <FocusTrap active={isOpen} onEscape={close}>
              <div
                className="flex flex-col gap-4 p-5 text-sm text-gray-800 dark:text-gray-200"
                role="dialog"
                aria-modal="true"
                aria-label="תפריט נגישות"
                onKeyDown={(event) => {
                  if (event.key === KEYS.ESCAPE) {
                    event.preventDefault();
                    close();
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm sm:text-base font-semibold">נגישות</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      התאם את הממשק
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={close}
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
            </FocusTrap>
          </div>
        </div>
      )}
    </div>
  );
}

type ToggleRowProps = {
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
};

function ToggleRow({ label, description, checked, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2">
      <div className="flex-1">
        <p className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200">
          {label}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative flex-shrink-0 h-7 w-12 rounded-full transition ${
          checked ? "bg-[#d4826f]" : "bg-gray-200 dark:bg-gray-600"
        }`}
        aria-label={`${label}: ${checked ? "פעיל" : "כבוי"}`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}
