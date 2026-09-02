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
    <div className={`relative w-full ${outerWidth} overflow-hidden rounded-card border border-line bg-surface-raised p-4 shadow-2xl sm:p-5`}>
      <div className={`relative ${innerAspect} w-full overflow-hidden rounded-card bg-surface-sunken`}>
        {children}
      </div>
    </div>
  );
}
