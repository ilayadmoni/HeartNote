"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ApologySearchDesktop } from "./Desktop/ApologySearchDesktop";
import { ApologySearchMobile } from "./Mobile/ApologySearchMobile";
import type { TemplateComponentProps, ApologySearchData } from "../types";
import { DEFAULT_PRIMARY_COLOR } from "../types";
import type { SearchPhase } from "./types";

export function ApologySearch({ data }: TemplateComponentProps<ApologySearchData>) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<SearchPhase>("idle");
  const [typedText, setTypedText] = useState("");
  const typingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const primaryColor = data.primaryColor ?? DEFAULT_PRIMARY_COLOR;
  const typingSpeedMs = data.typingSpeedMs ?? 80;

  useEffect(() => {
    setMounted(true);
    return () => {
      if (typingRef.current) clearInterval(typingRef.current);
    };
  }, []);

  const handleStart = useCallback(() => {
    setPhase("typing");
    setTypedText("");
    let i = 0;
    const query = data.searchQuery;
    typingRef.current = setInterval(() => {
      i += 1;
      setTypedText(query.slice(0, i));
      if (i >= query.length) {
        clearInterval(typingRef.current!);
        typingRef.current = null;
        setPhase("loading");
        setTimeout(() => setPhase("result"), 2000);
      }
    }, typingSpeedMs);
  }, [data.searchQuery, typingSpeedMs]);

  const handleReset = useCallback(() => {
    if (typingRef.current) {
      clearInterval(typingRef.current);
      typingRef.current = null;
    }
    setTypedText("");
    setPhase("idle");
  }, []);

  if (!mounted) return null;

  const sharedProps = {
    data,
    phase,
    typedText,
    primaryColor,
    onStart: handleStart,
    onReset: handleReset,
  };

  return isMobile ? (
    <ApologySearchMobile {...sharedProps} />
  ) : (
    <ApologySearchDesktop {...sharedProps} />
  );
}
