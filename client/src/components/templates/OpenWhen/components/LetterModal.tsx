"use client";

/**
 * LetterModal Component
 * Full-screen modal with paper-style letter, handwritten font, close button
 */

import { motion, AnimatePresence } from "framer-motion";
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
  return (
    <AnimatePresence>
      {envelope && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Letter */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg md:max-h-[80vh] z-50 overflow-auto"
          >
            <div
              className="bg-[#fffef8] dark:bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8 min-h-[360px]"
              style={{
                backgroundImage: `repeating-linear-gradient(transparent, transparent 31px, #e5e5e5 31px, #e5e5e5 32px)`,
                backgroundPosition: "0 24px",
              }}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                aria-label="סגור"
              >
                ✕
              </button>

              {/* Title */}
              <h2 className="text-xl font-bold text-[#2e3c52] dark:text-white mb-2 text-center text-hebrew-heading">
                {envelope.emoji} {envelope.title}
              </h2>

              {/* Divider */}
              <div
                className="w-16 h-0.5 mx-auto mb-6"
                style={{ backgroundColor: primaryColor }}
              />

              {/* Letter Content */}
              <div
                className="text-[#2e3c52] dark:text-gray-200 text-lg leading-relaxed whitespace-pre-wrap text-hebrew-body"
                style={{
                  fontFamily: "'Segoe Script', 'Brush Script MT', cursive",
                }}
              >
                {envelope.content}
              </div>

              {/* Heart signature */}
              <div className="text-center mt-8 text-3xl">💕</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
