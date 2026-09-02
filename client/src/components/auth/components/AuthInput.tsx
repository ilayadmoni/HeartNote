"use client";

/**
 * AuthInput Component
 * Styled input field for auth forms with automatic password visibility toggle
 */

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { AuthInputProps } from "../types";

export function AuthInput({
  id,
  name,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  showPasswordToggle = true,
  maxLength,
}: AuthInputProps) {
  const t = useTranslations("auth");
  const [showPassword, setShowPassword] = useState(false);

  // Whether to actually render the eye toggle
  const hasToggle = type === "password" && showPasswordToggle;

  // Determine the actual input type
  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className="mb-2">
      <label htmlFor={id} className="block text-caption font-bold text-ink mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          className={cn(
            "w-full min-w-0 box-border px-3 py-2.5 rounded-control text-body-md",
            "bg-surface-raised border-2 transition-colors duration-base",
            "text-ink placeholder:text-ink-subtle",
            "focus:outline-none focus:ring-2 focus:ring-accent/25",
            hasToggle && "pe-10",
            error
              ? "border-red-400 focus:border-red-500"
              : "border-line-strong focus:border-accent",
          )}
          dir={type === "email" ? "ltr" : undefined}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${id}-error` : undefined}
        />

        {hasToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute end-3 top-1/2 -translate-y-1/2 text-ink-subtle hover:text-accent transition-colors"
            aria-label={showPassword ? t("passwordToggle.hide") : t("passwordToggle.show")}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-body-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
