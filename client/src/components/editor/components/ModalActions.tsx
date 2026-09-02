"use client";

/**
 * ModalActions — Confirm question, action buttons, and footer note
 * for CreationConfirmModal. Extracted for modularity.
 */

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

interface ModalActionsProps {
  isSubmitting: boolean;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ModalActions({ isSubmitting, loading, onClose, onConfirm }: ModalActionsProps): JSX.Element {
  const t = useTranslations("editor");
  const busy = isSubmitting || loading;

  return (
    <>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
        className="text-center text-caption font-bold text-ink mb-2.5">
        {t("confirmModal.confirmQuestion")}
      </motion.p>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex gap-2.5">
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onClose} disabled={busy}
          className="flex-1 py-2 px-3 border border-line-strong rounded-pill font-bold text-body-sm text-ink hover:bg-surface-sunken transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          {t("confirmModal.back")}
        </motion.button>
        <motion.button whileHover={{ scale: !isSubmitting ? 1.02 : 1 }} whileTap={{ scale: !isSubmitting ? 0.98 : 1 }}
          onClick={onConfirm} disabled={busy}
          className="flex-1 py-2 px-3 bg-accent hover:bg-accent-hover text-accent-ink rounded-pill font-bold text-body-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-glow-sm">
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>{t("confirmModal.creating")}</span>
            </div>
          ) : t("confirmModal.create")}
        </motion.button>
      </motion.div>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
        className="text-caption text-center text-ink-muted mt-2">
        {t("confirmModal.editNote")}
      </motion.p>
    </>
  );
}
