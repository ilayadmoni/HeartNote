"use client";

import { useTranslations } from "next-intl";

interface ToggleRowProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}

export function ToggleRow({ label, description, checked, onChange }: ToggleRowProps): JSX.Element {
  const t = useTranslations("common.a11y");
  return (
    <div className="flex items-center justify-between rounded-control border border-line bg-surface-raised px-3 py-2">
      <div className="flex-1 pe-2">
        <p className="text-caption sm:text-body-sm font-semibold text-ink">{label}</p>
        <p className="text-caption text-ink-muted">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative inline-flex shrink-0 h-6 w-11 items-center rounded-pill transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
          checked ? "bg-accent" : "bg-line-strong"
        }`}
        aria-label={`${label}: ${checked ? t("on") : t("off")}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-pill bg-surface-raised shadow-soft transition-transform duration-200 ease-in-out ${
            checked ? "rtl:-translate-x-5 ltr:translate-x-5" : "translate-x-0"
          } ms-1`}
        />
      </button>
    </div>
  );
}
