"use client";

import { useState, useCallback, useEffect } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { BirthdayCandlesDesktop } from "./Desktop/BirthdayCandlesDesktop";
import { BirthdayCandlesMobile } from "./Mobile/BirthdayCandlesMobile";
import type { TemplateComponentProps, BirthdayCandlesData } from "../types";
import { DEFAULT_PRIMARY_COLOR } from "../types";

export function BirthdayCandles({ data }: TemplateComponentProps<BirthdayCandlesData>) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [mounted, setMounted] = useState(false);

  const candleCount = Math.min(Math.max(Number(data.candleCount) || 3, 1), 10);

  const [litCandles, setLitCandles] = useState<boolean[]>(() =>
    Array(candleCount).fill(true)
  );
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setLitCandles(Array(candleCount).fill(true));
    setIsDone(false);
  }, [candleCount]);

  const cakeColor = data.cakeColor ?? "#d4826f";
  const flameColor = data.flameColor ?? "#ffde59";
  const primaryColor = data.primaryColor ?? DEFAULT_PRIMARY_COLOR;

  const handleBlow = useCallback(
    (index: number) => {
      if (isDone) return;
      setLitCandles((prev) => {
        const next = [...prev];
        next[index] = false;
        if (next.every((lit) => !lit)) {
          setTimeout(() => setIsDone(true), 400);
        }
        return next;
      });
    },
    [isDone]
  );

  const handleRelight = useCallback(() => {
    setLitCandles(Array(candleCount).fill(true));
    setIsDone(false);
  }, [candleCount]);

  if (!mounted) return null;

  const sharedProps = {
    data,
    litCandles,
    isDone,
    candleCount,
    cakeColor,
    flameColor,
    primaryColor,
    onBlow: handleBlow,
    onRelight: handleRelight,
  };

  return isMobile ? (
    <BirthdayCandlesMobile {...sharedProps} />
  ) : (
    <BirthdayCandlesDesktop {...sharedProps} />
  );
}
