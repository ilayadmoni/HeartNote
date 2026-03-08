"use client";

/** UserMenu – avatar + dropdown when logged in. */

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfileQuery } from "@/hooks/useProfileQuery";
import { MenuItem } from "./MenuItem";
import { UserAvatar } from "./UserAvatar";

interface UserMenuProps {
  onMenuToggle?: (isOpen: boolean) => void;
}

export function UserMenu({ onMenuToggle }: UserMenuProps = {}) {
  const { user, signOut } = useAuth();
  const { data: profile } = useProfileQuery();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on click-outside or Escape key
  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setIsOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const handleSignOut = async () => {
    setIsOpen(false);
    await signOut();
  };

  if (!user) return null;

  const firstName = profile?.first_name;
  const lastName = profile?.last_name;
  const displayName = firstName || user.email?.split("@")[0] || "משתמש";
  const fullName =
    firstName && lastName
      ? `${firstName} ${lastName}`
      : firstName || displayName;
  const avatarUrl = profile?.avatar_url ?? null;

  return (
    <div
      ref={menuRef}
      className="relative z-[150]"
      onMouseDown={(e) => e.stopPropagation()}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          const newState = !isOpen;
          setIsOpen(newState);
          onMenuToggle?.(newState);
        }}
        className="
          flex items-center gap-2 px-3 py-1.5
          rounded-full
          bg-white dark:bg-gray-700
          border border-gray-200 dark:border-gray-600
          hover:border-[#d4826f] dark:hover:border-[#e8917a]
          transition-all duration-200
          focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4826f]
        "
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={`תפריט משתמש - ${displayName}`}
      >
        <UserAvatar avatarUrl={avatarUrl} displayName={displayName} />
        <span className="text-sm font-medium text-[#2e3c52] dark:text-white max-w-[100px] truncate text-hebrew-body hidden sm:inline">
          {displayName}
        </span>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
            className="
              absolute top-full left-0 mt-2
              w-56 max-w-[calc(100vw-1rem)]
              bg-white dark:bg-gray-800
              rounded-xl shadow-lg
              border border-gray-100 dark:border-gray-700
              overflow-hidden
              z-[250]
            "
          >
            {/* User Info */}
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
              <p className="text-sm font-bold text-[#2e3c52] dark:text-white text-hebrew-heading truncate">
                {fullName}
              </p>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              <MenuItem
                icon={<User size={16} />}
                label="הפרופיל שלי"
                onClick={() => {
                  setIsOpen(false);
                  window.location.href = "/profile";
                }}
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
