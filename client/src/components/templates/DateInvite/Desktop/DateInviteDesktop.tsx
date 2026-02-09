"use client";

/**
 * DateInvite Component - Desktop Version
 * Compact card-style design matching Mobile
 * Enhanced "No" button movement with smooth UX
 */

import { motion } from "framer-motion";
import { RotateCcw, Heart } from "lucide-react";
import type { DateInviteDesktopProps } from "../types";
import { DEFAULT_PRIMARY_COLOR } from "@/components/templates/types";
import { FooterBranding, BackToGallery } from "@/components/templates/components";

export function DateInviteDesktop({
  data,
  answered,
  noPosition,
  onYes,
  onReset,
  onNoHover,
}: DateInviteDesktopProps) {
  const primaryColor = data.primaryColor || DEFAULT_PRIMARY_COLOR;

  // Calculate a slightly darker hover color
  const hoverColor = adjustBrightness(primaryColor, -15);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-[#fdf6f3] dark:bg-gray-900 p-4 overflow-hidden relative">
      {/* Back to Gallery */}
      <BackToGallery className="absolute top-4 right-4 z-20" />

      {/* Background Hearts Pattern */}
      <div className="absolute inset-0 opacity-25 pointer-events-none overflow-hidden">
        <span className="absolute top-[8%] left-[12%] text-xl opacity-40">
          ❤
        </span>
        <span className="absolute top-[15%] right-[15%] text-lg opacity-30">
          ❤
        </span>
        <span className="absolute bottom-[22%] left-[10%] text-xl opacity-35">
          ❤
        </span>
        <span className="absolute bottom-[12%] right-[12%] text-lg opacity-25">
          ❤
        </span>
        <span className="absolute top-[45%] left-[6%] text-sm opacity-20">
          ❤
        </span>
        <span className="absolute bottom-[40%] right-[6%] text-sm opacity-25">
          ❤
        </span>
      </div>

      {/* Main Card - Compact */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative z-10 w-full max-w-sm bg-white dark:bg-gray-800 rounded-[24px] shadow-xl shadow-black/8 dark:shadow-black/25 p-6 flex flex-col items-center text-center"
      >
        {!answered ? (
          <>
            {/* Icon Container - Smaller */}
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 shadow-md"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}20, ${primaryColor}10)`,
                boxShadow: `0 4px 12px ${primaryColor}15`,
              }}
            >
              <motion.span
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-2xl"
              >
                💌
              </motion.span>
            </div>

            {/* Question - Smaller */}
            <h1 className="text-xl font-bold text-[#2e3c52] dark:text-white mb-1.5 text-hebrew-heading leading-tight">
              {data.question}
            </h1>

            {/* Subtitle */}
            <p className="text-xs text-gray-400 mb-6 text-hebrew-body">
              ...כדאי לך לבחור את התשובה הנכונה
            </p>

            {/* Buttons - Compact */}
            <div className="w-full flex flex-row items-center gap-3">
              {/* Yes Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onYes}
                className="flex-1 py-3 text-white text-base font-bold rounded-full shadow-lg text-hebrew-heading flex items-center justify-center gap-2 transition-all"
                style={{
                  backgroundColor: primaryColor,
                  boxShadow: `0 10px 25px ${primaryColor}30`,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = hoverColor)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = primaryColor)
                }
              >
                <span>{data.yesText}</span>
                <Heart size={16} fill="currentColor" className="opacity-80" />
              </motion.button>

              {/* No Button - Enhanced evasion */}
              <motion.button
                animate={{
                  x: noPosition.x,
                  y: noPosition.y,
                }}
                transition={{
                  type: "spring",
                  stiffness: 600,
                  damping: 20,
                  mass: 0.5,
                }}
                onHoverStart={onNoHover}
                className="flex-1 px-5 py-3 text-sm font-medium text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50 rounded-full transition-all text-hebrew-body hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              >
                {data.noText}
              </motion.button>
            </div>
          </>
        ) : (
          /* Success State - Compact */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center w-full py-2"
          >
            <motion.div
              animate={{ rotate: [0, -8, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              className="mb-4"
            >
              <span className="text-5xl">💖</span>
            </motion.div>

            <h2
              className="text-xl font-bold text-hebrew-heading mb-1.5"
              style={{ color: primaryColor }}
            >
              {data.successMessage}
            </h2>

            <p className="text-xs text-gray-400 mb-5 text-hebrew-body">
              💕 מחכה לראות אותך 💕
            </p>

            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-gray-400 transition-all bg-gray-50 dark:bg-gray-700/50 rounded-full text-hebrew-body"
              style={{ "--hover-color": primaryColor } as React.CSSProperties}
              onMouseEnter={(e) => (e.currentTarget.style.color = primaryColor)}
              onMouseLeave={(e) => (e.currentTarget.style.color = "")}
            >
              <RotateCcw size={12} />
              <span>שאל שוב</span>
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* Footer Credit */}
      <FooterBranding className="absolute bottom-2" />

      {/* Background Image Overlay */}
      {data.backgroundImage && (
        <div
          className="absolute inset-0 opacity-[0.04] bg-cover bg-center pointer-events-none"
          style={{ backgroundImage: `url(${data.backgroundImage})` }}
        />
      )}
    </div>
  );
}

/** Adjust hex color brightness by percentage (-100 to 100) */
function adjustBrightness(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(
    255,
    Math.max(0, (num >> 16) + ((num >> 16) * percent) / 100),
  );
  const g = Math.min(
    255,
    Math.max(
      0,
      ((num >> 8) & 0x00ff) + (((num >> 8) & 0x00ff) * percent) / 100,
    ),
  );
  const b = Math.min(
    255,
    Math.max(0, (num & 0x0000ff) + ((num & 0x0000ff) * percent) / 100),
  );
  return `#${(0x1000000 + (Math.round(r) << 16) + (Math.round(g) << 8) + Math.round(b)).toString(16).slice(1)}`;
}
