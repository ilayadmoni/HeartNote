"use client";

import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface AuthTermsCheckboxProps {
  checked: boolean;
  onToggle: () => void;
  error?: string | null;
}

/**
 * Shared "I agree to the terms" checkbox used by registration and both
 * complete-profile flows (page + modal step).
 */
export function AuthTermsCheckbox({ checked, onToggle, error }: AuthTermsCheckboxProps) {
  const t = useTranslations("auth");

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      onToggle();
    }
  };

  return (
    <div className="mt-4 mb-1">
      <div
        role="checkbox"
        aria-checked={checked}
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={handleKeyDown}
        className="flex items-center gap-2 cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 rounded"
      >
        <span className="text-caption text-ink-muted leading-relaxed">
          {t("terms.prefix")}{" "}
          <Link
            href="/privacy"
            target="_blank"
            onClick={(e) => e.stopPropagation()}
            className="underline text-accent hover:text-accent-hover font-semibold"
          >
            {t("terms.link")}
          </Link>
        </span>

        <span
          className={cn(
            "shrink-0 flex items-center justify-center w-[18px] h-[18px] rounded-[4px] border-2 transition-all duration-150",
            checked ? "bg-accent border-accent" : "bg-surface-raised border-line-strong",
          )}
        >
          <Check
            className={cn(
              "w-3 h-3 text-accent-ink pointer-events-none transition-all duration-150",
              checked ? "opacity-100 scale-100" : "opacity-0 scale-50",
            )}
            strokeWidth={3}
          />
        </span>
      </div>

      {error && <p className="text-caption text-red-500 mt-1 text-end">{error}</p>}
    </div>
  );
}
