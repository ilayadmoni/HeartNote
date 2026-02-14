"use client";

/**
 * HamburgerButton Component
 * Animated hamburger menu toggle button
 */

import type { HamburgerButtonProps } from "../types";

export function HamburgerButton({
  isOpen,
  onClick,
  className = "",
}: HamburgerButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center justify-center
        w-10 h-10 rounded-lg
        border border-gray-200 dark:border-gray-600
        hover:bg-gray-50 dark:hover:bg-gray-800
        transition-colors duration-200
        lg:hidden
        ${className}
      `}
      aria-label={isOpen ? "סגור תפריט" : "פתח תפריט"}
      aria-expanded={isOpen}
      aria-controls="mobile-menu"
    >
      <div className="w-[18px] h-[14px] relative">
        <span
          className={`
            absolute left-0 right-0 h-0.5 bg-[#2e3c52] dark:bg-gray-200
            transition-all duration-300
            ${isOpen ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"}
          `}
        />
        <span
          className={`
            absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-[#2e3c52] dark:bg-gray-200
            transition-opacity duration-300
            ${isOpen ? "opacity-0" : ""}
          `}
        />
        <span
          className={`
            absolute left-0 right-0 h-0.5 bg-[#2e3c52] dark:bg-gray-200
            transition-all duration-300
            ${isOpen ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"}
          `}
        />
      </div>
    </button>
  );
}
