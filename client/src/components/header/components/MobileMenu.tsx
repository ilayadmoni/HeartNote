"use client";

/**
 * MobileMenu Component
 * Slide-out menu for mobile and tablet viewports
 * Includes focus trap for keyboard accessibility
 */

import { useEffect, useRef } from "react";
import Link from "next/link";
import type { MobileMenuProps } from "../types";
import { FocusTrap } from "@/components/accessibility";
import { useAuth } from "@/contexts/AuthContext";

export function MobileMenu({
  isOpen,
  onClose,
  navItems,
  onLoginClick,
}: MobileMenuProps) {
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const { user, loading } = useAuth();

  // Focus first link when menu opens
  useEffect(() => {
    if (isOpen && firstLinkRef.current) {
      // Small delay to allow animation to start
      setTimeout(() => {
        firstLinkRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // NOTE: Body scroll lock is handled by useHeader hook.
  // Do NOT duplicate it here — racing cleanup causes persistent overflow:hidden.

  return (
    <>
      {/* Backdrop — z-[1] within header stacking context: behind header bar & menu, above page content */}
      <div
        className={`
          fixed inset-0 bg-black/50 backdrop-blur-sm
          transition-opacity duration-300 lg:hidden z-[1]
          ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu Panel — z-[2] within header stacking context: same level as header bar, above backdrop */}
      <FocusTrap active={isOpen} onEscape={onClose}>
        <div
          id="mobile-menu"
          className={`
            absolute top-full left-0 w-full z-[2]
            bg-white dark:bg-gray-900
            shadow-xl lg:hidden
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
            {/* Navigation Links */}
            <ul className="flex flex-col gap-2 mb-6" role="list">
              {navItems.map((item, index) => (
                <li key={item.id} role="listitem">
                  <Link
                    ref={index === 0 ? firstLinkRef : null}
                    href={item.href}
                    onClick={onClose}
                    className="
                      block p-4
                      text-[#2e3c52] dark:text-gray-200
                      font-medium
                      hover:text-[#c4735f] dark:hover:text-[#e8917a]
                      hover:bg-gray-100 dark:hover:bg-gray-800
                      rounded-xl transition-all duration-200
                      text-right text-hebrew-body
                      border-b border-gray-100 dark:border-gray-700/50 last:border-b-0
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4826f] focus-visible:ring-offset-2
                    "
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Login/Register — only when not logged in */}
            {!loading && !user && onLoginClick && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onLoginClick();
                }}
                className="
                  w-full py-3 text-center rounded-lg
                  bg-[#2e3c52] dark:bg-[#d4826f]
                  text-white font-bold text-sm
                  transition-all duration-200
                  text-hebrew-heading
                  hover:bg-[#1B263B] dark:hover:bg-[#c4735f]
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4826f] focus-visible:ring-offset-2
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
