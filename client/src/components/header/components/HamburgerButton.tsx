"use client";

/**
 * HamburgerButton Component
 * Animated hamburger menu toggle button
 */

import { useTranslations } from "next-intl";
import type { HamburgerButtonProps } from "../types";

export function HamburgerButton({
  isOpen,
  onClick,
  className = "",
}: HamburgerButtonProps): JSX.Element {
  const t = useTranslations("nav");
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center justify-center
        w-11 h-11 rounded-control
        border border-line
        hover:bg-surface-sunken
        transition-colors duration-200
        lg:hidden
        ${className}
      `}
      aria-label={isOpen ? t("closeMenu") : t("openMenu")}
      aria-expanded={isOpen}
      aria-controls="mobile-menu"
    >
      <div className="w-[18px] h-[14px] relative">
        <span
          className={`
            absolute start-0 end-0 h-0.5 bg-ink
            transition-all duration-300
            ${isOpen ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"}
          `}
        />
        <span
          className={`
            absolute start-0 end-0 top-1/2 -translate-y-1/2 h-0.5 bg-ink
            transition-opacity duration-300
            ${isOpen ? "opacity-0" : ""}
          `}
        />
        <span
          className={`
            absolute start-0 end-0 h-0.5 bg-ink
            transition-all duration-300
            ${isOpen ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"}
          `}
        />
      </div>
    </button>
  );
}
