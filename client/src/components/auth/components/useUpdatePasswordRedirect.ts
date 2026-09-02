"use client";

import { useRef } from "react";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";

const CLOSE_THEN_NAVIGATE_DELAY_MS = 150;

/**
 * After a successful password update: close the modal, toast, force-clean
 * any lingering scroll-lock/aria-hidden artifacts, then route to /login.
 * Extracted from UpdatePasswordForm to keep it under the file-length cap.
 */
export function useUpdatePasswordRedirect(onComplete: () => void, successMessage: string) {
  const router = useRouter();
  const completedRef = useRef(false);

  return () => {
    if (completedRef.current) return;
    completedRef.current = true;

    onComplete();
    toast.success(successMessage, { duration: 3500 });

    window.setTimeout(() => {
      document.body.removeAttribute("data-scroll-locked");

      const rootElement = document.getElementById("__next") || document.body;
      rootElement.removeAttribute("aria-hidden");
      rootElement.removeAttribute("data-aria-hidden");

      const radixStyle = document.querySelector("[data-radix-scroll-prevent]");
      radixStyle?.remove();

      router.push("/login");
    }, CLOSE_THEN_NAVIGATE_DELAY_MS);
  };
}
