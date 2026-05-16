"use client";

import { FrameSequenceScene } from "./FrameSequenceScene";
import type { HolidaySceneProps } from "../holiday-scene-types";

const BASE = "/assets/images/holiday-interactive/frames/purim";
const FRAMES = [
  `${BASE}/purim1.svg`,
  `${BASE}/purim2.svg`,
  `${BASE}/purim3.svg`,
] as const;

export function PurimScene(props: HolidaySceneProps) {
  return (
    <FrameSequenceScene
      {...props}
      frames={FRAMES}
      alt="אנימציית פורים עם מסכה"
    />
  );
}
