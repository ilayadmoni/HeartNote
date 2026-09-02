"use client";

import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { FocusTrap } from "@/components/accessibility";

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
}: ActiveSubscriptionWarningModalProps): JSX.Element | null {
  const t = useTranslations("pricing");
  useLockBodyScroll(isOpen);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] bg-ink/60 flex items-center justify-center backdrop-blur-sm"
          onClick={onCancel}
        >
          <FocusTrap active={isOpen} onEscape={onCancel}>
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-md mx-4 bg-surface-raised rounded-card shadow-lift overflow-hidden"
            >
              <div className="p-6 border-b border-line">
                <div className="w-12 h-12 rounded-full bg-accent-soft flex items-center justify-center mx-auto mb-3">
                  <AlertTriangle className="text-accent" size={22} />
                </div>
                <h3 className="text-center text-title-md font-bold text-ink mb-2">
                  {t("warningModal.title")}
                </h3>
                <p className="text-center text-body-sm text-ink-muted leading-relaxed">
                  {t("warningModal.body")}
                </p>
              </div>

              <div className="p-4 flex gap-3">
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 px-4 rounded-control border border-line-strong text-ink hover:bg-surface-sunken transition-colors disabled:opacity-50"
                >
                  {t("warningModal.cancel")}
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 px-4 rounded-control bg-accent hover:bg-accent-hover text-accent-ink transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? t("warningModal.confirming") : t("warningModal.confirm")}
                </button>
              </div>
            </motion.div>
          </FocusTrap>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
