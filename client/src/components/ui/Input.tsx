"use client";

import { forwardRef, useId, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

/**
 * Text input with label above, hint/error below (tasteskill 4.6).
 * Font size is pinned to 16px globally to avoid iOS zoom.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const messageId = `${inputId}-message`;
    const message = error ?? hint;

    return (
      <div className="w-full flex flex-col gap-2">
        {label && (
          <label htmlFor={inputId} className="text-body-sm font-bold text-ink">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          className={cn(
            "w-full min-h-[3rem] px-4 rounded-control border bg-surface-raised text-ink",
            "placeholder:text-ink-subtle transition-colors duration-base ease-out-quint",
            "border-line-strong hover:border-ink-subtle",
            "focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/25",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/25",
            className,
          )}
          {...props}
        />
        {message && (
          <p
            id={messageId}
            role={error ? "alert" : undefined}
            className={cn("text-caption", error ? "text-red-600 dark:text-red-400" : "text-ink-muted")}
          >
            {message}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
