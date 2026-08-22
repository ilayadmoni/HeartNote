"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { SPLASH_STORAGE_KEY } from "@/components/welcomeSplash/constants";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

export function useWelcomeSplash() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [isVisible, setIsVisible] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    if (!user || !profile) return;

    const shouldShow = sessionStorage.getItem(SPLASH_STORAGE_KEY);
    if (shouldShow !== "true") return;

    sessionStorage.removeItem(SPLASH_STORAGE_KEY);

    setFirstName(profile.firstName ?? "");
    setLastName(profile.lastName ?? "");
    setIsVisible(true);
  }, [user, profile]);

  useLockBodyScroll(isVisible);

  const dismiss = useCallback(() => {
    setIsVisible(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return { isVisible, firstName, lastName, dismiss };
}
