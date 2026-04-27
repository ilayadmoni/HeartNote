"use client";

import { useEffect, useState } from "react";

/**
 * Flips to `true` after `delayMs` of continuous loading.
 * Resets immediately when loading finishes.
 */
export function useSafeModeTimeout(isLoading: boolean, delayMs = 5000): boolean {
  const [tripped, setTripped] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setTripped(false);
      return;
    }
    const t = setTimeout(() => {
      console.warn(
        `[MOBILE-DEBUG] Safe-mode timeout (${delayMs}ms) — loading did not finish`,
      );
      setTripped(true);
    }, delayMs);
    return () => clearTimeout(t);
  }, [isLoading, delayMs]);

  return tripped;
}
