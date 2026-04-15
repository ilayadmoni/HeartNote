"use client";

/**
 * ModalActions — Confirm question, action buttons, and footer note
 * for CreationConfirmModal. Extracted for modularity.
 */

import { motion } from "framer-motion";

interface ModalActionsProps {
  isSubmitting: boolean;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ModalActions({ isSubmitting, loading, onClose, onConfirm }: ModalActionsProps) {
  const busy = isSubmitting || loading;

  return (
    <>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
        className="text-center text-sm font-medium text-navy-700 dark:text-gray-200 mb-4 text-hebrew-heading">
        האם אתה בטוח שברצונך ליצור את הברכה?
      </motion.p>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex gap-3">
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onClose} disabled={busy}
          className="flex-1 py-3 px-4 border border-gray-300 dark:border-navy-500 rounded-xl font-bold text-sm text-navy-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-navy-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-hebrew-heading">
          חזור
        </motion.button>
        <motion.button whileHover={{ scale: !isSubmitting ? 1.02 : 1 }} whileTap={{ scale: !isSubmitting ? 0.98 : 1 }}
          onClick={onConfirm} disabled={busy}
          className="flex-1 py-3 px-4 bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-700 text-white rounded-xl font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed text-hebrew-heading shadow-lg hover:shadow-xl">
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>יוצר...</span>
            </div>
          ) : "יצירת ברכה דיגיטלית"}
        </motion.button>
      </motion.div>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
        className="text-xs text-center text-gray-500 dark:text-gray-300 mt-2 text-hebrew-body">
        הערה: לאחר יצירה לא ניתן לערוך את הברכה
      </motion.p>
    </>
  );
}
