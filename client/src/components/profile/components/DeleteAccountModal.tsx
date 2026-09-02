"use client";

/**
 * DeleteAccountModal — typed-confirmation dialog (no window.confirm()).
 */

import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { useTranslations } from "next-intl";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => Promise<void>;
}

export function DeleteAccountModal({ isOpen, onClose, onDelete }: DeleteAccountModalProps): JSX.Element | null {
  const t = useTranslations("profile");
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const confirmWord = t("deleteAccount.confirmWord");

  if (typeof document === "undefined") return null;

  const handleDelete = async (): Promise<void> => {
    if (confirmText !== confirmWord || isDeleting) return;
    setIsDeleting(true);
    setError(null);
    try {
      await onDelete();
    } catch (err) {
      setIsDeleting(false);
      setError(err instanceof Error ? err.message : t("deleteAccount.genericError"));
    }
  };

  const handleClose = (): void => {
    if (isDeleting) return;
    onClose();
    setConfirmText("");
    setError(null);
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-ink/50 backdrop-blur-sm z-[999] pointer-events-auto"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-[999] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="w-full max-w-sm bg-surface-raised rounded-card shadow-lift overflow-hidden pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 text-center border-b border-line">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <AlertTriangle size={28} className="text-red-500" />
                </div>
                <h3 className="text-title-md font-bold text-ink">{t("deleteAccount.modalTitle")}</h3>
                <p className="text-body-sm text-ink-muted mt-2">{t("deleteAccount.modalBody")}</p>
              </div>

              <div className="p-6">
                {error && (
                  <div className="mb-4 p-3 rounded-control bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <p className="text-body-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}
                <label className="block text-body-sm text-ink-muted mb-2">
                  {t("deleteAccount.confirmLabel", { word: confirmWord })}
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder={confirmWord}
                  className="w-full px-3 py-2.5 rounded-control text-body-sm bg-surface border-2 border-line focus:border-red-400 dark:focus:border-red-500 transition-all duration-200 text-ink text-center focus:outline-none"
                  disabled={isDeleting}
                />
              </div>

              <div className="p-6 pt-0 flex gap-3">
                <button
                  onClick={handleDelete}
                  disabled={confirmText !== confirmWord || isDeleting}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-control bg-red-500 hover:bg-red-600 text-white font-bold text-body-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Trash2 size={16} />
                      <span>{t("deleteAccount.confirmCta")}</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleClose}
                  disabled={isDeleting}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-control bg-surface-sunken hover:bg-line text-ink font-bold text-body-sm transition-all duration-200 disabled:opacity-50"
                >
                  <X size={16} />
                  <span>{t("deleteAccount.cancel")}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
