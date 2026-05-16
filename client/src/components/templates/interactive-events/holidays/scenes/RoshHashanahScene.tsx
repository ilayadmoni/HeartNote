"use client";

import { FrameSequenceScene } from "./FrameSequenceScene";
import type { HolidaySceneProps } from "../holiday-scene-types";

const BASE = "/assets/images/holiday-interactive/frames/rosh-hashanah";
const FRAMES = [
  `${BASE}/rh- 1.svg`,
  `${BASE}/rh- 2.svg`,
  `${BASE}/rh- 3.svg`,
  `${BASE}/rh- 4.svg`,
] as const;

export function RoshHashanahScene(props: HolidaySceneProps) {
  return (
    <FrameSequenceScene
      {...props}
      frames={FRAMES}
      alt="אנימציית ראש השנה עם מקל דבש"
    />
  );
}
