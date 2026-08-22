import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export function usePasswordResetModal(
  setView: (view: "login" | "update-password" | "complete-profile") => void,
  setOpen: (open: boolean) => void
) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const isResetLink =
      searchParams.get("reset_password") === "true" ||
      searchParams.get("modal") === "reset-password";

    if (isResetLink) {
      setView("update-password");
      setOpen(true);
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
