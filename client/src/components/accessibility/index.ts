/**
 * Accessibility Module Barrel Export
 */

export * from "./components";
export * from "./constants";
export * from "./types";
export { 
  AccessibilityProvider, 
  useAccessibility,
  useReducedMotion,
  type AccessibilitySettings,
  type AccessibilityContextValue,
} from "./AccessibilityProvider";
export * from "./AccessibilityWidget";
