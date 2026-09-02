"use client";

/**
 * OptionsEditor Component
 * Simple string-list editor — add / remove / reorder text items.
 * Used for DecisionWheel segments, quiz answer banks, etc.
 */

import { Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { LimitedInput, CHAR_LIMITS } from "./LimitedInput";

const MAX_OPTIONS = 8;
const MIN_OPTIONS = 2;

interface OptionsEditorProps {
  options: string[];
  onChange: (options: string[]) => void;
  maxLength?: number;
}

export function OptionsEditor({
  options = [],
  onChange,
  maxLength = CHAR_LIMITS.OPTION,
}: OptionsEditorProps): JSX.Element {
  const t = useTranslations("editor");
  const canAdd = options.length < MAX_OPTIONS;
  const canRemove = options.length > MIN_OPTIONS;

  const addOption = () => {
    if (!canAdd) return;
    onChange([...options, ""]);
  };

  const removeOption = (index: number) => {
    if (!canRemove) return;
    onChange(options.filter((_, i) => i !== index));
  };

  const updateOption = (index: number, value: string) => {
    const updated = [...options];
    updated[index] = value;
    onChange(updated);
  };

  return (
    <div className="space-y-2">
      <AnimatePresence mode="popLayout">
        {options.map((opt, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-2"
          >
            <span className="text-caption font-bold text-ink-subtle w-5 text-center flex-shrink-0">
              {index + 1}
            </span>
            <LimitedInput
              value={opt}
              onChange={(v) => updateOption(index, v)}
              maxLength={maxLength}
              placeholder={t("field.optionPlaceholder", { index: index + 1 })}
              className="w-full px-3 py-2 text-body-sm rounded-control border border-line-strong bg-surface-raised text-ink placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-accent/25"
              wrapperClassName="flex-1 min-w-0"
            />
            {canRemove && (
              <button
                onClick={() => removeOption(index)}
                className="p-1.5 text-ink-subtle hover:text-red-500 transition-colors rounded-control hover:bg-red-50 dark:hover:bg-red-900/20 flex-shrink-0"
                title={t("field.removeOption")}
              >
                <Trash2 size={14} />
              </button>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {canAdd && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={addOption}
          className="w-full py-2 flex items-center justify-center gap-2 text-body-sm font-bold text-accent bg-accent-soft hover:bg-accent-soft/70 rounded-control transition-colors"
        >
          <Plus size={16} />
          <span>{t("field.addOption", { count: options.length, max: MAX_OPTIONS })}</span>
        </motion.button>
      )}
    </div>
  );
}
