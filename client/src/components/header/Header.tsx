"use client";

/**
 * Header Component
 * Main responsive header with navigation, theme toggle, and auth buttons
 * Supports desktop, tablet (iPad), and mobile (iPhone) layouts
 */

import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
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
  const [loginModalView, setLoginModalView] = useState<
    "login" | "update-password"
  >("login");
  const searchParams = useSearchParams();

  // Auto-open modal in update-password mode when coming from recovery link
  // Supports both: ?reset_password=true (legacy) and ?modal=reset-password (new)
  useEffect(() => {
    if (
      searchParams.get("reset_password") === "true" ||
      searchParams.get("modal") === "reset-password"
    ) {
      setLoginModalView("update-password");
      setIsLoginModalOpen(true);
      // Clean the URL without triggering a navigation
      const url = new URL(window.location.href);
      url.searchParams.delete("reset_password");
      url.searchParams.delete("modal");
      window.history.replaceState({}, "", url.pathname + url.search);
    }
  }, [searchParams]);

  // Hide header only on preview frame (iframe content)
  if (pathname?.startsWith("/preview-frame")) {
    return null;
  }

  const openLoginModal = () => {
    closeMobileMenu();
    setLoginModalView("login");
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    setLoginModalView("login");
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
          bg-white dark:bg-gray-900
          transition-all duration-300 ease-out
          ${
            isScrolled
              ? "shadow-lg shadow-black/5 dark:shadow-black/20 border-b border-gray-200/50 dark:border-gray-700/50"
              : "border-b border-gray-200/30 dark:border-gray-700/30"
          }
          ${className}
        `}
      >
        <div className="relative z-[2] w-full px-4 lg:px-8 bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Right Side: Logo (RTL) */}
            <div className="flex-shrink-0">
              <Logo />
            </div>

            {/* Center: Desktop Navigation */}
            <div className="hidden lg:block">
              <NavLinks items={NAV_ITEMS} />
            </div>

            {/* Left Side: Actions (RTL) */}
            <div className="flex items-center gap-2 flex-shrink-0">
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

        {/* Mobile Menu — absolutely positioned below header bar, inside the sticky container */}
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
        initialView={loginModalView}
        onSwitchToRegister={() => {
          // TODO: Implement register modal switch
          console.log("Switch to register");
        }}
      />
    </>
  );
}
