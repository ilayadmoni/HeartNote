"use client";

/**
 * DeleteAccountCard Component
 * Danger zone section for account deletion with confirmation modal
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Trash2, X } from "lucide-react";

interface DeleteAccountCardProps {
  onDelete: () => Promise<void>;
}

export function DeleteAccountCard({ onDelete }: DeleteAccountCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const handleDelete = async () => {
    if (confirmText !== "מחק" || isDeleting) return;

    setIsDeleting(true);
    try {
      await onDelete();
      // Success - user will be logged out and redirected
    } catch {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (isDeleting) return;
    setIsModalOpen(false);
    setConfirmText("");
  };

  return (
    <>
      {/* Danger Zone Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border-2 border-red-200 dark:border-red-900/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <AlertTriangle size={20} className="text-red-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-red-600 dark:text-red-400 text-hebrew-heading">
              אזור סכנה
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-hebrew-body">
              פעולות שלא ניתן לבטל
            </p>
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 text-hebrew-body">
          מחיקת החשבון תמחק את כל הנתונים שלכם לצמיתות, כולל כל הברכות שיצרתם.
          פעולה זו אינה ניתנת לביטול.
        </p>

        <button
          onClick={() => setIsModalOpen(true)}
          className="
            flex items-center justify-center gap-2 w-full py-2.5 rounded-lg
            bg-red-500 hover:bg-red-600
            text-white font-bold text-sm
            transition-all duration-200
            text-hebrew-heading
          "
        >
          <Trash2 size={16} />
          <span>מחיקת חשבון</span>
        </button>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 pointer-events-auto"
              onClick={handleClose}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
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
                    מחיקת חשבון
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-hebrew-body">
                    האם אתם בטוחים? פעולה זו לא ניתנת לביטול.
                  </p>
                </div>

                {/* Content */}
                <div className="p-6">
                  <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2 text-hebrew-body">
                    הקלידו <strong className="text-red-500">מחק</strong> לאישור:
                  </label>
                  <input
                    type="text"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder="מחק"
                    className="
                      w-full px-3 py-2.5 rounded-lg text-sm
                      bg-white dark:bg-gray-700
                      border-2 border-gray-200 dark:border-gray-600
                      focus:border-red-400 dark:focus:border-red-500
                      transition-all duration-200
                      text-[#2e3c52] dark:text-white text-center
                      text-hebrew-body focus:outline-none
                    "
                    dir="rtl"
                    disabled={isDeleting}
                  />
                </div>

                {/* Actions */}
                <div className="p-6 pt-0 flex gap-3">
                  <button
                    onClick={handleDelete}
                    disabled={confirmText !== "מחק" || isDeleting}
                    className="
                      flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg
                      bg-red-500 hover:bg-red-600
                      text-white font-bold text-sm
                      transition-all duration-200
                      disabled:opacity-50 disabled:cursor-not-allowed
                      text-hebrew-heading
                    "
                  >
                    {isDeleting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Trash2 size={16} />
                        <span>מחיקה לצמיתות</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleClose}
                    disabled={isDeleting}
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
        )}
      </AnimatePresence>
    </>
  );
}
