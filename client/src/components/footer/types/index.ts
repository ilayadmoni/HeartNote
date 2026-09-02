/**
 * Footer Types
 * Type definitions for the footer component
 */

export interface FooterProps {
  className?: string;
}

export interface FooterLinkGroup {
  groupKey: "brand" | "legal";
  links: FooterLink[];
}

export interface FooterLink {
  id: string;
  labelKey: string;
  href: string;
}

export interface SocialLink {
  id: string;
  label: string;
  href: string;
  icon: "tiktok" | "instagram" | "facebook" | "twitter";
}
