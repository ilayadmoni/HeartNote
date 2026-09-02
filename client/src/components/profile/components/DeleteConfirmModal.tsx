"use client";

/**
 * DeleteConfirmModal
 * Confirmation dialog for creation (card) deletion.
 */

import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { Trash2, AlertTriangle, X } from "lucide-react";
import { useTranslations } from "next-intl";

interface DeleteConfirmModalProps {
  isPending: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmModal({ isPending, onConfirm, onCancel }: DeleteConfirmModalProps): JSX.Element | null {
  const t = useTranslations("profile");
  if (typeof document === "undefined") return null;

  return createPortal(
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-ink/50 backdrop-blur-sm z-[999]"
        onClick={onCancel}
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
            <h3 className="text-title-md font-bold text-ink">{t("deleteCreationModal.title")}</h3>
            <p className="text-body-sm text-ink-muted mt-2">{t("deleteCreationModal.body")}</p>
          </div>

          <div className="p-6 flex gap-3">
            <button
              onClick={onConfirm}
              disabled={isPending}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-control bg-red-500 hover:bg-red-600 text-white font-bold text-body-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Trash2 size={16} />
                  <span>{t("deleteCreationModal.confirm")}</span>
                </>
              )}
            </button>
            <button
              onClick={onCancel}
              disabled={isPending}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-control bg-surface-sunken hover:bg-line text-ink font-bold text-body-sm transition-all disabled:opacity-50"
            >
              <X size={16} />
              <span>{t("deleteCreationModal.cancel")}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </>,
    document.body,
  );
}
