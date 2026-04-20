"use client";

/**
 * TemplateInfoModal — Lightweight mobile-friendly dialog
 * explaining what a template is and how to use it.
 *
 * Uses Framer Motion for enter/exit animations and
 * supports close-on-backdrop + close-on-Escape.
 */

import { useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

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
}: TemplateInfoModalProps) {
  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  useLockBodyScroll(isOpen);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[999] flex items-center justify-center p-4"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`מידע על ${title}`}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm touch-none"
            onTouchMove={(e) => e.preventDefault()}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: "spring", damping: 28, stiffness: 350 }}
            onClick={(e) => e.stopPropagation()}
            className="
              relative z-10 w-full sm:max-w-md
              bg-white dark:bg-gray-800
              rounded-2xl border border-gray-100 dark:border-gray-700
              shadow-2xl overflow-hidden touch-pan-y
              max-h-[85vh] flex flex-col
            "
          >
            {/* Header — centered title on white/dark surface, close btn floats left */}
            <div className="relative flex items-center justify-center px-6 py-5">
              <h3 className="text-lg font-bold text-[#2e3c52] dark:text-white text-hebrew-heading text-center whitespace-nowrap tracking-tight">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="
                  absolute left-4 top-1/2 -translate-y-1/2
                  w-8 h-8 flex items-center justify-center rounded-full
                  bg-gray-100 hover:bg-gray-200
                  dark:bg-gray-700 dark:hover:bg-gray-600
                  text-[#2e3c52] dark:text-gray-200
                  transition-colors duration-150
                "
                aria-label="סגור"
              >
                <X size={16} strokeWidth={2.5} />
              </button>
            </div>

            {/* Hairline divider */}
            <div className="h-px bg-gray-100 dark:bg-gray-700 mx-6" />

            {/* Body */}
            <div className="px-6 pt-5 pb-2 overflow-y-auto flex-1" dir="rtl">
              {/* Description */}
              <p className="text-[15px] text-[#2e3c52] dark:text-gray-100 font-medium leading-relaxed text-hebrew-body">
                {description}
              </p>

              {/* "How it works" callout card — replaces the divider + emoji */}
              <div
                className="
                  mt-5 px-[18px] py-4 rounded-2xl
                  bg-[#f7f4f1] border border-[#eee6df]
                  dark:bg-gray-700/50 dark:border-gray-600
                "
              >
                <div className="text-xs font-bold text-[#d4826f] tracking-[0.08em] uppercase mb-2 text-hebrew-heading">
                  איך זה עובד
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-300 leading-[1.8] text-hebrew-body">
                  {infoText}
                </p>
              </div>
            </div>

            {/* Footer CTA */}
            <div className="px-6 pb-5 pt-4">
              <button
                onClick={onClose}
                className="
                  w-full py-3 rounded-xl font-bold text-[15px]
                  bg-[#d4826f] hover:bg-[#c4735f]
                  text-white transition-all duration-200
                  text-hebrew-heading
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4826f] focus-visible:ring-offset-2
                "
              >
                הבנתי
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
