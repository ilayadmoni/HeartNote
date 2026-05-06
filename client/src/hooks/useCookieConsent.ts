"use client";

import { useState, useEffect, useCallback } from "react";
import type { ConsentState, ConsentData } from "@/components/cookieBanner/types";
import {
  CONSENT_STORAGE_KEY,
  GRANTED_CONSENT,
  DENIED_CONSENT,
} from "@/components/cookieBanner/constants";

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

function pushConsentUpdate(consent: ConsentState): void {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("consent", "update", consent);
  }
}

function saveToStorage(consent: ConsentState): void {
  const data: ConsentData = {
    consent,
    timestamp: new Date().toISOString(),
  };
  localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(data));
}

export function useCookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);

    if (stored) {
      try {
        const data: ConsentData = JSON.parse(stored);
        pushConsentUpdate(data.consent);
      } catch {
        setIsVisible(true);
      }
    } else {
      setIsVisible(true);
    }

    setIsMounted(true);
  }, []);

  const acceptAll = useCallback(() => {
    pushConsentUpdate(GRANTED_CONSENT);
    saveToStorage(GRANTED_CONSENT);
    setIsVisible(false);
  }, []);

  const rejectAll = useCallback(() => {
    pushConsentUpdate(DENIED_CONSENT);
    saveToStorage(DENIED_CONSENT);
    setIsVisible(false);
  }, []);

  return { isVisible, isMounted, acceptAll, rejectAll };
}
