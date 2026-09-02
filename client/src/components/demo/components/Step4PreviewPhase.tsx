"use client";

import { Step4Card } from "./Step4Card";

export function Step4PreviewPhase(): JSX.Element {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center pt-4 sm:pt-8 pb-4 sm:pb-8 relative">
      <Step4Card responsive sendBtnId="send-btn" />
    </div>
  );
}
