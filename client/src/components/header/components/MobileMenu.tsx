"use client";

/**
 * MobileMenu Component
 * Slide-out menu for mobile and tablet viewports
 * Includes focus trap for keyboard accessibility
 */

import { useEffect, useRef } from "react";
import Link from "next/link";
import type { MobileMenuProps } from "../types";
import { AuthButtons } from "./AuthButtons";
import { FocusTrap } from "@/components/accessibility";

export function MobileMenu({
  isOpen,
  onClose,
  navItems,
  onLoginClick,
}: MobileMenuProps) {
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  // Focus first link when menu opens
  useEffect(() => {
    if (isOpen && firstLinkRef.current) {
      // Small delay to allow animation to start
      setTimeout(() => {
        firstLinkRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 bg-black/20 dark:bg-black/40
          transition-opacity duration-300 lg:hidden z-40
          ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu Panel with Focus Trap */}
      <FocusTrap active={isOpen} onEscape={onClose}>
        <div
          id="mobile-menu"
          className={`
            fixed top-[64px] left-0 right-0 bg-white dark:bg-[#252d3b]
            border-t border-gray-100 dark:border-[#2e3c52]
            shadow-lg lg:hidden z-50
            transition-all duration-300 ease-out
            ${
              isOpen
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-4 pointer-events-none"
            }
          `}
          aria-label="תפריט ניווט"
          aria-hidden={!isOpen}
        >
          <nav className="container mx-auto px-4 py-6" aria-label="ניווט נייד">
            {/* Navigation Links */}
            <ul className="space-y-1 mb-6" role="list">
              {navItems.map((item, index) => (
                <li key={item.id} role="listitem">
                  <Link
                    ref={index === 0 ? firstLinkRef : null}
                    href={item.href}
                    onClick={onClose}
                    className="
                      block py-3 px-2
                      text-[#2e3c52] dark:text-gray-200
                      hover:text-[#c4735f] dark:hover:text-[#e8917a]
                      hover:bg-gray-50 dark:hover:bg-[#293445]
                      rounded-lg transition-colors duration-200
                      text-right text-hebrew-body
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4826f] focus-visible:ring-offset-2
                    "
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Divider */}
            <div
              className="h-px bg-gray-100 dark:bg-[#2e3c52] my-4"
              role="separator"
            />

            {/* Auth Buttons */}
            <div className="space-y-3">
              <AuthButtons variant="mobile" onLoginClick={onLoginClick} />
            </div>
          </nav>
        </div>
      </FocusTrap>
    </>
  );
}
