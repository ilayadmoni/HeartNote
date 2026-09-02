/**
 * Accessibility Constants
 * ARIA labels and keyboard navigation constants
 */

// Skip Link Targets — labels resolve through common.a11y.<labelKey>
export const SKIP_LINKS = [
  { id: "main-content", labelKey: "skipToContent" },
  { id: "main-navigation", labelKey: "skipToNav" },
  { id: "footer", labelKey: "skipToFooter" },
] as const;

// Keyboard Keys
export const KEYS = {
  ESCAPE: "Escape",
  ENTER: "Enter",
  SPACE: " ",
  TAB: "Tab",
  ARROW_UP: "ArrowUp",
  ARROW_DOWN: "ArrowDown",
  ARROW_LEFT: "ArrowLeft",
  ARROW_RIGHT: "ArrowRight",
  HOME: "Home",
  END: "End",
} as const;

// Focus outline styles
export const FOCUS_STYLES = {
  DEFAULT: "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
  INSET: "focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-accent",
} as const;
