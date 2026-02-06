"use client";

/**
 * AuthTabs Component
 * Tab switcher for Login/Register
 */

import { motion } from "framer-motion";

interface AuthTabsProps {
  activeTab: "login" | "register";
  onTabChange: (tab: "login" | "register") => void;
}

export function AuthTabs({ activeTab, onTabChange }: AuthTabsProps) {
  return (
    <div className="flex rounded-lg bg-gray-100 dark:bg-gray-700 p-1 mb-4">
      <TabButton
        label="התחברות"
        isActive={activeTab === "login"}
        onClick={() => onTabChange("login")}
      />
      <TabButton
        label="הרשמה"
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
      className={`
        relative flex-1 py-1.5 px-3 rounded-md
        text-xs font-bold text-hebrew-heading
        transition-colors duration-200
        ${
          isActive
            ? "text-[#2e3c52] dark:text-white"
            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        }
      `}
    >
      {isActive && (
        <motion.div
          layoutId="auth-tab-indicator"
          className="absolute inset-0 bg-white dark:bg-gray-600 rounded-lg shadow-sm"
          transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
        />
      )}
      <span className="relative z-10">{label}</span>
    </button>
  );
}
