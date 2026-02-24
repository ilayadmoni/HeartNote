"use client";

/**
 * PrivacyHeader Component
 * Header section for privacy page
 */

import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import { PRIVACY_TITLE, LAST_UPDATED } from "../constants";

export function PrivacyHeader() {
  return (
    <div className="text-center mb-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#d4826f]/10 dark:bg-[#e8917a]/10 mb-5"
      >
        <Shield size={32} className="text-[#d4826f] dark:text-[#e8917a]" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-3xl lg:text-4xl font-black text-[#2e3c52] dark:text-white mb-5 text-hebrew-heading"
      >
        {PRIVACY_TITLE}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-hebrew-body"
      >
        עודכן לאחרונה: {LAST_UPDATED}
      </motion.p>
    </div>
  );
}
