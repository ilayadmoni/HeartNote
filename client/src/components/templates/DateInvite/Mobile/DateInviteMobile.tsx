"use client";

/**
 * DateInvite Component - Mobile Version
 * Card-style design - centered white card with clean typography
 * Works in both standalone and embedded (editor) contexts
 */

import { motion } from "framer-motion";
import { RotateCcw, Heart } from "lucide-react";
import type { DateInviteMobileProps } from "../types";

export function DateInviteMobile({
  data,
  answered,
  noPosition,
  onYes,
  onReset,
  onNoHover,
}: DateInviteMobileProps) {
  return (
    <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center bg-[#fdf6f3] dark:bg-gray-900 px-5 py-6 overflow-hidden relative">
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
        className="relative z-10 w-full max-w-[320px] bg-white dark:bg-gray-800 rounded-[28px] shadow-xl shadow-black/5 dark:shadow-black/20 p-6 flex flex-col items-center text-center"
      >
        {!answered ? (
          <>
            {/* Icon Container */}
            <div className="w-14 h-14 bg-gradient-to-br from-[#ffe4e6] to-[#fff1f2] dark:from-gray-700 dark:to-gray-600 rounded-xl flex items-center justify-center mb-5 shadow-sm">
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
              ...אני מבטיח שיהיה כיף
            </p>

            {/* Buttons */}
            <div className="w-full flex flex-col items-center gap-3">
              {/* Yes Button */}
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={onYes}
                className="w-full py-3 bg-[#d4826f] hover:bg-[#c4735f] text-white text-base font-bold rounded-full shadow-lg shadow-[#d4826f]/20 text-hebrew-heading flex items-center justify-center gap-2 transition-all"
              >
                <span>{data.yesText}</span>
                <Heart size={16} fill="currentColor" className="opacity-80" />
              </motion.button>

              {/* No Button */}
              <motion.button
                animate={{
                  x: noPosition.x * 0.3,
                  y: noPosition.y * 0.2,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                onTouchStart={onNoHover}
                className="px-5 py-2 text-sm font-medium text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50 rounded-full transition-colors text-hebrew-body"
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

            <h2 className="text-xl font-bold text-[#d4826f] text-hebrew-heading mb-1.5">
              {data.successMessage}
            </h2>

            <p className="text-xs text-gray-400 mb-5 text-hebrew-body">
              💕 אני כל כך שמח/ה! 💕
            </p>

            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-gray-400 hover:text-[#d4826f] transition-all bg-gray-50 dark:bg-gray-700/50 rounded-full text-hebrew-body"
            >
              <RotateCcw size={12} />
              <span>שאל שוב</span>
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* Footer Credit */}
      <p className="absolute bottom-3 text-[10px] text-gray-300 dark:text-gray-600 text-hebrew-body">
        HeartNote Factory © 2024
      </p>

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
