"use client";

/**
 * PaidQuotaModal
 *
 * Shown when an active Lite or Premium subscriber has used all their
 * creation slots for the current billing cycle.
 *
 * Tone: warm, non-alarming, solution-focused.
 * - Never cancels / deactivates the subscription.
 * - Shows the expiry date so the user knows they're still covered.
 * - CTA is tier-aware:
 *     lite    → "שדרגו לפרימיום"   (Upgrade to Premium)
 *     premium → "צרו קשר עם התמיכה" (Contact support)
 */

import { motion } from "framer-motion";
import { useRouter } from "@/i18n/navigation";
import { X, Heart, Sparkles } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

interface PaidQuotaModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Called when the user clicks the tier-specific CTA — opens the UpgradeSlideOver. */
  onRequestUpgrade: () => void;
}

function formatExpiryDate(isoString: string | null | undefined): string | null {
  if (!isoString) return null;
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return null;
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

export function PaidQuotaModal({ isOpen, onClose, onRequestUpgrade }: PaidQuotaModalProps) {
  const CLOSE_THEN_NAVIGATE_DELAY_MS = 60;
  const router = useRouter();
  const { profile } = useProfile();

  useLockBodyScroll(isOpen);

  const tier = profile?.subscription.tier ?? "lite";
  const isLite = tier === "lite";
  const creationLimit = profile?.subscription.creation_limit ?? 0;
  const expiryDate = formatExpiryDate(profile?.subscription.premium_expiry);

  const handleDismiss = () => {
    onClose();
    window.setTimeout(() => {
      router.push("/");
    }, CLOSE_THEN_NAVIGATE_DELAY_MS);
  };

  return (
    <motion.div
      key="paid-quota-overlay"
      initial={false}
      animate={{ opacity: isOpen ? 1 : 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className={`fixed inset-0 z-[999] bg-black/60 flex items-center justify-center backdrop-blur-sm ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-hidden={!isOpen}
      onClick={onClose}
    >
      {/* Modal card */}
      <motion.div
        initial={false}
        animate={{ scale: isOpen ? 1 : 0.98, y: isOpen ? 0 : 12, opacity: isOpen ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md mx-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="relative bg-gradient-to-br from-[#2e3c52] to-[#3d5a7a] p-6 text-center">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 text-white/60 hover:text-white transition-colors"
            aria-label="סגור"
          >
            <X size={20} />
          </button>

          {/* Animated heart icon */}
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#d4826f] to-[#c4735f] flex items-center justify-center shadow-lg shadow-[#d4826f]/30"
          >
            <Heart size={28} className="text-white fill-white" />
          </motion.div>

          <h2
            className="text-xl font-bold text-white mb-1"
            style={{ fontFamily: "'Open Sans', sans-serif" }}
          >
            ניצלת את כל הברכות לתקופה זו
          </h2>
          <p
            className="text-white/70 text-sm"
            style={{ fontFamily: "'Open Sans', sans-serif" }}
          >
            {isLite ? "מנוי לייט" : "מנוי פרימיום"} — {creationLimit} ברכות לתקופה
          </p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Active subscription notice */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 rounded-xl p-4">
            <p
              className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed text-center"
              style={{ fontFamily: "'Open Sans', sans-serif" }}
            >
              המנוי שלך{" "}
              <span className="font-semibold">עדיין פעיל</span>
              {expiryDate ? (
                <>
                  {" "}ותקף עד{" "}
                  <span className="font-semibold">{expiryDate}</span>
                </>
              ) : null}
              . לא חויבת דבר נוסף — פשוט הגעת למגבלת הברכות לתקופה הנוכחית.
            </p>
          </div>

          {/* What you can do */}
          <div className="space-y-2.5">
            {(isLite
              ? [
                  "שדרוג לפרימיום מעניק 6 ברכות לתקופה",
                  "תבניות פרימיום ותוקף ארוך יותר",
                ]
              : [
                  "ניתן לפנות לתמיכה להוספת ברכות",
                  "ברכות קיימות פעילות עד תאריך התפוגה",
                ]
            ).map((feature) => (
              <div key={feature} className="flex items-center gap-2.5">
                <Sparkles size={14} className="text-[#d4826f] flex-shrink-0" />
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

        {/* Actions — tier-aware CTA */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-700 space-y-2.5">
          {isLite ? (
            <button
              onClick={() => { onClose(); onRequestUpgrade(); }}
              className="w-full py-3.5 bg-gradient-to-r from-[#d4826f] to-[#c4735f] hover:from-[#c4735f] hover:to-[#b4634f] text-white rounded-xl font-bold text-sm shadow-md shadow-[#d4826f]/20 transition-all flex items-center justify-center gap-2"
              style={{ fontFamily: "'Open Sans', sans-serif" }}
            >
              <Heart size={16} className="fill-white" />
              שדרגו לפרימיום
            </button>
          ) : (
            <button
              onClick={() => { onClose(); onRequestUpgrade(); }}
              className="w-full py-3.5 bg-gradient-to-r from-[#2e3c52] to-[#3d5a7a] hover:from-[#3d5a7a] hover:to-[#4a6a8a] text-white rounded-xl font-bold text-sm shadow-md shadow-[#2e3c52]/20 transition-all flex items-center justify-center gap-2"
              style={{ fontFamily: "'Open Sans', sans-serif" }}
            >
              <Sparkles size={16} />
              צרו קשר עם התמיכה
            </button>
          )}

          {/* Dismiss */}
          <button
            onClick={handleDismiss}
            className="w-full py-2.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            style={{ fontFamily: "'Open Sans', sans-serif" }}
          >
            אסתפק בברכות הקיימות
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
