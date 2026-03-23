"use client";

import { useState, useEffect, useCallback } from "react";
import type { ConsentState, ConsentData } from "../types";
import {
  CONSENT_STORAGE_KEY,
  GRANTED_CONSENT,
  DENIED_CONSENT,
} from "../constants";

/* ------------------------------------------------------------------ */
/*  Extend Window for Google's dataLayer / gtag globals                */
/* ------------------------------------------------------------------ */
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Push a consent update to the dataLayer via gtag */
function pushConsentUpdate(consent: ConsentState): void {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("consent", "update", consent);
  }
}

/** Persist the consent choice in localStorage */
function saveToStorage(consent: ConsentState): void {
  const data: ConsentData = {
    consent,
    timestamp: new Date().toISOString(),
  };
  localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(data));
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export function useCookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  /* On first client render, check for an existing consent choice */
  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);

    if (stored) {
      try {
        const data: ConsentData = JSON.parse(stored);
        pushConsentUpdate(data.consent);
      } catch {
        // Corrupted data — show banner again
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
