import { useEffect } from "react";

/**
 * Prevents background scroll when a modal/dialog is open.
 *
 * Strategy:
 * - Toggles `.scroll-locked` on `<html>` which applies `overflow: hidden !important`.
 * - Sets `overflow: hidden` on `<body>` as a belt-and-suspenders measure.
 * - For iOS Safari touch events: sets `touch-action: none` on `<body>`.
 *
 * Layout-shift prevention is handled by the dual-direction architecture:
 * `<html dir="ltr">` keeps the scrollbar on the right side, so hiding
 * overflow causes zero horizontal shift. No manual padding needed.
 *
 * Does NOT use `position: fixed` on body — that technique causes visible
 * scroll-jump artifacts because it breaks `sticky` header positioning and
 * requires scroll-position save/restore which flickers on repaint.
 */
let activeScrollLocks = 0;

let previousOverflow = "";
let previousTouchAction = "";

function applyScrollLock(): void {
  const html = document.documentElement;
  const body = document.body;

  previousOverflow = body.style.overflow;
  previousTouchAction = body.style.touchAction;

  html.classList.add("scroll-locked");
  body.style.overflow = "hidden";
  body.style.touchAction = "none";
}

function releaseScrollLock(): void {
  const html = document.documentElement;
  const body = document.body;

  html.classList.remove("scroll-locked");
  body.style.overflow = previousOverflow;
  body.style.touchAction = previousTouchAction;
}

export function useLockBodyScroll(isLocked: boolean): void {
  useEffect(() => {
    if (!isLocked) return;

    activeScrollLocks += 1;
    if (activeScrollLocks === 1) {
      applyScrollLock();
    }

    return () => {
      activeScrollLocks = Math.max(0, activeScrollLocks - 1);
      if (activeScrollLocks === 0) {
        releaseScrollLock();
      }
    };
  }, [isLocked]);
}
