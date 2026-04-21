"use client";

/**
 * DateInvite Component - Mobile Version
 * Card-style design - centered white card with clean typography
 * Works in both standalone and embedded (editor) contexts
 */

import { motion } from "framer-motion";
import { RotateCcw, Heart } from "lucide-react";
import { usePathname } from "next/navigation";
import type { DateInviteMobileProps } from "../types";
import { DEFAULT_PRIMARY_COLOR } from "@/components/templates/types";
import {
  FooterBranding,
  TemplateResetButton,
} from "@/components/templates/components";
import { FloatingIcons } from "../../OpenWhen/components";

export function DateInviteMobile({
  data,
  answered,
  noPosition,
  onYes,
  onReset,
  onNoHover,
}: DateInviteMobileProps) {
  const pathname = usePathname();
  const isCreateRoute = pathname?.includes('/create/');
  const primaryColor = data.primaryColor || DEFAULT_PRIMARY_COLOR;
  const displayTitle = data.title?.trim() || "הזמנה לדייט";

  return (
    <div className={`w-full h-full flex flex-col justify-between gap-6 bg-transparent px-5 py-1 overflow-hidden relative isolate ${
      isCreateRoute ? 'min-h-[450px]' : 'min-h-[650px]'
    }`}>
      {/* Background Hearts Pattern */}
      <FloatingIcons />

      {/* Main Content - Top */}
      <div className="flex-1 flex flex-col items-center justify-center w-full relative z-10">
        <h1
          className="mb-3 text-2xl font-bold text-hebrew-heading text-center break-words w-full max-w-[320px]"
          style={{ color: primaryColor }}
        >
          {displayTitle}
        </h1>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-[320px] bg-white dark:bg-gray-800 rounded-[28px] shadow-xl shadow-black/5 dark:shadow-black/20 p-6 flex flex-col items-center text-center overflow-hidden"
        >
          {!answered ? (
            <>
              {/* Icon Container */}
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 shadow-sm"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}20, ${primaryColor}10)`,
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

              {/* Question */}
              <h1 className="text-xl font-bold text-[#2e3c52] dark:text-white mb-1.5 text-hebrew-heading leading-tight break-words w-full overflow-hidden">
                {data.question}
              </h1>

              {/* Subtitle */}
              <p className="text-xs text-gray-800 mb-6 text-hebrew-body">
               כדאי לך לבחור את התשובה הנכונה...
              </p>

              {/* Buttons */}
              <div className="w-full flex flex-row items-center gap-3 relative">
                {/* Yes Button */}
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={onYes}
                  className="relative z-10 flex-1 h-12 text-white text-sm font-bold rounded-full shadow-lg text-hebrew-heading flex items-center justify-center gap-2 transition-all"
                  style={{
                    backgroundColor: primaryColor,
                    boxShadow: `0 10px 25px ${primaryColor}30`,
                  }}
                >
                  <span className="truncate">{data.yesText}</span>
                  <Heart
                    size={16}
                    fill="currentColor"
                    className="opacity-80 shrink-0"
                  />
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
                  onTouchStart={onNoHover}
                  className="relative z-0 flex-1 h-12 text-sm font-bold text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50 rounded-full transition-colors text-hebrew-heading flex items-center justify-center overflow-hidden"
                >
                  <span className="truncate px-2">{data.noText}</span>
                </motion.button>
              </div>
            </>
          ) : (
            /* Success State */
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
                className="text-xl font-bold text-hebrew-heading mb-1.5 break-words w-full overflow-hidden"
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

      {/* Footer Credit - Bottom */}
      <FooterBranding className="mx-auto" />

      {/* Background Image Overlay */}
      {data.backgroundImage && (
        <div
          className="absolute inset-0 opacity-[0.05] bg-cover bg-center pointer-events-none"
          style={{ backgroundImage: `url(${data.backgroundImage})` }}
        />
      )}
    </div>
  );
}
