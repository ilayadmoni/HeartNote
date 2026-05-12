/**
 * Accessibility Types
 */

export interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
}

export interface VisuallyHiddenProps {
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
}

export interface FocusTrapProps {
  children: React.ReactNode;
  active: boolean;
  onEscape?: () => void;
}
