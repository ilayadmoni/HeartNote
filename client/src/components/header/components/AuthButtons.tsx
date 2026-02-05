"use client";

/**
 * AuthButtons Component
 * Login and CTA buttons for the header
 */

import Link from "next/link";
import type { AuthButtonsProps } from "../types";

export function AuthButtons({
  className = "",
  variant = "desktop",
}: AuthButtonsProps) {
  const isDesktop = variant === "desktop";

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Login Button - White/cream background with dark text */}
      <Link
        href="/login"
        className={`
          font-medium transition-all duration-200
          bg-white dark:bg-white
          text-[#2e3c52] dark:text-[#2e3c52]
          border border-[#c7d0dc] dark:border-[#c7d0dc]
          hover:border-[#d4826f] dark:hover:border-[#d4826f]
          shadow-sm hover:shadow-md
          ${
            isDesktop
              ? "px-5 py-2 text-sm rounded-full"
              : "w-full py-3 text-center rounded-lg"
          }
        `}
      >
        התחברות
      </Link>

      {/* CTA Button */}
      <Link
        href="/create"
        className={`
          font-medium text-white transition-all duration-200
          bg-[#d4826f] hover:bg-[#c4735f]
          shadow-md hover:shadow-lg
          ${
            isDesktop
              ? "px-5 py-2 text-sm rounded-full"
              : "w-full py-3 text-center rounded-lg"
          }
        `}
      >
        צור ברכה בחינם
      </Link>
    </div>
  );
}
