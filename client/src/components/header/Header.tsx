"use client";

/**
 * Header Component
 * Main responsive header with navigation, theme toggle, and auth buttons
 * Supports desktop, tablet (iPad), and mobile (iPhone) layouts
 */

import type { HeaderProps } from "./types";
import { NAV_ITEMS } from "./constants";
import { useHeader } from "./hooks/useHeader";
import {
  Logo,
  NavLinks,
  ThemeToggle,
  AuthButtons,
  HamburgerButton,
  MobileMenu,
} from "./components";

export function Header({ className = "" }: HeaderProps) {
  const { isMobileMenuOpen, isScrolled, toggleMobileMenu, closeMobileMenu } =
    useHeader();

  return (
    <header
      dir="rtl"
      className={`
        sticky top-0 z-50 w-full
        backdrop-blur-sm
        transition-shadow duration-300
        ${isScrolled ? "shadow-md" : ""}
        ${className}
      `}
      style={{
        backgroundColor: "var(--header-bg)",
        borderBottom: "1px solid var(--header-border)",
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-18 gap-4">
          {/* Right Side: Logo (RTL) */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Center: Desktop Navigation */}
          <div className="hidden lg:flex flex-1 justify-center">
            <NavLinks items={NAV_ITEMS} />
          </div>

          {/* Left Side: Actions (RTL) */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Desktop Auth Buttons */}
            <AuthButtons variant="desktop" className="hidden lg:flex" />

            {/* Mobile Hamburger */}
            <HamburgerButton
              isOpen={isMobileMenuOpen}
              onClick={toggleMobileMenu}
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
        navItems={NAV_ITEMS}
      />
    </header>
  );
}
