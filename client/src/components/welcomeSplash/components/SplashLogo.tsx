"use client";

/**
 * SplashLogo Component
 * Large animated HeartNote logo for the welcome splash screen.
 * Heart with spinning gear + brand text, animated with Framer Motion.
 */

import { motion } from "framer-motion";
import { LOGO_ENTRANCE_DELAY } from "../constants";
import type { SplashLogoProps } from "../types";

const logoVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delay: LOGO_ENTRANCE_DELAY,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.3 } },
};

export function SplashLogo({ className = "" }: SplashLogoProps) {
  return (
    <motion.div
      className={`flex items-center gap-3 md:gap-4 ${className}`}
      variants={logoVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      aria-hidden="true"
    >
      {/* Heart with Gear Icon — scaled up for splash */}
      <div className="relative w-16 h-16 md:w-20 md:h-20">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-full h-full"
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id="splashHeartGradient"
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
        </svg>

        {/* Animated Gear */}
        <div className="absolute -bottom-[2%] -left-[2%] w-[55%] h-[55%] flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-[90%] h-[90%] animate-spin-slow text-navy-600 dark:text-[#f2e9e4] transition-colors duration-300"
            aria-hidden="true"
          >
            <path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
          </svg>
        </div>
      </div>

      {/* Brand Text */}
      <span
        className="text-4xl md:text-5xl font-bold text-navy-700 dark:text-white transition-colors duration-300"
        style={{ fontFamily: "var(--font-glacial-indifference, sans-serif)" }}
      >
        HeartNote
      </span>
    </motion.div>
  );
}
