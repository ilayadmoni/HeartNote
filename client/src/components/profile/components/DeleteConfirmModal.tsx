"use client";

/**
 * DeleteConfirmModal
 *
 * Hebrew confirmation dialog for card deletion.
 * Animated with Framer Motion, includes backdrop blur.
 */

import { motion } from "framer-motion";
import { Trash2, AlertTriangle, X } from "lucide-react";

interface DeleteConfirmModalProps {
  isPending: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmModal({
  isPending,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999]"
        onClick={onCancel}
      />

      {/* Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed inset-0 z-[999] flex items-center justify-center p-4 pointer-events-none"
      >
        <div
          className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 text-center border-b border-gray-100 dark:border-gray-700">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <AlertTriangle size={28} className="text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-[#2e3c52] dark:text-white text-hebrew-heading">
              מחיקת כרטיס
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-hebrew-body">
              האם אתם בטוחים? פעולה זו לא ניתנת לביטול.
            </p>
          </div>

          {/* Actions */}
          <div className="p-6 flex gap-3">
            <button
              onClick={onConfirm}
              disabled={isPending}
              className="
                flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg
                bg-red-500 hover:bg-red-600 text-white font-bold text-sm
                transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                text-hebrew-heading
              "
            >
              {isPending ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Trash2 size={16} />
                  <span>מחיקה לצמיתות</span>
                </>
              )}
            </button>
            <button
              onClick={onCancel}
              disabled={isPending}
              className="
                flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg
                bg-gray-100 dark:bg-gray-700
                hover:bg-gray-200 dark:hover:bg-gray-600
                text-[#2e3c52] dark:text-white font-bold text-sm
                transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                text-hebrew-heading
              "
            >
              <X size={16} />
              <span>ביטול</span>
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
