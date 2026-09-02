"use client";

/**
 * StoryDemo Component
 * Instagram-style interactive demo with auto-advance and direction-aware navigation.
 */

import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { StoryProgress } from "./components/StoryProgress";
import { Step1Animation } from "./components/Step1Animation";
import { Step2Animation } from "./components/Step2Animation";
import { Step3Animation } from "./components/Step3Animation";
import { Step4Animation } from "./components/Step4Animation";
import { STORY_STEPS } from "./constants/storySteps";
import { useStorySequence } from "./hooks/useStorySequence";

const STEP_COMPONENTS = [Step1Animation, Step2Animation, Step3Animation, Step4Animation];

export function StoryDemo(): JSX.Element {
  const t = useTranslations("demo");
  const {
    currentStep,
    progress,
    goToNext,
    goToPrevious,
    handleClose,
    handlePauseStart,
    handlePauseEnd,
  } = useStorySequence();

  const stepId = STORY_STEPS[currentStep].id;
  const StepContent = STEP_COMPONENTS[currentStep];

  return (
    <div className="fixed inset-0 z-50 bg-ink/90 backdrop-blur-sm flex items-center justify-center p-0 sm:p-6">
      <div className="relative w-full h-full sm:w-[420px] sm:h-[800px] sm:max-h-[85vh] overflow-visible">
        <button
          onClick={handleClose}
          className="hidden sm:block absolute sm:-top-7 sm:-end-96 z-[80] text-white/90 hover:text-white bg-black/30 hover:bg-black/50 p-2 rounded-pill backdrop-blur-sm transition-colors"
          aria-label={t("nav.close")}
        >
          <X size={18} />
        </button>

        <div className="relative w-full h-full bg-surface sm:rounded-card overflow-hidden shadow-lift flex flex-col">
          <div className="absolute top-0 inset-x-0 z-30 pt-5 px-4 bg-gradient-to-b from-black/60 via-black/20 to-transparent pb-10 pointer-events-none">
            <StoryProgress totalSteps={STORY_STEPS.length} currentStep={currentStep} progress={progress} />
            <div className="mt-4 text-center flex flex-col items-center gap-1.5">
              <h2 className="text-white text-title-lg leading-tight">{t(`steps.step${stepId}.title`)}</h2>
              <p className="text-white/90 text-body-md leading-snug px-4">{t(`steps.step${stepId}.description`)}</p>
            </div>
          </div>

          <button
            onClick={goToPrevious}
            disabled={currentStep === 0}
            className="absolute start-0 top-0 bottom-0 w-1/3 z-40 cursor-pointer disabled:cursor-not-allowed bg-transparent"
            aria-label={t("nav.previous")}
          />
          <button
            onClick={goToNext}
            className="absolute end-0 top-0 bottom-0 w-1/3 z-40 cursor-pointer bg-transparent"
            aria-label={t("nav.next")}
          />

          <div
            className="flex-1 relative overflow-hidden bg-surface-sunken select-none pt-28 sm:pt-32"
            onPointerDown={handlePauseStart}
            onPointerUp={handlePauseEnd}
            onPointerLeave={handlePauseEnd}
          >
            <div key={currentStep} className="absolute inset-0 top-28 sm:top-32 flex items-center justify-center text-center pb-8">
              <StepContent />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
