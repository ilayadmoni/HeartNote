"use client";

/**
 * ColorPicker Component
 * Restricted swatch palette — only HeartNote's 13 approved colors.
 * No arbitrary hex input.
 */

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { COLOR_PALETTE } from "@/constants/colors";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

export function ColorPicker({ value, onChange }: ColorPickerProps): JSX.Element {
  const t = useTranslations("editor");
  const selected = COLOR_PALETTE.find((c) => c.hex.toUpperCase() === value?.toUpperCase());

  return (
    <div>
      <div className="grid grid-cols-6 gap-2.5">
        {COLOR_PALETTE.map((color) => {
          const isSelected = value?.toUpperCase() === color.hex.toUpperCase();
          const colorName = t(`colors.${color.nameKey}`);
          return (
            <motion.button
              key={color.hex}
              type="button"
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onChange(color.hex)}
              className={`
                w-9 h-9 rounded-full transition-colors duration-base ease-out-quint
                ${
                  isSelected
                    ? "ring-2 ring-offset-2 ring-ink dark:ring-white dark:ring-offset-surface-sunken shadow-card"
                    : "hover:shadow-soft"
                }
              `}
              style={{ backgroundColor: color.hex }}
              aria-label={colorName}
              title={colorName}
            />
          );
        })}
      </div>

      {value && (
        <p className="mt-2 text-caption text-ink-muted">
          {selected ? t(`colors.${selected.nameKey}`) : t("colors.selected")}
        </p>
      )}
    </div>
  );
}
