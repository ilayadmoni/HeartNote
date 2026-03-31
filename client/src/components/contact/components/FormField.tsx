"use client";

/**
 * FormField Component
 * Reusable form input with label and error handling
 */

import type { FormFieldProps } from "../types";

export function FormField({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  required = false,
  maxLength,
}: FormFieldProps & { maxLength?: number }) {
  const baseInputStyles = `
    w-full px-4 py-3 rounded-xl
    bg-white dark:bg-gray-700
    border-2 transition-all duration-200
    text-[#2e3c52] dark:text-white
    placeholder-gray-400 dark:placeholder-gray-500
    text-hebrew-body
    focus:outline-none focus:ring-0
    ${
      error
        ? "border-red-400 dark:border-red-500 focus:border-red-500"
        : "border-gray-200 dark:border-gray-600 focus:border-[#d4826f] dark:focus:border-[#e8917a]"
    }
  `;

  return (
    <div className="mb-5">
      <label
        htmlFor={id}
        className="block text-sm font-bold text-[#2e3c52] dark:text-gray-200 mb-2 text-hebrew-heading"
      >
        {label}
        {required && <span className="text-red-500 mr-1">*</span>}
      </label>

      {type === "textarea" ? (
        <textarea
          id={id}
          name={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          maxLength={maxLength}
          rows={5}
          className={`${baseInputStyles} resize-none`}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-invalid={error ? "true" : "false"}
        />
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          maxLength={maxLength}
          className={baseInputStyles}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-invalid={error ? "true" : "false"}
        />
      )}

      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-2 text-sm text-red-500 dark:text-red-400 text-hebrew-body"
        >
          {error}
        </p>
      )}
    </div>
  );
}
