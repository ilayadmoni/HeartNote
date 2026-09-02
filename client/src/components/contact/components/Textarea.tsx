"use client";

import { forwardRef, useId, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

/** Multi-line field styled to match `@/components/ui/Input` exactly. */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, rows = 5, ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id ?? generatedId;
    const messageId = `${textareaId}-message`;
    const message = error ?? hint;

    return (
      <div className="w-full flex flex-col gap-2">
        {label && (
          <label htmlFor={textareaId} className="text-body-sm font-bold text-ink">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          className={cn(
            "w-full px-4 py-3 rounded-control border bg-surface-raised text-ink resize-none",
            "placeholder:text-ink-subtle transition-colors duration-base ease-out-quint",
            "border-line-strong hover:border-ink-subtle",
            "focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/25",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/25",
            className,
          )}
          {...props}
        />
        {message && (
          <p id={messageId} role={error ? "alert" : undefined} className={cn("text-caption", error ? "text-red-600" : "text-ink-muted")}>
            {message}
          </p>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
