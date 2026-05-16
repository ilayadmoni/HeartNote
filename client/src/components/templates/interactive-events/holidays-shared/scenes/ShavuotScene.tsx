"use client";

import { FrameSequenceScene } from "./FrameSequenceScene";
import type { HolidaySceneProps } from "../holiday-scene-types";

const BASE = "/assets/images/holiday-interactive/frames/shavuot";
const FRAMES = [
  `${BASE}/shavuot1.svg`,
  `${BASE}/shavuot2.svg`,
  `${BASE}/shavuot3.svg`,
] as const;

export function ShavuotScene(props: HolidaySceneProps) {
  return (
    <FrameSequenceScene
      {...props}
      frames={FRAMES}
      alt="אנימציית שבועות פורחת"
    />
  );
}
