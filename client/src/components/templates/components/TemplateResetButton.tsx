"use client";

import { RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";

interface TemplateResetButtonProps {
  onClick: () => void;
  label?: string;
  className?: string;
}

export function TemplateResetButton({
  onClick,
  label,
  className = "",
}: TemplateResetButtonProps) {
  const t = useTranslations("templates");
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-pill text-sm font-bold text-accent-ink bg-accent hover:bg-accent-hover shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${className}`}
    >
      <span>{label ?? t("common.resetDefault")}</span>
      <RotateCcw size={15} />
    </button>
  );
}
