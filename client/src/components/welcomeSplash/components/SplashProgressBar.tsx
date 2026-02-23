"use client";

/**
 * SplashProgressBar Component
 * Sleek animated progress bar that fills 0→100% with a subtle glow.
 * Fires `onComplete` when the fill animation finishes.
 */

import { motion } from "framer-motion";
import { PROGRESS_BAR_DELAY, PROGRESS_FILL_DURATION } from "../constants";
import type { SplashProgressBarProps } from "../types";

const trackVariants = {
  hidden: { opacity: 0, scaleX: 0.5 },
  visible: {
    opacity: 1,
    scaleX: 1,
    transition: {
      delay: PROGRESS_BAR_DELAY,
      duration: 0.35,
      ease: "easeOut",
    },
  },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const fillVariants = {
  hidden: { width: "0%" },
  visible: {
    width: "100%",
    transition: {
      delay: PROGRESS_BAR_DELAY,
      duration: PROGRESS_FILL_DURATION,
      ease: "easeInOut",
    },
  },
};

export function SplashProgressBar({ onComplete }: SplashProgressBarProps) {
  return (
    <motion.div
      className="w-48 md:w-64 h-1 rounded-full overflow-hidden
        bg-[#ebe7e0]/60 dark:bg-[#2e3c52]/80"
      variants={trackVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      aria-hidden="true"
    >
      <motion.div
        className="h-full rounded-full bg-[#d4826f] dark:bg-[#e8917a]
          shadow-[0_0_8px_rgba(212,130,111,0.5)] dark:shadow-[0_0_8px_rgba(232,145,122,0.4)]"
        variants={fillVariants}
        initial="hidden"
        animate="visible"
        onAnimationComplete={onComplete}
      />
    </motion.div>
  );
}
