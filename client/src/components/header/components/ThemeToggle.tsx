"use client";

/**
 * ThemeToggle Component
 * Toggle button for switching between light and dark mode
 */

import { useThemeContext } from "@/components/theme";
import type { ThemeToggleProps } from "../types";

export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { isDark, toggleTheme } = useThemeContext();

  return (
    <button
      onClick={toggleTheme}
      className={`
        p-2 rounded-full inline-flex items-center justify-center
        text-navy-600 dark:text-gray-300
        hover:bg-gray-100 dark:hover:bg-navy-700
        transition-colors duration-200
        ${className}
      `}
      aria-label={isDark ? "עבור למצב בהיר" : "עבור למצב כהה"}
      title={isDark ? "מצב בהיר" : "מצב כהה"}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

function MoonIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
        fill="currentColor"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="4" fill="currentColor" />
      <path
        d="M10 2V4M10 16V18M4 10H2M18 10H16M5.17 5.17L6.58 6.58M13.42 13.42L14.83 14.83M5.17 14.83L6.58 13.42M13.42 6.58L14.83 5.17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
