"use client";

/**
 * Theme Context
 * Provides theme state and actions to the component tree
 */

import { createContext, useContext } from "react";
import type { ThemeContextValue } from "../types";

export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined,
);

/**
 * Hook to access theme context
 * @throws Error if used outside of ThemeProvider
 */
export function useThemeContext(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }

  return context;
}
