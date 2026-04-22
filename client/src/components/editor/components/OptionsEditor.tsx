"use client";

/**
 * OptionsEditor Component
 * Simple string-list editor — add / remove / reorder text items.
 * Used for DecisionWheel segments, quiz answer banks, etc.
 */

import { Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
}: OptionsEditorProps) {
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
            <span className="text-xs font-bold text-gray-400 w-5 text-center flex-shrink-0">
              {index + 1}
            </span>
            <LimitedInput
              value={opt}
              onChange={(v) => updateOption(index, v)}
              maxLength={maxLength}
              placeholder={`אופציה ${index + 1}`}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d4826f]/50 text-hebrew-body"
              wrapperClassName="flex-1 min-w-0"
            />
            {canRemove && (
              <button
                onClick={() => removeOption(index)}
                className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 flex-shrink-0"
                title="הסר"
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
          className="w-full py-2 flex items-center justify-center gap-2 text-sm font-medium text-[#d4826f] bg-[#d4826f]/10 hover:bg-[#d4826f]/20 rounded-xl transition-colors text-hebrew-body"
        >
          <Plus size={16} />
          <span>הוסף אופציה ({options.length}/{MAX_OPTIONS})</span>
        </motion.button>
      )}
    </div>
  );
}
