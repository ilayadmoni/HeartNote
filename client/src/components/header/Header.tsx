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
  UserMenu,
} from "./components";
import { LoginModal } from "@/components/auth";

export function Header({ className = "" }: HeaderProps) {
  const pathname = usePathname();
  const { isMobileMenuOpen, isScrolled, toggleMobileMenu, closeMobileMenu } =
    useHeader();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Hide header only on preview frame (iframe content)
  if (pathname?.startsWith("/preview-frame")) {
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
          sticky top-0 z-[100] w-full
          transition-all duration-300 ease-out
          ${
            isScrolled
              ? "backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 shadow-lg shadow-black/5 dark:shadow-black/20 border-b border-gray-200/50 dark:border-gray-700/50"
              : "backdrop-blur-sm border-b"
          }
          ${className}
        `}
        style={{
          backgroundColor: isScrolled ? undefined : "var(--header-bg)",
          borderColor: isScrolled ? undefined : "var(--header-border)",
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

              {/* Mobile: Avatar + Hamburger */}
              <div className="flex items-center gap-2 lg:hidden">
                <UserMenu />
                <HamburgerButton
                  isOpen={isMobileMenuOpen}
                  onClick={toggleMobileMenu}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu — rendered outside header so backdrop covers full page */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
        navItems={NAV_ITEMS}
        onLoginClick={openLoginModal}
      />

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
