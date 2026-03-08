"use client";

/**
 * FontReadyGateway
 *
 * Optional extra safety layer (works alongside next/font optimization).
 * Removes the app-loading class once fonts are ready, allowing smooth
 * CSS transition from loading screen to content.
 *
 * Use this if you want explicit visual control over the transition,
 * or if you're tracking data dependencies alongside fonts.
 */

import { useEffect } from "react";

export default function FontReadyGateway({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    let cancelled = false;

    const removeClass = () => {
      if (!cancelled) {
        document.documentElement.classList.remove("app-loading");
      }
    };

    // Guaranteed safety timeout — always remove the class within 3s
    // This prevents the page from being permanently hidden if fonts/load stall
    const safetyTimer = setTimeout(removeClass, 3000);

    // Best-case: remove as soon as fonts + window load are both done
    // NOTE: "load" must be on window, not document (document never dispatches it)
    Promise.all([
      document.fonts.ready,
      document.readyState === "complete"
        ? Promise.resolve()
        : new Promise<void>((resolve) => {
            window.addEventListener("load", () => resolve(), { once: true });
          }),
    ])
      .then(removeClass)
      .catch(removeClass); // even on failure, reveal the page

    return () => {
      cancelled = true;
      clearTimeout(safetyTimer);
    };
  }, []);

  return <>{children}</>;
}
