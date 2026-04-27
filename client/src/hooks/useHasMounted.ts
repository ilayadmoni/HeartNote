"use client";

/**
 * useHasMounted — Hydration Guard
 * Returns false on server and client initial render (before hydration).
 * Returns true after client hydration is complete.
 *
 * Prevents hydration mismatches and flash of unstyled/uninitialized content.
 */

import { useState, useEffect } from "react";

export function useHasMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
