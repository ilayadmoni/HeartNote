"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { X, Crown } from "lucide-react";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

interface PremiumTemplateUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PremiumTemplateUpgradeModal({
  isOpen,
  onClose,
}: PremiumTemplateUpgradeModalProps) {
  useLockBodyScroll(isOpen);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="premium-template-upgrade-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md mx-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="relative bg-gradient-to-br from-[#2e3c52] to-[#1a2535] p-6 text-center">
              <button
                onClick={onClose}
                className="absolute top-4 left-4 text-white/60 hover:text-white transition-colors"
                aria-label="סגור"
              >
                <X size={20} />
              </button>

              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30"
              >
                <Crown size={28} className="text-white" />
              </motion.div>

              <h2
                className="text-xl font-bold text-white mb-1"
                style={{ fontFamily: "'Open Sans', sans-serif" }}
              >
                איזו יצירה מהממת! ✨
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-xl p-4">
                <p
                  className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed text-center"
                  style={{ fontFamily: "'Open Sans', sans-serif" }}
                >
                  התבנית שבחרת היא תבנית פרימיום שזמינה למנויי לייט ופרימיום בלבד. כדי לשמור, לשתף ולשלוח את הברכה, שדרג/י את המנוי עכשיו.
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 dark:border-gray-700 space-y-2.5">
              <Link
                href="/pricing"
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl font-bold text-sm shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
                style={{ fontFamily: "'Open Sans', sans-serif" }}
              >
                <Crown size={16} />
                לשדרוג המנוי
              </Link>

              <p
                className="text-[11px] text-center text-gray-500 dark:text-gray-400 px-2"
                style={{ fontFamily: "'Open Sans', sans-serif" }}
              >
                עמוד התשלום ייפתח בחלון חדש כדי שהיצירה שלך לא תאבד.
              </p>

              <button
                onClick={onClose}
                className="w-full py-2.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                style={{ fontFamily: "'Open Sans', sans-serif" }}
              >
                המשך לערוך
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
