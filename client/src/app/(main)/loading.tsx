"use client";

/**
 * Loading Component
 * Beautiful branded loading state for page navigation
 * Features HeartNote logo with animated gear and pulse effect
 */

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#faf7f5] dark:bg-gray-900 transition-colors duration-300">
      {/* Animated Background Glow */}
      <motion.div
        className="absolute w-64 h-64 rounded-full bg-gradient-to-br from-[#d4826f]/20 to-[#e8917a]/10 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Logo Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 flex flex-col items-center gap-6"
      >
        {/* Heart + Gear Icon */}
        <div className="relative w-20 h-20">
          {/* Heart SVG */}
          <motion.svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-full h-full"
            aria-hidden="true"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <defs>
              <linearGradient
                id="loadingHeartGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#d4826f" />
                <stop offset="100%" stopColor="#c4735f" />
              </linearGradient>
            </defs>
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              className="fill-[#f2e9e4] stroke-[#cb8e7c] stroke-[2.5] dark:fill-[#cb8e7c] dark:stroke-[#f2e9e4] dark:stroke-[2.5]"
            />
          </motion.svg>

          {/* Spinning Gear */}
          <motion.div
            className="absolute -bottom-[2%] -left-[2%] w-[55%] h-[55%] flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-[90%] h-[90%] text-[#2e3c52] dark:text-[#f2e9e4] transition-colors duration-300"
              aria-hidden="true"
            >
              <path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
            </svg>
          </motion.div>
        </div>

        {/* Logo Text */}
        <motion.span
          className="text-2xl font-bold text-[#2e3c52] dark:text-white transition-colors duration-300"
          style={{ fontFamily: "var(--font-glacial-indifference, sans-serif)" }}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          HeartNote
        </motion.span>

        {/* Loading Dots */}
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-[#d4826f]"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Screen Reader Text */}
      <span className="sr-only">טוען...</span>
    </div>
  );
}
