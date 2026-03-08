"use client";

/** MobileMenu – slide-out nav for mobile/tablet with navy background. */

import { useEffect, useRef, forwardRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { MobileMenuProps } from "../types";
import { FocusTrap } from "@/components/accessibility";
import { useAuth } from "@/contexts/AuthContext";

/** Uniform border accent — coral/salmon brand color */
const BORDER_COLOR = "#d4826f";

export function MobileMenu({
  isOpen,
  onClose,
  navItems,
  onLoginClick,
}: MobileMenuProps) {
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const { user, loading } = useAuth();

  useEffect(() => {
    if (isOpen && firstLinkRef.current) {
      setTimeout(() => firstLinkRef.current?.focus(), 100);
    }
  }, [isOpen]);

  return (
    <>
      {/* Backdrop – starts below the header bar so it doesn't block header controls */}
      <div
        className={`
          fixed left-0 right-0 bottom-0 bg-black/50 backdrop-blur-sm
          transition-opacity duration-300 lg:hidden z-[90]
          ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
        style={{ top: "64px" }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu Panel – theme-aware background */}
      <FocusTrap active={isOpen} onEscape={onClose}>
        <div
          id="mobile-menu"
          className={`
            absolute top-full left-0 w-full z-[95]
            bg-white dark:bg-[#2e3c52] shadow-xl lg:hidden
            transition-all duration-300 ease-out overflow-hidden
            ${
              isOpen
                ? "opacity-100 max-h-[80vh] translate-y-0"
                : "opacity-0 max-h-0 pointer-events-none"
            }
          `}
          aria-label="תפריט ניווט"
          aria-hidden={!isOpen}
        >
          <nav className="container mx-auto px-4 py-6" aria-label="ניווט נייד">
            <ul className="flex flex-col gap-3 mb-6" role="list">
              {navItems.map((item, index) => (
                <MobileNavItem
                  key={item.id}
                  href={item.href}
                  label={item.label}
                  ref={index === 0 ? firstLinkRef : null}
                  onClick={onClose}
                />
              ))}
            </ul>

            {!loading && !user && onLoginClick && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onLoginClick();
                }}
                className="
                  w-full py-3 text-center rounded-lg
                  bg-[#d4826f] text-white font-bold text-sm
                  transition-all duration-200 text-hebrew-heading
                  hover:bg-[#c4735f]
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4826f]
                  focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#2e3c52]
                "
              >
                התחברות / הרשמה
              </button>
            )}
          </nav>
        </div>
      </FocusTrap>
    </>
  );
}

/* ─── Nav Item ─── */
interface MobileNavItemProps {
  href: string;
  label: string;
  onClick: () => void;
}

const MobileNavItem = forwardRef<HTMLAnchorElement, MobileNavItemProps>(
  ({ href, label, onClick }, ref) => (
    <li role="listitem">
      <motion.div
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        <Link
          ref={ref}
          href={href}
          onClick={onClick}
          className="
            block p-4 rounded-xl text-right text-hebrew-body font-medium
            text-[#2e3c52] dark:text-white/90
            hover:text-[#c4735f] dark:hover:text-white
            bg-gray-50 dark:bg-white/10
            hover:bg-gray-100 dark:hover:bg-white/15
            transition-all duration-200
            focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4826f]
            focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#2e3c52]
          "
          style={{
            borderRight: `4px solid ${BORDER_COLOR}`,
            borderBottom: `1px solid rgba(212,130,111,0.2)`,
          }}
        >
          {label}
        </Link>
      </motion.div>
    </li>
  ),
);
MobileNavItem.displayName = "MobileNavItem";
