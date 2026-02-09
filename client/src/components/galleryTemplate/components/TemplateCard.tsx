"use client";

/**
 * TemplateCard Component
 * Individual template card with animated preview, title, description, and badge
 */

import Link from "next/link";
import { motion } from "framer-motion";
import { TemplatePreview } from "./TemplatePreview";
import type { TemplateCardProps } from "../types";

export function TemplateCard({
  template,
  className = "",
  onClick,
}: TemplateCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className={`
        group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden
        shadow-sm hover:shadow-xl transition-all duration-300
        border border-gray-100 dark:border-gray-700
        ${className}
      `}
    >
      {/* Preview Container */}
      <div className="relative aspect-[7/3] bg-gradient-to-br from-[#faf7f5] to-[#f5f0eb] dark:from-gray-700 dark:to-gray-800 overflow-hidden">
        {/* Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
          {/* Premium/Free Badge */}
          {template.isPremium ? (
            <span className="px-2.5 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full shadow-md text-hebrew-body flex items-center gap-1">
              ⭐ פרימיום
            </span>
          ) : template.isFree ? (
            <span className="px-2.5 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-md text-hebrew-body">
              חינם
            </span>
          ) : (
            <span />
          )}

          {/* Category Badge */}
          {template.badge && template.badge.type === "heart" && (
            <span
              className="w-8 h-8 rounded-full flex items-center justify-center shadow-md"
              style={{ backgroundColor: template.badge.color }}
            >
              💕
            </span>
          )}
        </div>

        {/* Animated Preview */}
        <div className="w-full h-full flex items-center justify-center">
          <TemplatePreview componentKey={template.componentKey} />
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-[#2e3c52]/0 group-hover:bg-[#2e3c52]/10 transition-colors duration-300" />
      </div>

      {/* Content */}
      <div className="p-4 md:p-5">
        <h3 className="text-lg md:text-xl font-bold text-[#2e3c52] dark:text-white mb-2 text-hebrew-heading group-hover:text-[#d4826f] transition-colors duration-300">
          {template.title}
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 text-hebrew-body leading-relaxed">
          {template.description}
        </p>

        {/* CTA Button */}
        <div className="w-full">
          {onClick ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onClick(template)}
              className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all duration-200 text-hebrew-heading ${
                template.isPremium
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
                  : "bg-[#d4826f] text-white hover:bg-[#c4735f]"
              }`}
            >
              ← {template.isPremium ? "שדרג ליצירה" : "התחל ליצור"}
            </motion.button>
          ) : (
            <Link href={template.link} className="block w-full">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all duration-200 text-hebrew-heading ${
                  template.isPremium
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
                    : "bg-[#d4826f] text-white hover:bg-[#c4735f]"
                }`}
              >
                ← {template.isPremium ? "שדרג ליצירה" : "התחל ליצור"}
              </motion.button>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}
