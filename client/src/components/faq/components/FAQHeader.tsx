"use client";

/**
 * FAQHeader Component
 * Header section for FAQ page with icon, title, and subtitle
 */

import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import { FAQ_TITLE, FAQ_SUBTITLE } from "../constants";

export function FAQHeader() {
  return (
    <div className="text-center mb-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#d4826f]/10 dark:bg-[#e8917a]/10 mb-5"
      >
        <HelpCircle size={32} className="text-[#d4826f] dark:text-[#e8917a]" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-3xl lg:text-4xl font-black text-[#2e3c52] dark:text-white mb-3 text-hebrew-heading"
      >
        {FAQ_TITLE}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-base text-[#2e3c52] dark:text-gray-300 text-hebrew-body max-w-md mx-auto"
      >
        {FAQ_SUBTITLE}
      </motion.p>
    </div>
  );
}
