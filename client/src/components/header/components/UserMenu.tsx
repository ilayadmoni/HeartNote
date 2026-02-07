"use client";

/**
 * UserMenu Component
 * User avatar and dropdown menu when logged in
 */

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, Settings, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function UserMenu() {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menu on Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleSignOut = async () => {
    setIsOpen(false);
    await signOut();
  };

  if (!user) return null;

  const displayName =
    user.user_metadata?.full_name ||
    user.user_metadata?.display_name ||
    user.email?.split("@")[0] ||
    "משתמש";
  const photoURL =
    user.user_metadata?.avatar_url || user.user_metadata?.picture;
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <div ref={menuRef} className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          flex items-center gap-2 p-1 pr-3
          rounded-full
          bg-white dark:bg-gray-700
          border border-gray-200 dark:border-gray-600
          hover:border-[#d4826f] dark:hover:border-[#e8917a]
          transition-all duration-200
          focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4826f]
        "
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full overflow-hidden bg-[#d4826f] flex items-center justify-center">
          {photoURL ? (
            <img
              src={photoURL}
              alt={displayName}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white text-sm font-bold">{initials}</span>
          )}
        </div>

        {/* Name (Desktop only) */}
        <span className="hidden md:block text-sm font-medium text-[#2e3c52] dark:text-white max-w-[100px] truncate text-hebrew-body">
          {displayName}
        </span>

        {/* Chevron */}
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="
              absolute top-full left-0 mt-2
              w-48
              bg-white dark:bg-gray-800
              rounded-xl shadow-lg
              border border-gray-100 dark:border-gray-700
              overflow-hidden
              z-50
            "
          >
            {/* User Info */}
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
              <p className="text-sm font-bold text-[#2e3c52] dark:text-white text-hebrew-heading truncate">
                {displayName}
              </p>
              <p className="text-xs text-gray-400 truncate" dir="ltr">
                {user.email}
              </p>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              <MenuItem
                icon={<User size={16} />}
                label="הפרופיל שלי"
                onClick={() => setIsOpen(false)}
              />
              <MenuItem
                icon={<Settings size={16} />}
                label="הגדרות"
                onClick={() => setIsOpen(false)}
              />
              <div className="h-px bg-gray-100 dark:bg-gray-700 my-1" />
              <MenuItem
                icon={<LogOut size={16} />}
                label="התנתקות"
                onClick={handleSignOut}
                variant="danger"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: "default" | "danger";
}

function MenuItem({
  icon,
  label,
  onClick,
  variant = "default",
}: MenuItemProps) {
  const colorClass =
    variant === "danger"
      ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
      : "text-[#2e3c52] dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700";

  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-4 py-2
        text-sm text-hebrew-body
        transition-colors duration-150
        ${colorClass}
      `}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
