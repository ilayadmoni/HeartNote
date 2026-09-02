"use client";

/**
 * Header Component
 * Main responsive header with navigation, theme toggle, and auth buttons
 * Supports desktop, tablet, and mobile layouts
 */

import { useState } from "react";
import { usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import type { HeaderProps } from "./types";
import { NAV_ITEMS } from "./constants";
import { useHeader } from "@/hooks/useHeader";
import { usePasswordResetModal } from "@/hooks/usePasswordResetModal";
import { cn } from "@/lib/utils";
import {
  Logo,
  NavLinks,
  ThemeToggle,
  AuthButtons,
  HamburgerButton,
  MobileMenu,
  UserMenu,
  LanguageSwitcher,
} from "./components";
import { LoginModal } from "@/components/auth";

export function Header({ className = "" }: HeaderProps): JSX.Element | null {
  const t = useTranslations("common");
  const pathname = usePathname();
  const { isMobileMenuOpen, isScrolled, toggleMobileMenu, closeMobileMenu } = useHeader();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginModalView, setLoginModalView] = useState<
    "login" | "update-password" | "complete-profile"
  >("login");

  usePasswordResetModal(setLoginModalView, setIsLoginModalOpen);

  const handleUserMenuToggle = (isOpen: boolean): void => {
    if (isOpen && isMobileMenuOpen) {
      closeMobileMenu();
    }
  };

  // Hide header only on preview frame (iframe content)
  if (pathname?.startsWith("/preview-frame")) {
    return null;
  }

  const openLoginModal = (): void => {
    closeMobileMenu();
    setLoginModalView("login");
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = (): void => {
    setIsLoginModalOpen(false);
    setLoginModalView("login");
  };

  return (
    <>
      <header
        id="main-navigation"
        role="banner"
        aria-label={t("a11y.mainHeader")}
        className={cn(
          isMobileMenuOpen ? "fixed" : "sticky",
          "top-0 z-[100] w-full bg-surface/90 backdrop-blur transition-all duration-base",
          isScrolled ? "shadow-soft border-b border-line" : "border-b border-line/60",
          className,
        )}
      >
        <div className="section-shell">
          <div className="flex items-center justify-between h-16 lg:h-[4.5rem]">
            <div className="shrink-0">
              <Logo />
            </div>

            <div className="hidden lg:block">
              <NavLinks items={NAV_ITEMS} />
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <LanguageSwitcher className="hidden sm:inline-flex" />
              <ThemeToggle />

              <AuthButtons variant="desktop" className="hidden lg:flex" onLoginClick={openLoginModal} />

              <div className="flex items-center gap-2 lg:hidden">
                <UserMenu onMenuToggle={handleUserMenuToggle} />
                <HamburgerButton isOpen={isMobileMenuOpen} onClick={toggleMobileMenu} />
              </div>
            </div>
          </div>
        </div>

        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={closeMobileMenu}
          navItems={NAV_ITEMS}
          onLoginClick={openLoginModal}
        />
      </header>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        initialView={loginModalView}
        onSwitchToRegister={() => {
          // TODO: Implement register modal switch
        }}
      />
    </>
  );
}
