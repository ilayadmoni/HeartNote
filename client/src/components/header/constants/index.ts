/**
 * Header Constants
 * Navigation items and configuration
 */

import type { NavItem } from '../types';

export const NAV_ITEMS: NavItem[] = [
  { id: 'templates', labelKey: 'gallery', href: '/gallery' },
  { id: 'pricing', labelKey: 'pricing', href: '/pricing' },
  { id: 'how-it-works', labelKey: 'howItWorks', href: '/#how-it-works' },
];

export const HEADER_HEIGHT = {
  MOBILE: 64,
  DESKTOP: 72,
} as const;

export const BREAKPOINTS = {
  MOBILE: 640,
  TABLET: 768,
  DESKTOP: 1024,
} as const;
