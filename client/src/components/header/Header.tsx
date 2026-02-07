"use client";

/**
 * Header Component
 * Main responsive header with navigation, theme toggle, and auth buttons
 * Supports desktop, tablet (iPad), and mobile (iPhone) layouts
 */

import { useState } from "react";
import { usePathname } from "next/navigation";
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
import { LoginModal } from "@/components/auth";

export function Header({ className = "" }: HeaderProps) {
  const pathname = usePathname();
  const { isMobileMenuOpen, isScrolled, toggleMobileMenu, closeMobileMenu } =
    useHeader();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Hide header on create pages (editor) and preview frame
  if (
    pathname?.startsWith("/create") ||
    pathname?.startsWith("/preview-frame")
  ) {
    return null;
  }

  const openLoginModal = () => {
    closeMobileMenu();
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  return (
    <>
      <header
        id="main-navigation"
        dir="rtl"
        role="banner"
        aria-label="כותרת ראשית"
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
          <div className="relative flex items-center justify-center h-16 lg:h-18">
            {/* Right Side: Logo (RTL) - Absolute positioned */}
            <div className="absolute right-0 flex-shrink-0">
              <Logo />
            </div>

            {/* Center: Desktop Navigation - Centered */}
            <div className="hidden lg:block">
              <NavLinks items={NAV_ITEMS} />
            </div>

            {/* Left Side: Actions (RTL) - Absolute positioned */}
            <div className="absolute left-0 flex items-center gap-2 flex-shrink-0">
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Desktop Auth Buttons */}
              <AuthButtons
                variant="desktop"
                className="hidden lg:flex"
                onLoginClick={openLoginModal}
              />

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
          onLoginClick={openLoginModal}
        />
      </header>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        onSwitchToRegister={() => {
          // TODO: Implement register modal switch
          console.log("Switch to register");
        }}
      />
    </>
  );
}
