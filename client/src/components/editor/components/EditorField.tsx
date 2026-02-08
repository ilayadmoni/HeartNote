"use client";

/**
 * EditorField Component
 * Individual form fields for template editing
 */

import { motion } from "framer-motion";
import type { EditorField as EditorFieldType } from "../types";
import { TimelineEventsEditor } from "./TimelineEventsEditor";
import type { TimelineEvent } from "@/components/templates/types";

interface EditorFieldProps {
  field: EditorFieldType;
  value: unknown;
  onChange: (value: unknown) => void;
}

export function EditorField({ field, value, onChange }: EditorFieldProps) {
  const baseInputClass = `
    w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600
    bg-white dark:bg-gray-700 text-[#2e3c52] dark:text-white
    text-hebrew-body placeholder:text-gray-400
    focus:ring-2 focus:ring-[#d4826f] focus:border-transparent
    transition-all duration-200
  `;

  return (
    <div>
      <label className="block text-sm font-medium text-[#2e3c52] dark:text-gray-200 mb-2 text-hebrew-heading">
        {field.label}
      </label>

      {field.type === "text" && (
        <input
          type="text"
          value={(value as string) || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className={baseInputClass}
          dir="auto"
        />
      )}

      {field.type === "textarea" && (
        <textarea
          value={(value as string) || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={3}
          className={`${baseInputClass} resize-none`}
          dir="auto"
        />
      )}

      {field.type === "select" && (
        <select
          value={(value as string) || ""}
          onChange={(e) => onChange(e.target.value)}
          className={baseInputClass}
        >
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}

      {field.type === "number" && (
        <input
          type="number"
          value={(value as number) || 0}
          onChange={(e) => onChange(Number(e.target.value))}
          placeholder={field.placeholder}
          className={baseInputClass}
          min={field.min}
          max={field.max}
        />
      )}

      {field.type === "toggle" && (
        <motion.button
          type="button"
          onClick={() => onChange(!value)}
          className={`
            relative w-12 h-6 rounded-full transition-colors duration-200
            ${value ? "bg-[#d4826f]" : "bg-gray-300 dark:bg-gray-600"}
          `}
          aria-checked={!!value}
          role="switch"
        >
          <motion.div
            className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
            animate={{ x: value ? 26 : 4 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </motion.button>
      )}

      {field.type === "events" && (
        <TimelineEventsEditor
          events={(value as TimelineEvent[]) || []}
          onChange={onChange}
        />
      )}
    </div>
  );
}
