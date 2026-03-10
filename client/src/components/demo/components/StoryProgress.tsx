"use client";

/**
 * StoryProgress Component
 * Instagram-style progress bars for story navigation
 */

interface StoryProgressProps {
  totalSteps: number;
  currentStep: number;
  progress: number;
}

export function StoryProgress({ totalSteps, currentStep, progress }: StoryProgressProps) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
        >
          <div
            className="h-full bg-white transition-all duration-300 ease-linear rounded-full"
            style={{
              width:
                index < currentStep
                  ? "100%"
                  : index === currentStep
                  ? `${progress}%`
                  : "0%",
            }}
          />
        </div>
      ))}
    </div>
  );
}
