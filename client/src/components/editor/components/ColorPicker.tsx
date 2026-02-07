"use client";

/**
 * ColorPicker Component
 * Preset color selection for templates
 */

import { motion } from "framer-motion";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

const COLORS = [
  { name: "קורל", value: "#d4826f" },
  { name: "כחול", value: "#2e3c52" },
  { name: "סגול", value: "#8b5cf6" },
  { name: "ורוד", value: "#ec4899" },
  { name: "ירוק", value: "#10b981" },
];

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#2e3c52] dark:text-gray-200 mb-3 text-hebrew-heading">
        צבע ראשי
      </label>
      <div className="flex gap-3">
        {COLORS.map((color) => (
          <motion.button
            key={color.value}
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(color.value)}
            className={`
              w-10 h-10 rounded-full transition-all duration-200
              ${value === color.value ? "ring-2 ring-offset-2 ring-[#2e3c52] dark:ring-white" : ""}
            `}
            style={{ backgroundColor: color.value }}
            aria-label={color.name}
            title={color.name}
          />
        ))}
      </div>
    </div>
  );
}
