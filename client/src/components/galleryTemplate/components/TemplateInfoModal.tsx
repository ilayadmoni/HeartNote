"use client";

import { useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { useMotionOk } from "@/lib/motion";

interface TemplateInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  infoText: string;
}

export function TemplateInfoModal({
  isOpen,
  onClose,
  title,
  description,
  infoText,
}: TemplateInfoModalProps): JSX.Element {
  const t = useTranslations("gallery");
  const motionOk = useMotionOk();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleKeyDown]);

  useEffect(() => {
    if (isOpen) {
      returnFocusRef.current = document.activeElement as HTMLElement;
      closeButtonRef.current?.focus();
    } else {
      returnFocusRef.current?.focus({ preventScroll: true });
      returnFocusRef.current = null;
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) document.body.style.pointerEvents = "auto";
    return () => {
      document.body.style.pointerEvents = "auto";
    };
  }, [isOpen]);

  return (
    <AnimatePresence mode="wait" onExitComplete={() => { document.body.style.pointerEvents = "auto"; }}>
      {isOpen && (
        <motion.div
          key="template-info-modal-root"
          initial={motionOk ? { opacity: 0, pointerEvents: "none" } : false}
          animate={{ opacity: 1, pointerEvents: "auto" }}
          exit={{ opacity: 0, pointerEvents: "none" }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[999] flex items-center justify-center p-4 overscroll-contain touch-none"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={t("card.infoAria", { title })}
        >
          <div
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm touch-none"
            onTouchMove={(e) => e.preventDefault()}
          />

          <motion.div
            initial={motionOk ? { opacity: 0, y: 60 } : false}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: "spring", damping: 28, stiffness: 350 }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full sm:max-w-md bg-surface-raised rounded-card border border-line shadow-lift overflow-hidden touch-pan-y max-h-[85vh] flex flex-col"
          >
            <div className="relative flex items-center justify-center px-6 py-5">
              <h3 className="text-title-md text-ink text-center whitespace-nowrap tracking-tight">{title}</h3>
              <button
                ref={closeButtonRef}
                onClick={onClose}
                className="absolute start-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-pill bg-surface-sunken hover:bg-line text-ink transition-colors duration-base"
                aria-label={t("infoModal.close")}
              >
                <X size={16} strokeWidth={2.5} aria-hidden="true" />
              </button>
            </div>

            <div className="h-px bg-line mx-6" />

            <div className="px-6 pt-5 pb-2 overflow-y-auto flex-1" dir="auto">
              <p className="text-body-md text-ink font-medium leading-relaxed">{description}</p>

              <div className="mt-5 px-[18px] py-4 rounded-card bg-surface-sunken border border-line">
                <div className="text-overline text-accent mb-2">{t("infoModal.howItWorks")}</div>
                <p className="text-body-sm text-ink-muted leading-[1.8]">{infoText}</p>
              </div>
            </div>

            <div className="px-6 pb-5 pt-4">
              <button
                onClick={onClose}
                className="w-full py-3 rounded-pill font-bold text-body-md bg-accent hover:bg-accent-hover text-accent-ink transition-colors duration-base focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                {t("infoModal.gotIt")}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
