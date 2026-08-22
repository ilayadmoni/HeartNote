"use client";

/**
 * EditorSidebar Component
 * Form fields for editing template data
 * Compact mobile-friendly design with scrollable content
 */

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { EditorField } from "./EditorField";
import { ExpirationBanner } from "./ExpirationBanner";
import type { EditorSidebarProps } from "../types";

export function EditorSidebar({
  config,
  data,
  onChange,
}: EditorSidebarProps) {
  // Deduplicate fields by key — prevents duplicate form inputs when the
  // config_schema accidentally contains repeated keys.
  const uniqueFields = config.fields.filter(
    (field, index, arr) => arr.findIndex((f) => f.key === field.key) === index,
  );

  return (
    <div className="flex flex-col h-full">
      {/* Compact Header - Fixed */}
      <div className="flex-shrink-0 px-4 sm:px-5 pt-2 pb-3 border-b border-gray-100 dark:border-gray-700">
        <h2 className="text-base font-bold text-[#2e3c52] dark:text-white text-hebrew-heading">
          מאפיינים
        </h2>
        <p className="text-xs text-gray-400 dark:text-gray-500 text-hebrew-body mt-0.5">
          {config.description}
        </p>
      </div>

      {/* Form Fields - Scrollable */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-5">
        <ExpirationBanner slug={config.templateId} />
        {uniqueFields.map((field, index) => (
          <motion.div
            key={field.key}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.03 }}
          >
            <EditorField
              field={field}
              value={data[field.key]}
              onChange={(value) => onChange(field.key, value)}
            />
          </motion.div>
        ))}
      </div>

      {/* Footer Hint - Fixed */}
      <div className="flex-shrink-0 px-4 sm:px-5 py-3 border-t border-gray-50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50">
        <p className="text-[11px] text-gray-400 dark:text-gray-500 text-center text-hebrew-body flex items-center justify-center gap-1.5">
          <Sparkles size={12} className="text-[#d4826f]" />
          <span>התצוגה מתעדכנת בזמן אמת</span>
        </p>
      </div>
    </div>
  );
}
