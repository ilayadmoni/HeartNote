"use client";

/**
 * QuotaModal Component
 * Shown when user has reached their free-tier page creation limit.
 * Prompts upgrade or waiting for existing pages to expire.
 *
 * Uses z-[100] so the backdrop covers the site header / navbar.
 */

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { X, Crown, Sparkles } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

interface QuotaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuotaModal({ isOpen, onClose }: QuotaModalProps) {
  const CLOSE_THEN_NAVIGATE_DELAY_MS = 60;
  const router = useRouter();
  const { profile } = useProfile();

  useLockBodyScroll(isOpen);

  const creationLimit = profile?.subscription.creation_limit ?? 3; // Fallback to 3 if not loaded

  /** Dismiss → close the modal and go home */
  const handleDismiss = () => {
    onClose();
    window.setTimeout(() => {
      router.push("/");
    }, CLOSE_THEN_NAVIGATE_DELAY_MS);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        /* Single full-screen overlay — z-[100] sits above the navbar */
        <motion.div
          key="quota-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center backdrop-blur-sm"
          onClick={onClose}
        >
          {/* Modal card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md mx-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header — Premium gradient */}
            <div className="relative bg-gradient-to-br from-[#2e3c52] to-[#1a2535] p-6 text-center">
              <button
                onClick={onClose}
                className="absolute top-4 left-4 text-white/60 hover:text-white transition-colors"
                aria-label="סגור"
              >
                <X size={20} />
              </button>

              {/* Animated crown icon */}
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30"
              >
                <Crown size={28} className="text-white" />
              </motion.div>

              <h2
                className="text-xl font-bold text-white mb-1"
                style={{ fontFamily: "'Open Sans', sans-serif" }}
              >
                הגעת למגבלת היצירות!
              </h2>
              <p
                className="text-white/70 text-sm"
                style={{ fontFamily: "'Open Sans', sans-serif" }}
              >
              חשבון חינמי מוגבל ל-{creationLimit} יצירות 
              </p>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              {/* Info card */}
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-xl p-4">
                <p
                  className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed text-center"
                  style={{ fontFamily: "'Open Sans', sans-serif" }}
                >
                  משתמשים חינמיים יכולים ליצור עד {creationLimit} ברכות.
                  <br />
                  שדרגו לפרימיום ליצירת עוד ברכות
                </p>
              </div>

              {/* Pro features teaser */}
              <div className="space-y-2.5">
                {["תוקף ארוך יותר (יותר מ24 שעות)", "תמיכה בתבניות פרימיום"].map(
                  (feature) => (
                    <div key={feature} className="flex items-center gap-2.5">
                      <Sparkles
                        size={14}
                        className="text-amber-500 flex-shrink-0"
                      />
                      <span
                        className="text-sm text-gray-600 dark:text-gray-300"
                        style={{ fontFamily: "'Open Sans', sans-serif" }}
                      >
                        {feature}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-700 space-y-2.5">
              {/* Upgrade → /pricing via Next.js <Link> */}
              <Link
                href="/pricing"
                onClick={onClose}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl font-bold text-sm shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
                style={{ fontFamily: "'Open Sans', sans-serif" }}
              >
                <Crown size={16} />
                שדרגו לפרימיום
              </Link>

              {/* Dismiss → close modal & navigate home */}
              <button
                onClick={handleDismiss}
                className="w-full py-2.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                style={{ fontFamily: "'Open Sans', sans-serif" }}
              >
                אחזור מאוחר יותר
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
