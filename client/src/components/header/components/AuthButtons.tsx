"use client";

/**
 * AuthButtons Component
 * Login and CTA buttons for the header, or UserMenu when logged in
 */

import Link from "next/link";
import type { AuthButtonsProps } from "../types";
import { UserMenu } from "./UserMenu";
import { useAuth } from "@/contexts/AuthContext";

export function AuthButtons({
  className = "",
  variant = "desktop",
  onLoginClick,
}: AuthButtonsProps) {
  const { user, loading } = useAuth();
  const isDesktop = variant === "desktop";

  // Show nothing while loading
  if (loading) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="w-20 h-9 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
      </div>
    );
  }

  // Show UserMenu if logged in
  if (user) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <UserMenu />
        {/* CTA Button */}
        <Link
          href="/create"
          className={`
            text-white transition-all duration-200 text-hebrew-heading
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

  // Show login buttons when not logged in
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Login Button */}
      <button
        type="button"
        onClick={onLoginClick}
        className={`
          transition-all duration-200 text-hebrew-heading
          bg-white dark:bg-transparent
          text-[#2e3c52] dark:text-[#c7d0dc]
          border border-[#c7d0dc] dark:border-white
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
      </button>

      {/* CTA Button */}
      <Link
        href="/create"
        className={`
          text-white transition-all duration-200 text-hebrew-heading
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
