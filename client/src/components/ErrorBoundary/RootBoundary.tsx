"use client";

import type { ReactNode } from "react";
import { MobileErrorBoundary } from "./MobileErrorBoundary";

/**
 * Top-level boundary for the root layout. Catches hydration / render
 * crashes inside any provider (Theme, Auth, Query, FontReadyGateway,
 * CookieBanner, ...) and shows a debug-friendly view that exposes
 * `error.message` and `error.stack` on screen — so we can screenshot
 * the failing line on a physical iPhone instead of seeing a blank page.
 *
 * Uses MobileErrorBoundary's default fallback (no `fallback` prop) so
 * the full diagnostic UI is rendered.
 */
export function RootBoundary({ children }: { children: ReactNode }) {
  return (
    <MobileErrorBoundary scope="RootLayout">{children}</MobileErrorBoundary>
  );
}
