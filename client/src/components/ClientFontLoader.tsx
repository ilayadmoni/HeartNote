"use client";

/**
 * ClientFontLoader — Hydration-Safe Client Gatekeeper
 *
 * Eliminates Flash of Unstyled Text (FOUT) on hard refresh without
 * causing React hydration mismatches.
 *
 * Strategy:
 *  1. SSR renders <Loading /> (children are never sent in the HTML).
 *  2. Client initial render (before useEffect) also returns <Loading />,
 *     so the hydrated tree matches the server HTML exactly — no mismatch.
 *  3. After hydration, a useEffect fires, waits for document.fonts.ready,
 *     then flips the gate open → children render for the first time.
 *
 * Because `ready` is initialised as `false` and only set to `true` inside
 * useEffect (which never runs on the server), the server and the first
 * client render always produce identical output.
 */

import { useState, useEffect, type ReactNode } from "react";
import Loading from "@/app/[locale]/(main)/loading";

export default function ClientFontLoader({
  children,
}: {
  children: ReactNode;
}) {
  // false on the server AND on the first client render → hydration matches
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // This runs only on the client, after hydration is complete
    let cancelled = false;

    document.fonts.ready
      .then(() => {
        if (!cancelled) setReady(true);
      })
      .catch(() => {
        // Never block rendering if the API fails
        if (!cancelled) setReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) {
    return <Loading />;
  }

  return <>{children}</>;
}
