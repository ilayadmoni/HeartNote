"use client";

import { RotateCcw } from "lucide-react";

interface TemplateResetButtonProps {
  onClick: () => void;
  label?: string;
  className?: string;
}

export function TemplateResetButton({
  onClick,
  label = "התחל מחדש",
  className = "",
}: TemplateResetButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white bg-[#d4826f] hover:bg-[#c4735f] shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4826f] focus-visible:ring-offset-2 ${className}`}
    >
      <RotateCcw size={15} />
      <span>{label}</span>
    </button>
  );
}
