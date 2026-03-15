import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

/**
 * usePasswordResetModal Hook
 * Handles auto-opening the password reset modal from URL params
 */
export function usePasswordResetModal(
  setView: (view: "login" | "update-password" | "complete-profile") => void,
  setOpen: (open: boolean) => void
) {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (
      searchParams.get("reset_password") === "true" ||
      searchParams.get("modal") === "reset-password"
    ) {
      setView("update-password");
      setOpen(true);
      // Clean URL without navigation
      const url = new URL(window.location.href);
      url.searchParams.delete("reset_password");
      url.searchParams.delete("modal");
      window.history.replaceState({}, "", url.pathname + url.search);
      return;
    }

    if (searchParams.get("modal") === "complete-profile") {
      setView("complete-profile");
      setOpen(true);
      const url = new URL(window.location.href);
      url.searchParams.delete("modal");
      window.history.replaceState({}, "", url.pathname + url.search);
    }
  }, [searchParams, setView, setOpen]);
}
