"use client";

/**
 * FocusTrap Component
 * Traps focus within a container (useful for modals, dialogs)
 */

import { useEffect, useRef, useCallback } from "react";
import type { FocusTrapProps } from "../types";
import { KEYS } from "../constants";

export function FocusTrap({ children, active, onEscape }: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<Element | null>(null);

  // Get all focusable elements within the container
  const getFocusableElements = useCallback(() => {
    if (!containerRef.current) return [];

    const focusableSelectors = [
      "a[href]",
      "button:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      '[tabindex]:not([tabindex="-1"])',
    ].join(", ");

    return Array.from(
      containerRef.current.querySelectorAll<HTMLElement>(focusableSelectors),
    );
  }, []);

  // Handle tab key navigation
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!active) return;

      if (event.key === KEYS.ESCAPE && onEscape) {
        event.preventDefault();
        onEscape();
        return;
      }

      if (event.key !== KEYS.TAB) return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // Shift + Tab on first element -> focus last element
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
      // Tab on last element -> focus first element
      else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    },
    [active, onEscape, getFocusableElements],
  );

  useEffect(() => {
    if (active) {
      // Store the previously focused element
      previousActiveElement.current = document.activeElement;

      // Focus the first focusable element
      const focusableElements = getFocusableElements();
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }

      // Add event listener
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      // Restore focus to the previously focused element
      if (active && previousActiveElement.current instanceof HTMLElement) {
        previousActiveElement.current.focus();
      }
    };
  }, [active, handleKeyDown, getFocusableElements]);

  return (
    <div ref={containerRef} role="dialog" aria-modal={active}>
      {children}
    </div>
  );
}
