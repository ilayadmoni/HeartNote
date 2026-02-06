/**
 * Accessibility Constants
 * ARIA labels and keyboard navigation constants
 */

// Skip Link Targets
export const SKIP_LINKS = [
  { id: "main-content", label: "דלג לתוכן הראשי" },
  { id: "main-navigation", label: "דלג לניווט" },
  { id: "footer", label: "דלג לתחתית" },
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
  DEFAULT: "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4826f]",
  INSET: "focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#d4826f]",
} as const;
