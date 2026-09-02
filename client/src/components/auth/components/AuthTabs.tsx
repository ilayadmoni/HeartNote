"use client";

/**
 * AuthTabs Component
 * Pill-style tab switcher for Login/Register
 */

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface AuthTabsProps {
  activeTab: "login" | "register";
  onTabChange: (tab: "login" | "register") => void;
}

export function AuthTabs({ activeTab, onTabChange }: AuthTabsProps) {
  const t = useTranslations("auth");
  return (
    <div className="flex rounded-pill bg-surface-sunken p-1 mb-4">
      <TabButton
        label={t("tabs.login")}
        isActive={activeTab === "login"}
        onClick={() => onTabChange("login")}
      />
      <TabButton
        label={t("tabs.register")}
        isActive={activeTab === "register"}
        onClick={() => onTabChange("register")}
      />
    </div>
  );
}

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function TabButton({ label, isActive, onClick }: TabButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex-1 py-1.5 px-3 rounded-pill text-body-sm font-bold transition-colors duration-base",
        isActive ? "text-ink" : "text-ink-subtle hover:text-ink-muted",
      )}
    >
      {isActive && (
        <motion.div
          layoutId="auth-tab-indicator"
          className="absolute inset-0 bg-surface rounded-pill shadow-soft"
          transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
        />
      )}
      <span className="relative z-10">{label}</span>
    </button>
  );
}
