"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { SlotMachineDesktop } from "./Desktop/SlotMachineDesktop";
import { SlotMachineMobile } from "./Mobile/SlotMachineMobile";
import type { TemplateComponentProps, SlotMachineData } from "../types";
import { DEFAULT_PRIMARY_COLOR } from "../types";

const INITIAL_TEXTS: [string, string, string] = ["לחצי", "כדי", "לגלות"];
const SPIN_ITERATIONS = 15;
const SPIN_INTERVAL_MS = 100;

export function SlotMachine({ data }: TemplateComponentProps<SlotMachineData>) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [mounted, setMounted] = useState(false);
  const [spinCount, setSpinCount] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [reelTexts, setReelTexts] = useState<[string, string, string]>(INITIAL_TEXTS);
  const [hasWon, setHasWon] = useState(false);

  const spinCountRef = useRef(0);
  const isSpinningRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const spinsRequired = data.spinsRequired ?? 3;
  const primaryColor = data.primaryColor ?? DEFAULT_PRIMARY_COLOR;

  const handleSpin = useCallback(() => {
    if (spinCountRef.current >= spinsRequired || isSpinningRef.current) return;

    isSpinningRef.current = true;
    setIsSpinning(true);

    const opts1 = data.reel1Options?.length ? data.reel1Options : ["לחצי"];
    const opts2 = data.reel2Options?.length ? data.reel2Options : ["כדי"];
    const opts3 = data.reel3Options?.length ? data.reel3Options : ["לגלות"];

    let iterations = 0;

    intervalRef.current = setInterval(() => {
      setReelTexts([
        opts1[Math.floor(Math.random() * opts1.length)],
        opts2[Math.floor(Math.random() * opts2.length)],
        opts3[Math.floor(Math.random() * opts3.length)],
      ]);
      iterations++;

      if (iterations > SPIN_ITERATIONS) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        isSpinningRef.current = false;
        setIsSpinning(false);

        spinCountRef.current += 1;
        const newCount = spinCountRef.current;
        setSpinCount(newCount);

        if (newCount >= spinsRequired) {
          setReelTexts([
            data.targetReel1 ?? opts1[0],
            data.targetReel2 ?? opts2[0],
            data.targetReel3 ?? opts3[0],
          ]);
          setHasWon(true);
        }
      }
    }, SPIN_INTERVAL_MS);
  }, [data, spinsRequired]);

  if (!mounted) return null;

  const sharedProps = {
    data,
    spinCount,
    isSpinning,
    reelTexts,
    hasWon,
    primaryColor,
    spinsRequired,
    onSpin: handleSpin,
  };

  return isMobile ? (
    <SlotMachineMobile {...sharedProps} />
  ) : (
    <SlotMachineDesktop {...sharedProps} />
  );
}
