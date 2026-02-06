"use client";

/**
 * AccessibilityHeader Component
 * Header section for accessibility statement page
 */

import { motion } from "framer-motion";
import { Accessibility as AccessibilityIcon } from "lucide-react";
import { ACCESSIBILITY_TITLE, ACCESSIBILITY_SUBTITLE } from "../constants";

export function AccessibilityHeader() {
  return (
    <div className="text-center mb-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#d4826f]/10 dark:bg-[#e8917a]/10 mb-6"
      >
        <AccessibilityIcon
          size={40}
          className="text-[#d4826f] dark:text-[#e8917a]"
        />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-4xl lg:text-5xl font-black text-[#2e3c52] dark:text-white mb-4 text-hebrew-heading"
      >
        {ACCESSIBILITY_TITLE}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-lg text-[#2e3c52] dark:text-gray-300 text-hebrew-body max-w-2xl mx-auto"
      >
        {ACCESSIBILITY_SUBTITLE}
      </motion.p>
    </div>
  );
}
