"use client";

/**
 * DateInvite Component - Mobile Version
 * Card-style design - centered white card with clean typography
 * Works in both standalone and embedded (editor) contexts
 */

import { motion } from "framer-motion";
import { RotateCcw, Heart } from "lucide-react";
import type { DateInviteMobileProps } from "../types";
import { DEFAULT_PRIMARY_COLOR } from "@/components/templates/types";
import {
  FooterBranding,
  BackToGallery,
} from "@/components/templates/components";

export function DateInviteMobile({
  data,
  answered,
  noPosition,
  onYes,
  onReset,
  onNoHover,
}: DateInviteMobileProps) {
  const primaryColor = data.primaryColor || DEFAULT_PRIMARY_COLOR;

  return (
    <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center bg-[#fdf6f3] dark:bg-gray-900 px-5 py-6 overflow-hidden relative">
      {/* Back to Gallery */}
      <BackToGallery className="absolute top-3 right-3 z-20" />

      {/* Background Hearts Pattern */}
      <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
        <span className="absolute top-[8%] left-[10%] text-xl opacity-40">
          ❤
        </span>
        <span className="absolute top-[15%] right-[12%] text-lg opacity-30">
          ❤
        </span>
        <span className="absolute bottom-[20%] left-[8%] text-xl opacity-35">
          ❤
        </span>
        <span className="absolute bottom-[12%] right-[10%] text-lg opacity-25">
          ❤
        </span>
        <span className="absolute top-[50%] left-[5%] text-sm opacity-20">
          ❤
        </span>
        <span className="absolute bottom-[40%] right-[5%] text-sm opacity-25">
          ❤
        </span>
      </div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[320px] bg-white dark:bg-gray-800 rounded-[28px] shadow-xl shadow-black/5 dark:shadow-black/20 p-6 flex flex-col items-center text-center overflow-hidden"
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
            <h1 className="text-xl font-bold text-[#2e3c52] dark:text-white mb-1.5 text-hebrew-heading leading-tight">
              {data.question}
            </h1>

            {/* Subtitle */}
            <p className="text-xs text-gray-400 mb-6 text-hebrew-body">
              ...כדאי לך לבחור את התשובה הנכונה
            </p>

            {/* Buttons */}
            <div className="w-full flex flex-row items-center gap-3">
              {/* Yes Button */}
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={onYes}
                className="flex-1 h-12 text-white text-sm font-bold rounded-full shadow-lg text-hebrew-heading flex items-center justify-center gap-2 transition-all"
                style={{
                  backgroundColor: primaryColor,
                  boxShadow: `0 10px 25px ${primaryColor}30`,
                }}
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
                transition={{ type: "spring", stiffness: 500, damping: 22 }}
                onTouchStart={onNoHover}
                className="flex-1 h-12 text-sm font-bold text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50 rounded-full transition-colors text-hebrew-heading flex items-center justify-center"
              >
                {data.noText}
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
            >
              <RotateCcw size={12} />
              <span>שאל שוב</span>
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* Footer Credit */}
      <FooterBranding className="absolute bottom-3" />

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
