"use client";

/**
 * AuthInput Component
 * Styled input field for auth forms
 */

import type { AuthInputProps } from "../types";

export function AuthInput({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
}: AuthInputProps) {
  return (
    <div className="mb-3">
      <label
        htmlFor={id}
        className="block text-xs font-bold text-[#2e3c52] dark:text-gray-200 mb-1 text-right text-hebrew-heading"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`
          w-full px-3 py-2.5 rounded-lg text-sm
          bg-white dark:bg-gray-700
          border-2 transition-all duration-200
          text-[#2e3c52] dark:text-white text-right
          placeholder-gray-400 dark:placeholder-gray-500
          text-hebrew-body
          focus:outline-none focus:ring-0
          ${
            error
              ? "border-red-400 focus:border-red-500"
              : "border-gray-200 dark:border-gray-600 focus:border-[#d4826f] dark:focus:border-[#e8917a]"
          }
        `}
        dir={type === "email" ? "ltr" : "rtl"}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1 text-sm text-red-500 text-right text-hebrew-body"
        >
          {error}
        </p>
      )}
    </div>
  );
}
