"use client";

/**
 * UpgradeSlideOver
 *
 * Shared right-side drawer panel opened when an active Lite or Premium
 * subscriber hits their creation quota. Replaces full-page navigation —
 * the background content stays visible and unedited.
 *
 * Tier-aware content:
 *   lite    → "שדרג לפרו"     — comparison table, upgrade CTA → /pricing (new tab)
 *   premium → "הוסף ברכות"   — contact support CTA → /contact
 */

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X, Zap, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

export interface UpgradeSlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  /** The user's current paid tier. */
  tier: "lite" | "premium";
  /** Plan creation limit (including bonus quota). */
  creationLimit: number;
  /** ISO string — displayed as the subscription's active-until date. */
  expiryDate?: string | null;
}

function formatDate(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

const PRO_FEATURES = [
  "6 ברכות לתקופה",
  "תוקף הברכות — 45 יום",
  "גישה לכל תבניות הפרימיום",
  "הסרת סימן מים מהכרטיס",
  "העלאת תמונות אישיות",
];

export function UpgradeSlideOver({
  isOpen,
  onClose,
  tier,
  creationLimit,
  expiryDate,
}: UpgradeSlideOverProps) {
  useLockBodyScroll(isOpen);

  const closeButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (isOpen) closeButtonRef.current?.focus();
  }, [isOpen]);

  const formattedExpiry = formatDate(expiryDate);
  const isLite = tier === "lite";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="slide-over-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-[2px]"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.aside
            key="slide-over-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="fixed right-0 top-0 h-full z-[1001] w-full sm:w-[420px] bg-white dark:bg-gray-900 shadow-2xl flex flex-col overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label={isLite ? "שדרג לפרו" : "הוסף ברכות"}
          >
            {/* Header */}
            <div
              className={`flex-shrink-0 p-6 ${
                isLite
                  ? "bg-gradient-to-br from-[#2e3c52] to-[#1a2535]"
                  : "bg-gradient-to-br from-[#3d5a7a] to-[#2e3c52]"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <button
                  ref={closeButtonRef}
                  onClick={onClose}
                  className="p-1.5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="סגור"
                >
                  <X size={20} />
                </button>

                {/* Icon */}
                <motion.div
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                    isLite
                      ? "bg-gradient-to-br from-amber-400 to-amber-500 shadow-amber-500/30"
                      : "bg-gradient-to-br from-[#d4826f] to-[#c4735f] shadow-[#d4826f]/30"
                  }`}
                >
                  <Zap size={22} className="text-white fill-white" />
                </motion.div>
              </div>

              <div className="text-right">
                <h2
                  className="text-xl font-bold text-white mb-1"
                  style={{ fontFamily: "'Open Sans', sans-serif" }}
                >
                  {isLite ? "שדרג לפרו ✨" : "הוסף ברכות"}
                </h2>
                <p
                  className="text-white/70 text-sm"
                  style={{ fontFamily: "'Open Sans', sans-serif" }}
                >
                  {isLite
                    ? `ניצלת את ${creationLimit}/${creationLimit} ברכות בתוכנית Lite`
                    : `ניצלת את ${creationLimit}/${creationLimit} ברכות בתוכנית Pro`}
                </p>
                {formattedExpiry && (
                  <p
                    className="text-white/50 text-xs mt-1"
                    style={{ fontFamily: "'Open Sans', sans-serif" }}
                  >
                    המנוי פעיל עד {formattedExpiry}
                  </p>
                )}
              </div>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {isLite ? (
                <>
                  {/* Plan comparison */}
                  <div>
                    <p
                      className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-3 text-right"
                      style={{ fontFamily: "'Open Sans', sans-serif" }}
                    >
                      השוואת תוכניות
                    </p>
                    <div className="grid grid-cols-2 gap-3 text-sm" dir="rtl">
                      {/* Lite column */}
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-gray-400 mb-2 font-medium">תוכנית Lite הנוכחית</p>
                        <p className="text-2xl font-bold text-gray-700 dark:text-white mb-1">
                          {creationLimit}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">ברכות לתקופה</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">תוקף 30 ימים</p>
                      </div>

                      {/* Pro column */}
                      <div className="bg-gradient-to-b from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-700 relative overflow-hidden">
                        <div className="absolute top-2 left-2 bg-amber-400 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                          מומלץ
                        </div>
                        <p className="text-xs text-amber-600 dark:text-amber-400 mb-2 font-medium">תוכנית Pro</p>
                        <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mb-1">
                          6
                        </p>
                        <p className="text-xs text-amber-700 dark:text-amber-500">ברכות לתקופה</p>
                        <p className="text-xs text-amber-700 dark:text-amber-500 mt-1">תוקף 45 ימים</p>
                      </div>
                    </div>
                  </div>

                  {/* Pro features */}
                  <div>
                    <p
                      className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-3 text-right"
                      style={{ fontFamily: "'Open Sans', sans-serif" }}
                    >
                      מה כוללת תוכנית Pro
                    </p>
                    <div className="space-y-2.5" dir="rtl">
                      {PRO_FEATURES.map((feature) => (
                        <div key={feature} className="flex items-center gap-2.5">
                          <CheckCircle2 size={15} className="text-amber-500 flex-shrink-0" />
                          <span
                            className="text-sm text-gray-600 dark:text-gray-300"
                            style={{ fontFamily: "'Open Sans', sans-serif" }}
                          >
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Active subscription note */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 rounded-xl p-4" dir="rtl">
                    <p
                      className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed"
                      style={{ fontFamily: "'Open Sans', sans-serif" }}
                    >
                      הברכות שיצרת כבר פעילות ונגישות.
                      המנוי שלך פעיל
                      {formattedExpiry ? ` עד ${formattedExpiry}` : ""} — לא יבוטל.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  {/* Premium — contact support */}
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-xl p-5" dir="rtl">
                    <p
                      className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed"
                      style={{ fontFamily: "'Open Sans', sans-serif" }}
                    >
                      ניצלת את כל {creationLimit} הברכות בתוכנית Pro.
                      <br />
                      <br />
                      ניתן לפנות לתמיכה כדי להוסיף ברכות נוספות לתוכנית הפעילה.
                    </p>
                  </div>

                  {/* Subscription still active */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 rounded-xl p-4" dir="rtl">
                    <p
                      className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed"
                      style={{ fontFamily: "'Open Sans', sans-serif" }}
                    >
                      הברכות הקיימות שלך ממשיכות לפעול.
                      המנוי פעיל
                      {formattedExpiry ? ` עד ${formattedExpiry}` : ""} — לא יבוטל.
                    </p>
                  </div>

                  {/* Options */}
                  <div dir="rtl">
                    <p
                      className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-3"
                      style={{ fontFamily: "'Open Sans', sans-serif" }}
                    >
                      האפשרויות שלך
                    </p>
                    <div className="space-y-2.5">
                      {[
                        "פנו לתמיכה להוספת ברכות נוספות",
                        "ברכות קיימות זמינות עד תאריך תפוגתן",
                        "המתינו לתחילת מחזור המנוי הבא",
                      ].map((item) => (
                        <div key={item} className="flex items-center gap-2.5">
                          <ArrowLeft size={14} className="text-[#d4826f] flex-shrink-0" />
                          <span
                            className="text-sm text-gray-600 dark:text-gray-300"
                            style={{ fontFamily: "'Open Sans', sans-serif" }}
                          >
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer CTA */}
            <div className="flex-shrink-0 p-4 border-t border-gray-100 dark:border-gray-700 space-y-2.5 bg-white dark:bg-gray-900">
              {isLite ? (
                <>
                  <Link
                    href="/pricing"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onClose}
                    className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl font-bold text-sm shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
                    style={{ fontFamily: "'Open Sans', sans-serif" }}
                  >
                    <Zap size={16} className="fill-white" />
                    שדרג לפרו עכשיו
                  </Link>
                  <p
                    className="text-[11px] text-center text-gray-400 dark:text-gray-500 px-2"
                    style={{ fontFamily: "'Open Sans', sans-serif" }}
                  >
                    ייפתח בחלון חדש — היצירה הנוכחית לא תאבד
                  </p>
                </>
              ) : (
                <Link
                  href="/contact"
                  onClick={onClose}
                  className="w-full py-3.5 bg-gradient-to-r from-[#2e3c52] to-[#3d5a7a] hover:from-[#3d5a7a] hover:to-[#4a6a8a] text-white rounded-xl font-bold text-sm shadow-md shadow-[#2e3c52]/20 transition-all flex items-center justify-center gap-2"
                  style={{ fontFamily: "'Open Sans', sans-serif" }}
                >
                  צרו קשר עם התמיכה
                </Link>
              )}

              <button
                onClick={onClose}
                className="w-full py-2.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                style={{ fontFamily: "'Open Sans', sans-serif" }}
              >
                {isLite ? "אולי מאוחר יותר" : "חזרה"}
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
