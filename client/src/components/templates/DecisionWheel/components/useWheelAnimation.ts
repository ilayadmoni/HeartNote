"use client";

import { useCallback, useState } from "react";
import { useMotionValue, animate } from "framer-motion";
import confetti from "canvas-confetti";
import { SEGMENT_COLORS } from "./wheelDrawing";

interface UseWheelAnimationOptions {
  options: string[];
  onResult?: (winner: string) => void;
}

export function useWheelAnimation({ options, onResult }: UseWheelAnimationOptions) {
  const rotation = useMotionValue(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  const segCount = options.length || 1;
  const segAngle = 360 / segCount;

  const handleSpin = useCallback(() => {
    if (spinning || segCount < 2) return;
    setSpinning(true);
    setWinner(null);

    const targetSegment = Math.floor(Math.random() * segCount);
    const segmentCenterOffset = targetSegment * segAngle + segAngle / 2;
    const desiredMod = (360 - segmentCenterOffset + 360) % 360;

    const start = rotation.get();
    const currentMod = ((start % 360) + 360) % 360;
    let delta = desiredMod - currentMod;
    if (delta < 0) delta += 360;

    const extraRotations = 5 + Math.random() * 3;
    const targetAngle = 360 * Math.floor(extraRotations) + delta;

    animate(rotation, start + targetAngle, {
      duration: 4,
      ease: [0.15, 0.85, 0.25, 1],
      onComplete: () => {
        const winnerText = options[targetSegment];
        setWinner(winnerText);
        setSpinning(false);
        onResult?.(winnerText);

        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.5 },
          colors: SEGMENT_COLORS.slice(0, 4),
        });
      },
    });
  }, [spinning, segCount, segAngle, rotation, options, onResult]);

  return { rotation, spinning, winner, handleSpin };
}
