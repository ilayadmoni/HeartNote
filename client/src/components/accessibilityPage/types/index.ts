/**
 * Accessibility Page Types
 */

export interface AccessibilityProps {
  className?: string;
}

export interface AccessibilityFeature {
  id: string;
  title: string;
  description: string;
  icon: "keyboard" | "eye" | "mouse" | "volume" | "monitor" | "smartphone";
}

export interface ContactInfo {
  email: string;
  phone: string;
}
