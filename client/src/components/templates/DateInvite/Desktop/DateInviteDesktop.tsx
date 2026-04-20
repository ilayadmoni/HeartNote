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
import {
  FooterBranding,
  BackToGallery,
  TemplateResetButton,
} from "@/components/templates/components";
import { FloatingIcons } from "../../OpenWhen/components";

export function DateInviteDesktop({
  data,
  answered,
  noPosition,
  onYes,
  onReset,
  onNoHover,
}: DateInviteDesktopProps) {
  const primaryColor = data.primaryColor || DEFAULT_PRIMARY_COLOR;
  const displayTitle = data.title?.trim() || "הזמנה לדייט";

  // Calculate a slightly darker hover color
  const hoverColor = adjustBrightness(primaryColor, -15);

  return (
    <div className="flex flex-col min-h-[390px] 2xl:min-h-[650px] bg-transparent relative isolate overflow-hidden">
     <FloatingIcons/>
      <BackToGallery className="absolute top-4 right-4" />
      {/* Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm 2xl:max-w-2xl mx-auto px-5 py-6 relative z-10">
        <h1
          className="mb-3 2xl:mb-5 text-2xl 2xl:text-4xl font-bold text-hebrew-heading text-center break-words w-full max-w-sm 2xl:max-w-2xl"
          style={{ color: primaryColor }}
        >
          {displayTitle}
        </h1>

        {/* Main Card - Compact */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative z-10 w-full max-w-sm 2xl:max-w-2xl bg-white dark:bg-gray-800 rounded-[24px] shadow-xl shadow-black/8 dark:shadow-black/25 p-6 2xl:p-12 flex flex-col items-center text-center overflow-hidden"
        >
          {!answered ? (
            <>
              {/* Icon Container - Smaller */}
              <div
                className="w-14 h-14 2xl:w-24 2xl:h-24 rounded-xl flex items-center justify-center mb-5 2xl:mb-7 shadow-md"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}20, ${primaryColor}10)`,
                  boxShadow: `0 4px 12px ${primaryColor}15`,
                }}
              >
                <motion.span
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-2xl 2xl:text-4xl"
                >
                  💌
                </motion.span>
              </div>

              {/* Question - Smaller */}
              <h1 className="text-xl 2xl:text-4xl font-bold text-[#2e3c52] dark:text-white mb-1.5 2xl:mb-2.5 text-hebrew-heading leading-tight break-words w-full overflow-hidden">
                {data.question}
              </h1>

              {/* Subtitle */}
              <p className="text-xs 2xl:text-base text-gray-800 mb-6 2xl:mb-10 text-hebrew-body">
                כדאי לך לבחור את התשובה הנכונה...
              </p>

              {/* Buttons - Compact */}
              <div className="w-full flex flex-row items-center gap-3 relative">
                {/* Yes Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onYes}
                  className="relative z-10 flex-1 h-12 2xl:h-16 text-white text-sm 2xl:text-lg font-bold rounded-full shadow-lg text-hebrew-heading flex items-center justify-center gap-2 transition-all"
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
                  <span className="truncate">{data.yesText}</span>
                  <Heart size={16} fill="currentColor" className="opacity-80 shrink-0" />
                </motion.button>

                {/* No Button - Enhanced evasion */}
                <motion.button
                  animate={{
                    x: noPosition.x,
                    y: noPosition.y,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 800,
                    damping: 15,
                    mass: 0.4,
                  }}
                  onHoverStart={onNoHover}
                  className="relative z-0 flex-1 h-12 2xl:h-16 text-sm 2xl:text-lg font-bold text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50 rounded-full transition-all text-hebrew-heading hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center justify-center overflow-hidden"
                >
                  <span className="truncate px-2">{data.noText}</span>
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
                className="text-xl 2xl:text-4xl font-bold text-hebrew-heading mb-1.5 2xl:mb-2.5 break-words w-full overflow-hidden"
                style={{ color: primaryColor }}
              >
                {data.successMessage}
              </h2>

              <p className="text-xs text-gray-400 mb-5 text-hebrew-body">
                      ידעתי שהתשובה שלך תהיה כן 😉
              </p>

              <TemplateResetButton onClick={onReset} label="שאל שוב" />
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Footer Credit */}
      <FooterBranding className="shrink-0 pb-4 relative z-10" />

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
