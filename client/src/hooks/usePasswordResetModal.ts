import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function usePasswordResetModal(
  setView: (view: "login" | "update-password" | "complete-profile") => void,
  setOpen: (open: boolean) => void
) {
  const searchParams = useSearchParams();
  const hasClearedResetQuery = useRef(false);

  useEffect(() => {
    const isResetLink =
      searchParams.get("reset_password") === "true" ||
      searchParams.get("modal") === "reset-password";

    if (isResetLink) {
      let cancelled = false;

      const openResetModal = async () => {
        setView("update-password");
        setOpen(true);

        if (hasClearedResetQuery.current) {
          return;
        }

        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (cancelled || !session) {
          return;
        }

        hasClearedResetQuery.current = true;

        const url = new URL(window.location.href);
        url.searchParams.delete("reset_password");
        url.searchParams.delete("modal");
        window.history.replaceState({}, "", url.pathname + url.search);
      };

      void openResetModal();

      return () => {
        cancelled = true;
      };
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
