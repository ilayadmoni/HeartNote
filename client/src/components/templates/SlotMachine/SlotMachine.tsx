"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { SlotMachineDesktop } from "./Desktop/SlotMachineDesktop";
import { SlotMachineMobile } from "./Mobile/SlotMachineMobile";
import type { TemplateComponentProps, SlotMachineData } from "../types";
import { DEFAULT_PRIMARY_COLOR } from "../types";

const SPIN_ITERATIONS = 15;
const SPIN_INTERVAL_MS = 100;
const REEL_STOP_STAGGER_MS = 300;

export function SlotMachine({ data }: TemplateComponentProps<SlotMachineData>) {
  const t = useTranslations("templates");
  const initialTexts = useMemo<[string, string, string]>(
    () => [t("slotMachine.reelDefault1"), t("slotMachine.reelDefault2"), t("slotMachine.reelDefault3")],
    [t],
  );
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [mounted, setMounted] = useState(false);
  const [spinCount, setSpinCount] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [reelTexts, setReelTexts] = useState<[string, string, string]>(initialTexts);
  const [hasWon, setHasWon] = useState(false);

  const spinCountRef = useRef(0);
  const isSpinningRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stopTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearStopTimeouts = useCallback(() => {
    stopTimeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
    stopTimeoutsRef.current = [];
  }, []);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      clearStopTimeouts();
    };
  }, [clearStopTimeouts]);

  const spinsRequired = data.spinsRequired ?? 3;
  const primaryColor = data.primaryColor ?? DEFAULT_PRIMARY_COLOR;

  const handleReset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    clearStopTimeouts();
    spinCountRef.current = 0;
    isSpinningRef.current = false;
    setSpinCount(0);
    setIsSpinning(false);
    setReelTexts(initialTexts);
    setHasWon(false);
  }, [initialTexts, clearStopTimeouts]);

  const handleSpin = useCallback(() => {
    if (spinCountRef.current >= spinsRequired || isSpinningRef.current) return;

    isSpinningRef.current = true;
    setIsSpinning(true);

    const opts1 = data.reel1Options?.length ? data.reel1Options : [t("slotMachine.reelDefault1")];
    const opts2 = data.reel2Options?.length ? data.reel2Options : [t("slotMachine.reelDefault2")];
    const opts3 = data.reel3Options?.length ? data.reel3Options : [t("slotMachine.reelDefault3")];

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
          const finalTexts: [string, string, string] = [
            data.targetReel1 ?? opts1[0],
            data.targetReel2 ?? opts2[0],
            data.targetReel3 ?? opts3[0],
          ];

          clearStopTimeouts();
          stopTimeoutsRef.current.push(
            setTimeout(() => {
              setReelTexts((prev) => [finalTexts[0], prev[1], prev[2]]);
            }, 0),
          );
          stopTimeoutsRef.current.push(
            setTimeout(() => {
              setReelTexts((prev) => [prev[0], finalTexts[1], prev[2]]);
            }, REEL_STOP_STAGGER_MS),
          );
          stopTimeoutsRef.current.push(
            setTimeout(() => {
              setReelTexts((prev) => [prev[0], prev[1], finalTexts[2]]);
              setHasWon(true);
            }, REEL_STOP_STAGGER_MS * 2),
          );
        }
      }
    }, SPIN_INTERVAL_MS);
  }, [data, spinsRequired, t, clearStopTimeouts]);

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
    onReset: handleReset,
  };

  return isMobile ? (
    <SlotMachineMobile {...sharedProps} />
  ) : (
    <SlotMachineDesktop {...sharedProps} />
  );
}
