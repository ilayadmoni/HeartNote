"use client";

/**
 * LimitedInput Component
 * Reusable text input / textarea with strict character limit,
 * live counter, and visual warning when the limit is reached.
 */

import { useCallback } from "react";
import { useTranslations } from "next-intl";

/** Standard character limits for HeartNote greeting card fields */
export const CHAR_LIMITS = {
  TITLE: 50,
  ENVELOPE_TITLE: 20,
  BODY: 120,
  QUESTION: 50,
  ANSWER: 35,
  OPTION: 25,
  HIDDEN_MESSAGE: 18,
} as const;

interface LimitedInputProps {
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  /** Classes applied to the input / textarea element */
  className?: string;
  /** Classes for the outer wrapper (default: "w-full") */
  wrapperClassName?: string;
  dir?: string;
}

export function LimitedInput({
  value = "",
  onChange,
  maxLength,
  placeholder,
  multiline = false,
  rows = 3,
  className = "",
  wrapperClassName = "w-full",
  dir = "auto",
}: LimitedInputProps): JSX.Element {
  const t = useTranslations("editor");
  const count = value.length;
  const isAtLimit = count >= maxLength;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const next = e.target.value;
      if (next.length <= maxLength) onChange(next);
    },
    [maxLength, onChange],
  );

  return (
    <div className={wrapperClassName}>
      {multiline ? (
        <textarea
          value={value}
          onChange={handleChange}
          maxLength={maxLength}
          placeholder={placeholder}
          rows={rows}
          className={className}
          dir={dir}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={handleChange}
          maxLength={maxLength}
          placeholder={placeholder}
          className={className}
          dir={dir}
        />
      )}

      {/* Counter + limit warning */}
      <div className="flex items-center justify-between mt-1 px-0.5">
        {isAtLimit ? (
          <p className="text-[11px] text-red-500 dark:text-red-400 animate-fade-in">
            {t("field.charLimitReached")}
          </p>
        ) : (
          <span />
        )}
        <span
          dir="ltr"
          className={`text-[10px] tabular-nums transition-colors ${
            isAtLimit
              ? "text-red-500 dark:text-red-400 font-bold"
              : "text-ink-subtle"
          }`}
        >
          {count}/{maxLength}
        </span>
      </div>
    </div>
  );
}
