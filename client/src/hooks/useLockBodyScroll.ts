import { useEffect } from "react";

/**
 * Prevents background scroll when a modal/dialog is open.
 *
 * Strategy:
 * - Prevent background scrolling with the iOS-safe fixed-body technique.
 * - Preserve the current scroll position and restore it on cleanup.
 * - Keep the implementation reference-counted so nested dialogs do not fight.
 */
let activeScrollLocks = 0;

let previousOverflow = "";
let previousTouchAction = "";
let previousPosition = "";
let previousTop = "";
let previousWidth = "";
let lockedScrollY = 0;

function applyScrollLock(): void {
  const body = document.body;

  previousOverflow = body.style.overflow;
  previousTouchAction = body.style.touchAction;
  previousPosition = body.style.position;
  previousTop = body.style.top;
  previousWidth = body.style.width;
  lockedScrollY = window.scrollY;

  body.style.overflow = "hidden";
  body.style.position = "fixed";
  body.style.top = `-${lockedScrollY}px`;
  body.style.width = "100%";
  body.style.touchAction = "none";
}

function releaseScrollLock(): void {
  const body = document.body;

  body.style.overflow = previousOverflow;
  body.style.position = previousPosition;
  body.style.top = previousTop;
  body.style.width = previousWidth;
  body.style.touchAction = previousTouchAction;

  window.scrollTo({ top: lockedScrollY, behavior: "instant" });
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
