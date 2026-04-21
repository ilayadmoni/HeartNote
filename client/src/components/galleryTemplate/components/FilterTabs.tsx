"use client";

/**
 * FilterTabs Component
 * Category filter tabs for the gallery - responsive with emojis
 */

import { motion } from "framer-motion";
import type { FilterTabsProps } from "../types";

export function FilterTabs({
  tabs,
  activeTab,
  onTabChange,
  className = "",
}: FilterTabsProps) {
  return (
    <div
      className={`
        flex flex-wrap justify-center gap-2
        md:gap-3
        ${className}
      `}
    >
      {tabs.map((tab, index) => (
        <motion.button
          key={tab.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => onTabChange(tab.id)}
          className={`
            relative px-4 py-2 md:px-5 md:py-2.5 rounded-full text-sm
            transition-all duration-200 text-hebrew-body font-medium
            ${
              activeTab === tab.id
                ? "bg-[#d4826f] text-white shadow-md"
                : "bg-white dark:bg-gray-700 text-[#2e3c52] dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600"
            }
          `}
        >
          {/* Active indicator */}
          {activeTab === tab.id && (
            <motion.span
              layoutId="activeTab"
              className="absolute inset-0 bg-[#d4826f] rounded-full -z-10"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}

          <span className="flex items-center gap-1.5">
            {tab.emoji && <span>{tab.emoji}</span>}
            <span>{tab.label}</span>
          </span>
        </motion.button>
      ))}
    </div>
  );
}
