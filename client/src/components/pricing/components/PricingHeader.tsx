"use client";

/**
 * PricingHeader Component
 * Header section with title and subtitle
 */

import { motion } from "framer-motion";
import { PRICING_TITLE, PRICING_SUBTITLE } from "../constants";
import type { PricingHeaderProps } from "../types";

export function PricingHeader({ className = "" }: PricingHeaderProps) {
  return (
    <div className={`text-center mb-12 lg:mb-16 ${className}`}>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl lg:text-5xl font-black text-[#2e3c52] dark:text-white mb-4 text-hebrew-heading"
      >
        {PRICING_TITLE}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-lg text-[#2e3c52] dark:text-gray-300 text-hebrew-body"
      >
        {PRICING_SUBTITLE}
      </motion.p>
    </div>
  );
}
