"use client";

/**
 * ColorPicker Component
 * Restricted swatch palette — only HeartNote's 12 approved colors.
 * No arbitrary hex input.
 */

import { motion } from "framer-motion";
import { COLOR_PALETTE } from "@/constants/colors";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div>
      <div className="grid grid-cols-6 gap-2.5">
        {COLOR_PALETTE.map((color) => {
          const isSelected = value?.toUpperCase() === color.hex.toUpperCase();
          return (
            <motion.button
              key={color.hex}
              type="button"
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onChange(color.hex)}
              className={`
                w-9 h-9 rounded-full transition-all duration-200
                ${
                  isSelected
                    ? "ring-2 ring-offset-2 ring-[#2e3c52] dark:ring-white dark:ring-offset-gray-800 shadow-md"
                    : "hover:shadow-sm"
                }
              `}
              style={{ backgroundColor: color.hex }}
              aria-label={color.nameHe}
              title={color.nameHe}
            />
          );
        })}
      </div>

      {/* Show selected color name */}
      {value && (
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-hebrew-body">
          {COLOR_PALETTE.find(
            (c) => c.hex.toUpperCase() === value.toUpperCase(),
          )?.nameHe ?? value}
        </p>
      )}
    </div>
  );
}
