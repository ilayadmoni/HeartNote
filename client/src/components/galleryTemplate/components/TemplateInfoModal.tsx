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
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
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
              rounded-2xl
              shadow-2xl overflow-hidden touch-pan-y
              max-h-[85vh] flex flex-col
            "
          >
            {/* Header */}
            <div className="relative flex items-center justify-center px-5 py-4 bg-[#2e3c52] dark:bg-gray-900">
              <h3 className="text-lg font-bold text-white text-hebrew-heading text-center">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="
                  absolute left-4
                  w-8 h-8 flex items-center justify-center rounded-full
                  bg-white/10 hover:bg-white/20
                  text-white
                  transition-colors duration-150
                "
                aria-label="סגור"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="px-5 py-4 overflow-y-auto flex-1" dir="rtl">
              {/* Description */}
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 leading-relaxed text-hebrew-body">
                {description}
              </p>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600" />
                <span className="text-xs font-medium text-gray-400 dark:text-gray-500 tracking-wider text-hebrew-body">
                  💡 איך זה עובד?
                </span>
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600" />
              </div>

              {/* Funny info text */}
              <p className="text-sm text-[#2e3c52] dark:text-gray-200 leading-[1.8] text-hebrew-body">
                {infoText}
              </p>
            </div>

            {/* Footer CTA */}
            <div className="px-5 pb-5 pt-2">
              <button
                onClick={onClose}
                className="
                  w-full py-2.5 rounded-xl font-bold text-sm
                  bg-[#2e3c52] hover:bg-[#1B263B]
                  text-white transition-all duration-200
                  text-hebrew-heading
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2e3c52] focus-visible:ring-offset-2
                "
              >
                הבנתי! 👍
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
