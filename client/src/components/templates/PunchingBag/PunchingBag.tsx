"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { PunchingBagDesktop } from "./Desktop/PunchingBagDesktop";
import { PunchingBagMobile } from "./Mobile/PunchingBagMobile";
import type { TemplateComponentProps, PunchingBagData } from "../types";
import { DEFAULT_PRIMARY_COLOR } from "../types";

export function PunchingBag({ data }: TemplateComponentProps<PunchingBagData>) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [mounted, setMounted] = useState(false);
  const [hits, setHits] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [isTilting, setIsTilting] = useState(false);
  const tiltTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (tiltTimeoutRef.current) clearTimeout(tiltTimeoutRef.current);
    };
  }, []);

  const hitsRequired = data.hitsRequired ?? 5;
  const bagColor = data.bagColor ?? "#d4826f";
  const primaryColor = data.primaryColor ?? DEFAULT_PRIMARY_COLOR;

  const handleHit = useCallback(() => {
    if (isDone) return;

    setHits((prev) => {
      if (prev >= hitsRequired) return prev;
      const next = prev + 1;
      if (next >= hitsRequired) {
        setTimeout(() => setIsDone(true), 350);
      }
      return next;
    });

    setIsTilting(true);
    if (tiltTimeoutRef.current) clearTimeout(tiltTimeoutRef.current);
    tiltTimeoutRef.current = setTimeout(() => setIsTilting(false), 400);
  }, [isDone, hitsRequired]);

  const handleReset = useCallback(() => {
    setHits(0);
    setIsDone(false);
    setIsTilting(false);
  }, []);

  if (!mounted) return null;

  const sharedProps = {
    data,
    hits,
    hitsRequired,
    isDone,
    isTilting,
    bagColor,
    primaryColor,
    onHit: handleHit,
    onReset: handleReset,
  };

  return isMobile ? (
    <PunchingBagMobile {...sharedProps} />
  ) : (
    <PunchingBagDesktop {...sharedProps} />
  );
}
