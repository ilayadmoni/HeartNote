/**
 * Header Types
 * Type definitions for header components
 */

export interface NavItem {
  id: string;
  label: string;
  href: string;
}

export interface HeaderProps {
  className?: string;
}

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
  onLoginClick?: () => void;
}

export interface NavLinksProps {
  items: NavItem[];
  className?: string;
  onItemClick?: () => void;
}

export interface LogoProps {
  className?: string;
}

export interface ThemeToggleProps {
  className?: string;
}

export interface AuthButtonsProps {
  className?: string;
  variant?: 'desktop' | 'mobile';
  onLoginClick?: () => void;
}

export interface HamburgerButtonProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}
