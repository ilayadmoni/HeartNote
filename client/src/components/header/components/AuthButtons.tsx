"use client";

/**
 * AuthButtons Component
 * Login CTA for the header, or UserMenu when signed in.
 */

import { useTranslations } from "next-intl";
import type { AuthButtonsProps } from "../types";
import { UserMenu } from "./UserMenu";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export function AuthButtons({
  className = "",
  variant = "desktop",
  onLoginClick,
}: AuthButtonsProps): JSX.Element {
  const t = useTranslations("nav");
  const { user, loading } = useAuth();
  const isDesktop = variant === "desktop";

  if (loading) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="w-20 h-9 rounded-pill bg-surface-sunken animate-pulse" />
      </div>
    );
  }

  if (user) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <UserMenu />
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <button
        type="button"
        onClick={onLoginClick}
        className={cn(
          "font-bold rounded-pill transition-all duration-base",
          "bg-accent text-accent-ink shadow-glow-sm hover:bg-accent-hover hover:shadow-glow",
          isDesktop ? "px-5 py-2 text-body-sm" : "w-full py-3 text-center text-body-md",
        )}
      >
        {t("login")}
      </button>
    </div>
  );
}
