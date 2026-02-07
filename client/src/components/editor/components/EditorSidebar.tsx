"use client";

/**
 * EditorSidebar Component
 * Form fields for editing template data
 */

import { motion } from "framer-motion";
import { EditorField } from "./EditorField";
import { ColorPicker } from "./ColorPicker";
import type { EditorSidebarProps } from "../types";

export function EditorSidebar({ config, data, onChange }: EditorSidebarProps) {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-gray-100 dark:border-gray-700">
        <h2 className="text-lg font-bold text-[#2e3c52] dark:text-white text-hebrew-heading">
          מאפיינים
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-hebrew-body mt-1">
          {config.description}
        </p>
      </div>

      {/* Form Fields */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {config.fields.map((field, index) => (
          <motion.div
            key={field.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <EditorField
              field={field}
              value={data[field.key]}
              onChange={(value) => onChange(field.key, value)}
            />
          </motion.div>
        ))}

        {/* Color Picker */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: config.fields.length * 0.05 }}
        >
          <ColorPicker
            value={(data.primaryColor as string) || "#d4826f"}
            onChange={(color) => onChange("primaryColor", color)}
          />
        </motion.div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 p-3 border-t border-gray-100 dark:border-gray-700">
        <p className="text-xs text-gray-400 dark:text-gray-500 text-center text-hebrew-body">
          ✨ התצוגה מתעדכנת בזמן אמת
        </p>
      </div>
    </div>
  );
}
