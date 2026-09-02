"use client";

/**
 * StoryDemo Component
 * Instagram-style interactive demo with auto-advance and RTL navigation
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "@/i18n/navigation";
import { X } from "lucide-react";
import { StoryProgress } from "./components/StoryProgress";
import { Step1Animation } from "./components/Step1Animation";
import { Step2Animation } from "./components/Step2Animation";
import { Step3Animation } from "./components/Step3Animation";
import { Step4Animation } from "./components/Step4Animation";

const storySteps = [
  {
    id: 1,
    title: "1. בוחרים תבנית",
    description: "מתוך גלריית תבניות אינטראקטיביות",
    cardContent: <Step1Animation />,
    duration: 5000,
  },
  {
    id: 2,
    title: "2. עורכים אישית",
    description: "משנים טקסט וצבעים בקלות",
    cardContent: <Step2Animation />,
    duration: 8500,
  },
  {
    id: 3,
    title: "3. יוצרים את התבנית",
    description: "רואים בדיוק איך זה ייראה",
    cardContent: <Step3Animation />,
    duration: 6000,
  },
  {
    id: 4,
    title: "4. מפיצים למי שאוהבים",
    description: "שולחים בקליק בוואטסאפ או בקישור",
    cardContent: <Step4Animation />,
    duration: 8500,
  },
];

const PROGRESS_INTERVAL = 50; // Update progress every 50ms

export function StoryDemo() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const hasAdvancedRef = useRef(false);
  const progressRef = useRef(0);

  // Single source of truth for forward navigation
  const goToNext = useCallback(() => {
    setCurrentStep((prevStep) => {
      if (prevStep < storySteps.length - 1) {
        return prevStep + 1;
      }

      // Last slide - exit to home
      router.push("/");
      return prevStep;
    });
    progressRef.current = 0;
    setProgress(0);
  }, [router]);

  const goToPrevious = useCallback(() => {
    setCurrentStep((prevStep) => {
      if (prevStep > 0) {
        return prevStep - 1;
      }
      return prevStep;
    });
    progressRef.current = 0;
    setProgress(0);
  }, []);

  // Auto-advance logic with auto-exit on last slide
  useEffect(() => {
    const currentDuration = storySteps[currentStep].duration;
    const progressIncrement = (PROGRESS_INTERVAL / currentDuration) * 100;
    hasAdvancedRef.current = false;
    progressRef.current = 0;
    setProgress(0);
    let timer: ReturnType<typeof setInterval> | undefined;

    timer = setInterval(() => {
      // Skip progress update while paused
      if (isPaused || hasAdvancedRef.current) return;

      // Keep timer progression in refs so navigation isn't triggered from a state updater callback.
      const newProgress = progressRef.current + progressIncrement;

      if (newProgress >= 100) {
        hasAdvancedRef.current = true;
        progressRef.current = 0;
        setProgress(0);
        if (timer) clearInterval(timer);
        goToNext();
        return;
      }

      progressRef.current = newProgress;
      setProgress(newProgress);
    }, PROGRESS_INTERVAL);

    return () => {
      hasAdvancedRef.current = true;
      if (timer) clearInterval(timer);
    };
  }, [currentStep, isPaused, goToNext]);

  // RTL Navigation zones (left = next, right = previous)
  const handleLeftClick = () => goToNext();
  const handleRightClick = () => goToPrevious();

  // Close and return home
  const handleClose = () => {
    router.push("/");
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goToPrevious();
      if (e.key === "ArrowLeft") goToNext();
      if (e.key === "Escape") router.push("/");
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [goToNext, goToPrevious, router]);

  // Pause/Resume handlers for Instagram-style touch hold
  const handlePauseStart = () => setIsPaused(true);
  const handlePauseEnd = () => setIsPaused(false);

  return (
    <div
      className="fixed inset-0 z-50 bg-[#1c2636]/95 backdrop-blur-sm flex items-center justify-center p-0 sm:p-6"
      dir="rtl"
    >
      <div className="relative w-full h-full sm:w-[420px] sm:h-[800px] sm:max-h-[85vh] overflow-visible">
        {/* Close Button (outside frame - desktop only) */}
        <button
          onClick={handleClose}
          className="hidden sm:block absolute sm:-top-7 sm:-left-96 z-[80] text-white/90 hover:text-white bg-black/30 hover:bg-black/50 p-2 rounded-full backdrop-blur-sm transition-all shadow-sm"
          aria-label="סגור"
        >
          <X size={18} />
        </button>

        {/* Clean Rectangular Container */}
        <div className="relative w-full h-full bg-white sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col">
          {/* Top Gradient for Progress Bars visibility */}
          <div className="absolute top-0 left-0 right-0 z-30 pt-5 px-4 bg-gradient-to-b from-black/60 via-black/20 to-transparent pb-10 pointer-events-none">
            <StoryProgress
              totalSteps={storySteps.length}
              currentStep={currentStep}
              progress={progress}
            />
            <div className="mt-4 text-center flex flex-col items-center gap-1.5">
              <h2 className="text-[#252d3b] text-xl sm:text-2xl text-hebrew-heading leading-tight tracking-wide">
                {storySteps[currentStep].title}
              </h2>
              <p className="text-[#252d3b] text-base sm:text-lg text-hebrew-heading leading-snug px-4">
                {storySteps[currentStep].description}
              </p>
            </div>
          </div>

          {/* Invisible Touch/Click zones for Left/Right navigation */}
          <button
            onClick={handleRightClick}
            disabled={currentStep === 0}
            className="absolute right-0 top-0 bottom-0 w-1/3 z-40 cursor-pointer disabled:cursor-not-allowed"
            aria-label="הקודם"
            style={{ background: "transparent" }}
          />
          <button
            onClick={handleLeftClick}
            className="absolute left-0 top-0 bottom-0 w-1/3 z-40 cursor-pointer"
            aria-label="הבא"
            style={{ background: "transparent" }}
          />

          {/* Main Slide Content Wrapper */}
          <div
            className="flex-1 relative overflow-hidden bg-[#faf9f6] select-none pt-28 sm:pt-32"
            onPointerDown={handlePauseStart}
            onPointerUp={handlePauseEnd}
            onPointerLeave={handlePauseEnd}
          >
            <div
              key={currentStep}
              className="absolute inset-0 top-28 sm:top-32 flex items-center justify-center text-center pb-8"
            >
              {storySteps[currentStep].cardContent}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
