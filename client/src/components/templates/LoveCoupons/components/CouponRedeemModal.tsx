"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { CouponCodeInput } from "./CouponCodeInput";
import { StampSpinner } from "./StampSpinner";

interface Props {
  open: boolean;
  couponTitle: string;
  isSubmitting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  primaryColor?: string;
  needsCodeInput?: boolean;
  enteredCode?: string;
  onEnteredCodeChange?: (code: string) => void;
  codeError?: string | null;
}

export function CouponRedeemModal({
  open,
  couponTitle,
  isSubmitting,
  onConfirm,
  onCancel,
  primaryColor,
  needsCodeInput,
  enteredCode,
  onEnteredCodeChange,
  codeError,
}: Props) {
  const t = useTranslations("templates");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (open) cancelButtonRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const body = document.body;
    const originalOverflow = body.style.overflow;
    const originalPosition = body.style.position;
    const originalTop = body.style.top;
    const originalWidth = body.style.width;
    const originalTouchAction = body.style.touchAction;
    const scrollY = window.scrollY;

    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    body.style.touchAction = "none";

    return () => {
      body.style.overflow = originalOverflow;
      body.style.position = originalPosition;
      body.style.top = originalTop;
      body.style.width = originalWidth;
      body.style.touchAction = originalTouchAction;
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[999] flex items-center justify-center backdrop-blur-sm bg-black/50"
          onClick={isSubmitting ? undefined : onCancel}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-surface-raised rounded-card w-full max-w-sm mx-4 shadow-2xl overflow-hidden border border-line"
          >
            <div className="pt-5 px-6 pb-6">
              {/* Header */}
              <div className="text-center mb-4">
                <h2 className="text-title-md font-bold text-ink mb-0.5">
                  {t("loveCoupons.modalTitle")}
                </h2>
                <p className="text-xs text-ink-muted">{t("loveCoupons.modalSubtitle")}</p>
              </div>

              {/* Body */}
              <div className="text-center mb-5">
                <p className="font-semibold text-ink text-base mb-2" dir="auto">
                  {couponTitle}
                </p>
                <p className="text-sm text-ink-muted">{t("loveCoupons.confirmQuestion")}</p>
                <p className="text-xs text-amber-700/80 mt-1 font-medium">
                  {t("loveCoupons.irreversibleNotice")}
                </p>
              </div>

              {needsCodeInput && (
                <CouponCodeInput
                  enteredCode={enteredCode}
                  onEnteredCodeChange={onEnteredCodeChange}
                  isSubmitting={isSubmitting}
                  codeError={codeError}
                />
              )}

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  ref={cancelButtonRef}
                  type="button"
                  onClick={onCancel}
                  disabled={isSubmitting}
                  className="w-full sm:flex-1 py-3 rounded-pill border border-line text-ink-muted font-semibold text-sm transition-colors hover:bg-surface-sunken disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {t("loveCoupons.cancel")}
                </button>

                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={isSubmitting}
                  className="w-full sm:flex-1 py-3 rounded-pill text-white font-semibold text-sm bg-amber-600 border border-amber-700/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-amber-700 inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting && <StampSpinner />}
                  {isSubmitting ? t("loveCoupons.redeeming") : t("loveCoupons.modalTitle")}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
