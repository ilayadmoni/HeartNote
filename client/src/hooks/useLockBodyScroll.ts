import { useEffect } from "react";

/**
 * Prevents background scroll when a modal/dialog is open.
 *
 * Strategy:
 * - Toggles `.scroll-locked` on `<html>` which uses `!important` to override
 *   the `overflow-y: scroll` rule from `scrollbar.css`.
 * - Sets `overflow: hidden` on `<body>` as a belt-and-suspenders measure.
 * - For iOS Safari touch events: sets `touch-action: none` on `<body>`.
 *
 * Does NOT use `position: fixed` on body — that technique causes visible
 * scroll-jump artifacts because it breaks `sticky` header positioning and
 * requires scroll-position save/restore which flickers on repaint.
 */
export function useLockBodyScroll(isLocked: boolean): void {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    if (isLocked) {
      // Toggle the CSS class that uses !important to beat scrollbar.css specificity
      html.classList.add("scroll-locked");
      body.style.overflow = "hidden";
      // iOS Safari: prevent touch-scroll on the body
      body.style.touchAction = "none";
    } else {
      html.classList.remove("scroll-locked");
      body.style.overflow = "";
      body.style.touchAction = "";
    }

    return () => {
      html.classList.remove("scroll-locked");
      body.style.overflow = "";
      body.style.touchAction = "";
    };
  }, [isLocked]);
}
