"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { OpenWhenEnvelope } from "../types";
import { DEFAULT_PRIMARY_COLOR } from "@/components/templates/types";

interface LetterModalProps {
  envelope: OpenWhenEnvelope | null;
  onClose: () => void;
  primaryColor?: string;
}

export function LetterModal({
  envelope,
  onClose,
  primaryColor = DEFAULT_PRIMARY_COLOR,
}: LetterModalProps) {
  const t = useTranslations("common");
  const locale = useLocale();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!envelope) return;

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
  }, [envelope]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {envelope && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-md z-[999] pointer-events-auto"
          />

          {/* Letter - Centered on both Desktop and Mobile */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            className="fixed inset-0 z-[999] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="bg-surface-raised rounded-card shadow-2xl w-full max-w-lg max-h-[80vh] relative pointer-events-auto flex flex-col"
              style={{
                backgroundImage: `repeating-linear-gradient(transparent, transparent 31px, #e5e5e5 31px, #e5e5e5 32px)`,
                backgroundPosition: "0 24px",
              }}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 start-4 w-8 h-8 flex items-center justify-center rounded-full bg-surface-sunken hover:bg-line transition-colors z-10"
                aria-label={t("actions.close")}
              >
                <X size={16} />
              </button>

              {/* Header section (non-scrolling) */}
              <div className="px-6 md:px-8 pt-6 md:pt-8 flex-shrink-0">
                {/* Title */}
                <h2
                  className="text-title-lg font-black mb-1 text-center break-words"
                  style={{ color: primaryColor }}
                  dir="auto"
                >
                  {envelope.title}
                </h2>

                {/* Unlock date */}
                {envelope.dateOpen && (
                  <p
                    className="text-sm font-semibold text-center mb-3 tracking-wide"
                    style={{ color: primaryColor, opacity: 0.8 }}
                  >
                    {new Date(envelope.dateOpen).toLocaleDateString(locale === "he" ? "he-IL" : "en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                )}

                {/* Divider */}
                <div
                  className="w-16 h-0.5 mx-auto mb-6"
                  style={{ backgroundColor: primaryColor }}
                />
              </div>

              {/* Letter Content (scrollable) */}
              <div className="flex-1 overflow-y-auto px-6 md:px-8 pb-6 md:pb-8">
                <div className="text-ink text-lg leading-relaxed break-words whitespace-pre-wrap" dir="auto">
                  {envelope.content}
                </div>

                {/* Heart signature */}
                <div className="text-center mt-8 text-3xl">💕</div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
