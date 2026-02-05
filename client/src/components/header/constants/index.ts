/**
 * Header Constants
 * Navigation items and configuration
 */

import type { NavItem } from '../types';

export const NAV_ITEMS: NavItem[] = [
  { id: 'templates', label: 'גלריית התבניות', href: '/templates' },
  { id: 'pricing', label: 'תוכניות ומחירים', href: '/pricing' },
  { id: 'how-it-works', label: 'איך זה עובד', href: '/how-it-works' },
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
