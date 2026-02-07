"use client";

/**
 * GalleryHeader Component
 * Hero section with animated title and subtitle for the gallery page
 */

import { motion } from "framer-motion";
import type { GalleryHeaderProps } from "../types";

export function GalleryHeader({
  title,
  subtitle,
  className = "",
}: GalleryHeaderProps) {
  return (
    <div className={`text-center ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Decorative Hearts */}
        <div className="flex justify-center gap-2 mb-4">
          {["💕", "✨", "💕"].map((emoji, i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
              className="text-2xl"
            >
              {emoji}
            </motion.span>
          ))}
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#2e3c52] dark:text-white mb-4 transition-colors duration-300 text-hebrew-heading">
          {title}
        </h1>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors duration-300 text-hebrew-body"
      >
        {subtitle}
      </motion.p>
    </div>
  );
}
