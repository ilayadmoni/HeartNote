/**
 * Theme Constants
 * Configuration constants for theme management
 */

export const THEME_STORAGE_KEY = 'heartnote-theme';

export const THEME_VALUES = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;

// Cream paper is the brand surface; dark mode is an explicit toggle.
export const DEFAULT_THEME = THEME_VALUES.LIGHT;
