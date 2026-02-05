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
        p-2 rounded-lg
        border border-navy-200 dark:border-navy-600
        hover:bg-gray-50 dark:hover:bg-navy-800
        transition-colors duration-200
        lg:hidden
        ${className}
      `}
      aria-label={isOpen ? "סגור תפריט" : "פתח תפריט"}
      aria-expanded={isOpen}
    >
      <div className="w-5 h-4 relative flex flex-col justify-between">
        <span
          className={`
            block h-0.5 w-full bg-navy-700 dark:bg-gray-200
            transition-transform duration-300 origin-left
            ${isOpen ? "rotate-45 translate-x-0.5" : ""}
          `}
        />
        <span
          className={`
            block h-0.5 w-full bg-navy-700 dark:bg-gray-200
            transition-opacity duration-300
            ${isOpen ? "opacity-0" : ""}
          `}
        />
        <span
          className={`
            block h-0.5 w-full bg-navy-700 dark:bg-gray-200
            transition-transform duration-300 origin-left
            ${isOpen ? "-rotate-45 translate-x-0.5" : ""}
          `}
        />
      </div>
    </button>
  );
}
