"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "@/i18n/navigation";
import { STORY_STEPS, PROGRESS_INTERVAL } from "../constants/storySteps";

interface StorySequence {
  currentStep: number;
  progress: number;
  goToNext: () => void;
  goToPrevious: () => void;
  handleClose: () => void;
  handlePauseStart: () => void;
  handlePauseEnd: () => void;
}

/** Auto-advancing story timer with pause, keyboard and manual navigation. */
export function useStorySequence(): StorySequence {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const hasAdvancedRef = useRef(false);
  const progressRef = useRef(0);

  const goToNext = useCallback(() => {
    setCurrentStep((prevStep) => {
      if (prevStep < STORY_STEPS.length - 1) return prevStep + 1;
      router.push("/");
      return prevStep;
    });
    progressRef.current = 0;
    setProgress(0);
  }, [router]);

  const goToPrevious = useCallback(() => {
    setCurrentStep((prevStep) => (prevStep > 0 ? prevStep - 1 : prevStep));
    progressRef.current = 0;
    setProgress(0);
  }, []);

  const handleClose = useCallback(() => router.push("/"), [router]);

  useEffect(() => {
    const currentDuration = STORY_STEPS[currentStep].duration;
    const progressIncrement = (PROGRESS_INTERVAL / currentDuration) * 100;
    hasAdvancedRef.current = false;
    progressRef.current = 0;
    setProgress(0);

    const timer: ReturnType<typeof setInterval> = setInterval(() => {
      if (isPaused || hasAdvancedRef.current) return;
      const newProgress = progressRef.current + progressIncrement;

      if (newProgress >= 100) {
        hasAdvancedRef.current = true;
        progressRef.current = 0;
        setProgress(0);
        clearInterval(timer);
        goToNext();
        return;
      }

      progressRef.current = newProgress;
      setProgress(newProgress);
    }, PROGRESS_INTERVAL);

    return () => {
      hasAdvancedRef.current = true;
      clearInterval(timer);
    };
  }, [currentStep, isPaused, goToNext]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent): void => {
      if (e.key === "ArrowRight") goToPrevious();
      if (e.key === "ArrowLeft") goToNext();
      if (e.key === "Escape") router.push("/");
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [goToNext, goToPrevious, router]);

  return {
    currentStep,
    progress,
    goToNext,
    goToPrevious,
    handleClose,
    handlePauseStart: () => setIsPaused(true),
    handlePauseEnd: () => setIsPaused(false),
  };
}
