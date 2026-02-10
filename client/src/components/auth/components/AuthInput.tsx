"use client";

/**
 * AuthInput Component
 * Styled input field for auth forms with optional password visibility toggle
 */

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { AuthInputProps } from "../types";

export function AuthInput({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  showPasswordToggle = false,
}: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  // Determine the actual input type
  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className="mb-2">
      <label
        htmlFor={id}
        className="block text-xs font-bold text-[#2e3c52] dark:text-gray-200 mb-1 text-right text-hebrew-heading"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={inputType}
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
            ${type === "password" && showPasswordToggle ? "pl-10" : ""}
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

        {/* Password Toggle Button */}
        {type === "password" && showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#d4826f] dark:hover:text-[#e8917a] transition-colors"
            aria-label={showPassword ? "הסתר סיסמה" : "הצג סיסמה"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
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
