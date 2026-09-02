'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Theme } from '@/components/theme/types';
import { THEME_STORAGE_KEY, DEFAULT_THEME } from '@/components/theme/constants';

interface UseThemeReturn {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
  isLoaded: boolean;
}

export function useTheme(storageKey: string = THEME_STORAGE_KEY): UseThemeReturn {
  const [theme, setThemeState] = useState<Theme>(DEFAULT_THEME);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey) as Theme | null;
    const initialTheme: Theme = stored === 'dark' ? 'dark' : 'light';
    setThemeState(initialTheme);
    setIsLoaded(true);
  }, [storageKey]);

  useEffect(() => {
    if (!isLoaded) return;

    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey, isLoaded]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  return {
    theme,
    toggleTheme,
    setTheme,
    isDark: theme === 'dark',
    isLoaded,
  };
}
