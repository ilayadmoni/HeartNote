"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

interface Props {
  open: boolean;
  couponTitle: string;
  isSubmitting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  primaryColor?: string;
}

export function CouponRedeemModal({
  open,
  couponTitle,
  isSubmitting,
  onConfirm,
  onCancel,
  primaryColor,
}: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

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
          dir="rtl"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl w-full max-w-sm mx-4 shadow-2xl overflow-hidden border border-coral-100"
          >
            <div className="pt-5 px-6 pb-6">
              {/* Header */}
              <div className="text-center mb-4">
                <h2 className="text-lg font-bold text-navy-700 mb-0.5 text-hebrew-heading">
                  מימוש קופון
                </h2>
                <p className="text-xs text-gray-500 text-hebrew-body">
                  אישור מימוש סופי
                </p>
              </div>

              {/* Body */}
              <div className="text-center mb-5">
                <p className="font-semibold text-gray-800 text-base mb-2 text-hebrew-body">
                  {couponTitle}
                </p>
                <p className="text-sm text-gray-500 text-hebrew-body">
                  האם את/ה בטוח/ה? פעולה זו אינה ניתנת לביטול.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row-reverse gap-3">
                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={isSubmitting}
                  style={primaryColor ? { backgroundColor: primaryColor } : undefined}
                  className="w-full sm:flex-1 py-3 rounded-xl text-white font-semibold text-sm bg-rose-500 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity hover:opacity-90 inline-flex items-center justify-center gap-2 text-hebrew-body cursor-pointer"
                >
                  {isSubmitting && <Loader2 className="animate-spin" size={16} />}
                  {isSubmitting ? "ממש..." : "מימוש קופון"}
                </button>

                <button
                  type="button"
                  onClick={onCancel}
                  disabled={isSubmitting}
                  className="w-full sm:flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-hebrew-body"
                >
                  ביטול
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
