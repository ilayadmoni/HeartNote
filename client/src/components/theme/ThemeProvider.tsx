"use client";

/**
 * Theme Provider
 * Wraps the application to provide theme context
 */

import type { ThemeProviderProps } from "./types";
import { ThemeContext } from "./context/ThemeContext";
import { useTheme } from "./hooks/useTheme";
import { THEME_STORAGE_KEY } from "./constants";

export function ThemeProvider({
  children,
  defaultTheme,
  storageKey = THEME_STORAGE_KEY,
}: ThemeProviderProps) {
  const { theme, toggleTheme, setTheme, isDark, isLoaded } =
    useTheme(storageKey);

  // Prevent flash of unstyled content
  if (!isLoaded) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        setTheme,
        isDark,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
