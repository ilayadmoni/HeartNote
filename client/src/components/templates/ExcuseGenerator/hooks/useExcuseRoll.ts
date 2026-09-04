import { useRef, useState } from "react";
import { useAnimationControls } from "framer-motion";

const ROLL_INTERVALS = [60, 60, 80, 110, 160, 240, 350];
const TOTAL_ROLL_DURATION = ROLL_INTERVALS.reduce((sum, ms) => sum + ms, 0) / 1000;

export function useExcuseRoll(excuses: string[]) {
  const [displayText, setDisplayText] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const cogControls = useAnimationControls();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function pickRandom() {
    return excuses[Math.floor(Math.random() * excuses.length)];
  }

  function scheduleTick(step: number) {
    if (step >= ROLL_INTERVALS.length) {
      setDisplayText(pickRandom());
      setGenerating(false);
      return;
    }
    timeoutRef.current = setTimeout(() => {
      setDisplayText(pickRandom());
      scheduleTick(step + 1);
    }, ROLL_INTERVALS[step]);
  }

  function generateExcuse() {
    if (generating) return;
    setGenerating(true);
    cogControls.start({
      rotate: 360 * 4,
      transition: { duration: TOTAL_ROLL_DURATION, ease: "easeOut" },
    });
    scheduleTick(0);
  }

  return { displayText, generating, cogControls, generateExcuse };
}
