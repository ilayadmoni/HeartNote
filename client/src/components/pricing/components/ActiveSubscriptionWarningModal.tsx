"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

interface ActiveSubscriptionWarningModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  isSubmitting?: boolean;
}

export function ActiveSubscriptionWarningModal({
  isOpen,
  onCancel,
  onConfirm,
  isSubmitting = false,
}: ActiveSubscriptionWarningModalProps) {
  useLockBodyScroll(isOpen);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center backdrop-blur-sm"
          onClick={onCancel}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-md mx-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="text-amber-600 dark:text-amber-300" size={22} />
              </div>
              <h3 className="text-center text-xl font-bold text-[#2e3c52] dark:text-white text-hebrew-heading mb-2">
                החלפת מנוי פעיל ⚠️
              </h3>
              <p className="text-center text-sm text-gray-600 dark:text-gray-300 text-hebrew-body leading-relaxed">
                שמנו לב שיש לך מנוי פעיל. רכישת מנוי חדש תחליף את המנוי הנוכחי, ותאפס את כמות היצירות שנותרו לך ואת תאריך התפוגה. האם להמשיך?
              </p>
            </div>

            <div className="p-4 flex gap-3">
              <button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
                className="flex-1 py-2.5 px-4 rounded-xl border border-gray-300 dark:border-gray-600 text-[#2e3c52] dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-hebrew-heading disabled:opacity-50"
              >
                ביטול
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={isSubmitting}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#d4826f] hover:bg-[#c4735f] text-white transition-colors text-hebrew-heading disabled:opacity-50"
              >
                {isSubmitting ? "מעבד..." : "כן, למחוק ולשדרג"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
