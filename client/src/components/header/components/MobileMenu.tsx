"use client";

/**
 * MobileMenu Component
 * Slide-out menu for mobile and tablet viewports
 */

import { useEffect } from "react";
import Link from "next/link";
import type { MobileMenuProps } from "../types";
import { AuthButtons } from "./AuthButtons";

export function MobileMenu({ isOpen, onClose, navItems }: MobileMenuProps) {
  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

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

      {/* Menu Panel */}
      <div
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
        role="dialog"
        aria-modal="true"
        aria-label="תפריט ניווט"
      >
        <nav className="container mx-auto px-4 py-6">
          {/* Navigation Links */}
          <ul className="space-y-1 mb-6">
            {navItems.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="
                    block py-3 px-2
                    text-[#2e3c52] dark:text-gray-200
                    hover:text-[#c4735f] dark:hover:text-[#e8917a]
                    hover:bg-gray-50 dark:hover:bg-[#293445]
                    rounded-lg transition-colors duration-200
                    text-right font-medium
                  "
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Divider */}
          <div className="h-px bg-gray-100 dark:bg-[#2e3c52] my-4" />

          {/* Auth Buttons */}
          <div className="space-y-3">
            <AuthButtons variant="mobile" />
          </div>
        </nav>
      </div>
    </>
  );
}
