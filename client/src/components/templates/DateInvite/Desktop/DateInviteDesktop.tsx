"use client";

/**
 * DateInvite Component - Desktop Version
 * Premium full-screen romantic experience for desktop
 * Uses dynamic viewport units for robustness
 */

import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import type { DateInviteDesktopProps } from "../types";

export function DateInviteDesktop({
  data,
  answered,
  noPosition,
  onYes,
  onReset,
  onNoHover,
}: DateInviteDesktopProps) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-[#fdf6f3] via-[#faf7f5] to-[#f8ece8] dark:from-gray-900 dark:via-[#1a1f2e] dark:to-[#252d3b] relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-[#d4826f]/15 dark:bg-[#d4826f]/8 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[35vw] h-[35vw] bg-[#e8917a]/15 dark:bg-[#e8917a]/8 rounded-full blur-[100px]" />
      </div>

      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <span className="absolute top-[10%] left-[15%] text-3xl opacity-40 animate-pulse">
          💕
        </span>
        <span className="absolute top-[20%] right-[10%] text-2xl opacity-30">
          💗
        </span>
        <span className="absolute bottom-[25%] left-[8%] text-3xl opacity-35">
          💖
        </span>
        <span className="absolute bottom-[15%] right-[15%] text-2xl opacity-40 animate-pulse">
          💝
        </span>
        <span className="absolute top-[15%] left-[25%] text-xl opacity-50">
          ✨
        </span>
        <span className="absolute top-[25%] right-[20%] text-2xl opacity-60">
          ✨
        </span>
        <span className="absolute bottom-[30%] left-[20%] text-xl opacity-40">
          ✨
        </span>
        <span className="absolute bottom-[20%] right-[25%] text-2xl opacity-50">
          ✨
        </span>
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center px-8 max-w-4xl"
      >
        {!answered ? (
          <>
            {/* Heart icon */}
            <motion.div
              className="mb-12"
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <span className="text-9xl drop-shadow-2xl">💝</span>
            </motion.div>

            {/* Question */}
            <h1 className="text-6xl lg:text-7xl font-bold text-[#2e3c52] dark:text-white mb-16 text-hebrew-heading leading-tight drop-shadow-sm">
              {data.question}
            </h1>

            {/* Buttons */}
            <div className="flex justify-center gap-10">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onYes}
                className="px-16 py-6 bg-gradient-to-r from-[#d4826f] to-[#e8917a] hover:from-[#c4735f] hover:to-[#d4826f] text-white text-3xl font-bold rounded-full shadow-2xl shadow-[#d4826f]/30 transition-all duration-300 text-hebrew-heading group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10">{data.yesText}</span>
              </motion.button>

              <motion.button
                animate={{ x: noPosition.x, y: noPosition.y }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                onHoverStart={onNoHover}
                className="px-16 py-6 bg-white/90 dark:bg-gray-700/90 text-gray-500 dark:text-gray-400 text-3xl font-bold rounded-full shadow-xl transition-colors text-hebrew-heading hover:bg-gray-100 dark:hover:bg-gray-600 border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
              >
                {data.noText}
              </motion.button>
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="mb-10"
            >
              <span className="text-[11rem] drop-shadow-2xl">💖</span>
            </motion.div>

            <h2 className="text-7xl lg:text-8xl font-black bg-gradient-to-r from-[#d4826f] via-[#e8917a] to-[#d4826f] bg-clip-text text-transparent text-hebrew-heading mb-8 drop-shadow-sm">
              {data.successMessage}
            </h2>

            <p className="text-3xl text-gray-500 dark:text-gray-300 text-hebrew-body mb-12 font-medium">
              💕 אני כל כך שמח/ה! 💕
            </p>

            <button
              onClick={onReset}
              className="flex items-center gap-3 px-8 py-4 text-xl text-gray-400 hover:text-[#d4826f] dark:hover:text-[#e8917a] transition-all text-hebrew-body border-2 border-gray-100 dark:border-gray-800 rounded-full hover:border-[#d4826f] dark:hover:border-[#e8917a] bg-white/50 dark:bg-black/20 backdrop-blur-sm"
            >
              <RotateCcw size={24} />
              <span>שאל שוב</span>
            </button>
          </motion.div>
        )}
      </motion.div>

      {data.backgroundImage && (
        <div
          className="absolute inset-0 opacity-[0.05] bg-cover bg-center pointer-events-none mix-blend-overlay"
          style={{ backgroundImage: `url(${data.backgroundImage})` }}
        />
      )}
    </div>
  );
}
