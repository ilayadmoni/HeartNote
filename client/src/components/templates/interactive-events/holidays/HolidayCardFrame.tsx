"use client";

import type { ReactNode } from "react";

interface HolidayCardFrameProps {
  children: ReactNode;
  shape?: "rectangle" | "square";
}

export function HolidayCardFrame({
  children,
  shape = "rectangle",
}: HolidayCardFrameProps) {
  const innerAspect = shape === "square" ? "aspect-square" : "aspect-[4/3]";
  const outerWidth = shape === "square" ? "max-w-md" : "max-w-md sm:max-w-lg";

  return (
    <div className={`relative w-full ${outerWidth} overflow-hidden rounded-[2rem] border border-white/75 bg-[#fff8ef] p-4 shadow-2xl shadow-coral-900/12 dark:border-white/10 dark:bg-slate-900 sm:p-5`}>
      <div className={`relative ${innerAspect} w-full overflow-hidden rounded-[1.45rem] bg-[#faf2e8] dark:bg-slate-950/70`}>
        {children}
      </div>
    </div>
  );
}
