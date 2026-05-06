"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { SPLASH_STORAGE_KEY } from "@/components/welcomeSplash/constants";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

export function useWelcomeSplash() {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    if (!user) return;

    const shouldShow = sessionStorage.getItem(SPLASH_STORAGE_KEY);
    if (shouldShow !== "true") return;

    sessionStorage.removeItem(SPLASH_STORAGE_KEY);

    setFirstName(user.user_metadata?.first_name ?? "");
    setLastName(user.user_metadata?.last_name ?? "");
    setIsVisible(true);
  }, [user]);

  useLockBodyScroll(isVisible);

  const dismiss = useCallback(() => {
    setIsVisible(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return { isVisible, firstName, lastName, dismiss };
}
