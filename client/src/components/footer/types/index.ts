/**
 * Footer Types
 * Type definitions for the footer component
 */

export interface FooterProps {
  className?: string;
}

export interface FooterLinkGroup {
  title: string;
  links: FooterLink[];
}

export interface FooterLink {
  id: string;
  label: string;
  href: string;
}

export interface SocialLink {
  id: string;
  label: string;
  href: string;
  icon: 'tiktok' | 'instagram' | 'facebook' | 'twitter';
}
