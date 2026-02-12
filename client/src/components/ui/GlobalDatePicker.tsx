"use client";

/**
 * GlobalDatePicker Component
 *
 * Styled, accessible date input that replaces raw `<input type="date">` across
 * the app.  Uses HeartNote design tokens (Mint / Periwinkle accent, rounded-xl)
 * and supports RTL layout, dark mode, error states, and optional labels.
 *
 * UX:
 *  - Desktop: renders a styled native <input type="date"> with year-jump support
 *  - Mobile (< md): renders a plain native <input type="date"> that triggers the OS picker
 *  - Both sync to the same `value` / `onChange` pair
 */

import { useId } from "react";
import { Calendar } from "lucide-react";

export interface GlobalDatePickerProps {
  /** Current value in YYYY-MM-DD format */
  value: string;
  /** Called with a YYYY-MM-DD string */
  onChange: (value: string) => void;
  /** Optional visible label */
  label?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Error message */
  error?: string;
  /** Additional wrapper class names */
  className?: string;
  /** Min date (YYYY-MM-DD) */
  min?: string;
  /** Max date (YYYY-MM-DD) */
  max?: string;
  /** Disable input */
  disabled?: boolean;
  /** Layout direction override */
  dir?: "rtl" | "ltr";
}

export function GlobalDatePicker({
  value,
  onChange,
  label,
  placeholder,
  error,
  className = "",
  min,
  max,
  disabled = false,
  dir = "rtl",
}: GlobalDatePickerProps) {
  const id = useId();

  // Shared input classes
  const inputClasses = `
    w-full pr-10 pl-3 py-2.5 text-sm
    rounded-xl
    bg-white dark:bg-gray-700
    text-[#2e3c52] dark:text-white
    border-2 transition-all duration-200
    placeholder-gray-400 dark:placeholder-gray-500
    focus:outline-none focus:ring-0
    disabled:opacity-50 disabled:cursor-not-allowed
    [&::-webkit-calendar-picker-indicator]:cursor-pointer
    [&::-webkit-calendar-picker-indicator]:opacity-60
    [&::-webkit-calendar-picker-indicator]:hover:opacity-100
    ${
      error
        ? "border-red-400 focus:border-red-500"
        : "border-gray-200 dark:border-gray-600 focus:border-[#C7CEEA] dark:focus:border-[#B5EAD7]"
    }
  `;

  return (
    <div className={`w-full ${className}`} dir={dir}>
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-bold text-[#2e3c52] dark:text-gray-200 mb-1 text-right text-hebrew-heading"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {/* Calendar icon */}
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#C7CEEA] dark:text-[#B5EAD7]">
          <Calendar size={16} />
        </span>

        <input
          id={id}
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          min={min}
          max={max}
          disabled={disabled}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${id}-error` : undefined}
          className={inputClasses}
        />
      </div>

      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1 text-xs text-red-500 text-right text-hebrew-body"
        >
          {error}
        </p>
      )}
    </div>
  );
}
