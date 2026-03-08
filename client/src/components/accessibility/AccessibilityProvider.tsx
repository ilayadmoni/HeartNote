"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type AccessibilitySettings = {
  fontScale: number;
  highContrast: boolean;
  grayscale: boolean;
  highlightLinks: boolean;
  readableFont: boolean;
  stopAnimations: boolean;
};

export type AccessibilityContextValue = {
  settings: AccessibilitySettings;
  increaseText: () => void;
  decreaseText: () => void;
  toggleHighContrast: () => void;
  toggleGrayscale: () => void;
  toggleHighlightLinks: () => void;
  toggleReadableFont: () => void;
  toggleStopAnimations: () => void;
  reset: () => void;
};

const STORAGE_KEY = "hn_a11y_settings";
const DEFAULT_SETTINGS: AccessibilitySettings = {
  fontScale: 1,
  highContrast: false,
  grayscale: false,
  highlightLinks: false,
  readableFont: false,
  stopAnimations: false,
};

const MIN_SCALE = 0.85;
const MAX_SCALE = 1.3;
const STEP = 0.05;

const AccessibilityContext = createContext<
  AccessibilityContextValue | undefined
>(undefined);

function clampScale(value: number) {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, value));
}

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] =
    useState<AccessibilitySettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as AccessibilitySettings;
      setSettings({
        ...DEFAULT_SETTINGS,
        ...parsed,
        fontScale: clampScale(Number(parsed.fontScale ?? 1)),
      });
    } catch {
      // Ignore invalid storage content
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--a11y-font-scale", settings.fontScale.toString());

    root.classList.toggle("a11y-high-contrast", settings.highContrast);
    root.classList.toggle("a11y-grayscale", settings.grayscale);
    root.classList.toggle("a11y-highlight-links", settings.highlightLinks);
    root.classList.toggle("a11y-readable-font", settings.readableFont);
    root.classList.toggle("a11y-stop-animations", settings.stopAnimations);

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Ignore storage errors (private mode, quota)
    }
  }, [settings]);

  const increaseText = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      fontScale: clampScale(prev.fontScale + STEP),
    }));
  }, []);

  const decreaseText = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      fontScale: clampScale(prev.fontScale - STEP),
    }));
  }, []);

  const toggleHighContrast = useCallback(() => {
    setSettings((prev) => ({ ...prev, highContrast: !prev.highContrast }));
  }, []);

  const toggleGrayscale = useCallback(() => {
    setSettings((prev) => ({ ...prev, grayscale: !prev.grayscale }));
  }, []);

  const toggleHighlightLinks = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      highlightLinks: !prev.highlightLinks,
    }));
  }, []);

  const toggleReadableFont = useCallback(() => {
    setSettings((prev) => ({ ...prev, readableFont: !prev.readableFont }));
  }, []);

  const toggleStopAnimations = useCallback(() => {
    setSettings((prev) => ({ ...prev, stopAnimations: !prev.stopAnimations }));
  }, []);

  const reset = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  const value = useMemo<AccessibilityContextValue>(
    () => ({
      settings,
      increaseText,
      decreaseText,
      toggleHighContrast,
      toggleGrayscale,
      toggleHighlightLinks,
      toggleReadableFont,
      toggleStopAnimations,
      reset,
    }),
    [
      settings,
      increaseText,
      decreaseText,
      toggleHighContrast,
      toggleGrayscale,
      toggleHighlightLinks,
      toggleReadableFont,
      toggleStopAnimations,
      reset,
    ],
  );

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error(
      "useAccessibility must be used within AccessibilityProvider",
    );
  }
  return context;
}
