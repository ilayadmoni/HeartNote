"use client";

/**
 * useWelcomeSplash Hook
 * Manages splash screen visibility via sessionStorage flag.
 * Dismissal is driven by the progress bar calling `dismiss()`.
 */

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { SPLASH_STORAGE_KEY } from "../constants";

export function useWelcomeSplash() {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // Check for the splash trigger flag when user state changes
  useEffect(() => {
    if (!user) return;

    const shouldShow = sessionStorage.getItem(SPLASH_STORAGE_KEY);
    if (shouldShow !== "true") return;

    sessionStorage.removeItem(SPLASH_STORAGE_KEY);

    setFirstName(user.user_metadata?.first_name ?? "");
    setLastName(user.user_metadata?.last_name ?? "");
    setIsVisible(true);
  }, [user]);

  // Lock body scroll while visible
  useEffect(() => {
    if (!isVisible) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [isVisible]);

  /** Called by the progress bar when it reaches 100% */
  const dismiss = useCallback(() => {
    setIsVisible(false);
    // Smooth-scroll to top after splash completes
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return { isVisible, firstName, lastName, dismiss };
}
