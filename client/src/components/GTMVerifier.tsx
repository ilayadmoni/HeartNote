"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { pushToDataLayer } from "@/utils/gtm";

/**
 * GTMVerifier
 *
 * Placed in layout.tsx to catch server-side email verifications
 * and properly transmit them to the React client context for GTM firing.
 */
export function GTMVerifier() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get("verified") === "true") {
      // Fire the strict typed sign_up event configured for email verifications
      pushToDataLayer({ event: "sign_up", method: "email" });

      // Clean up the URL to prevent double-firing on manual browser refresh
      const url = new URL(window.location.href);
      url.searchParams.delete("verified");
      router.replace(url.pathname + url.search, { scroll: false });
    }
  }, [searchParams, router]);

  return null;
}

import { Suspense } from "react";

export default function GTMVerifierWrapper() {
  return (
    <Suspense fallback={null}>
      <GTMVerifier />
    </Suspense>
  );
}
