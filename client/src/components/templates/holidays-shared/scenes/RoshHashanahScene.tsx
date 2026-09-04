"use client";

import { useTranslations } from "next-intl";
import { FrameSequenceScene } from "./FrameSequenceScene";
import type { HolidaySceneProps } from "../holiday-scene-types";

const BASE = "/assets/images/holiday-interactive/frames/rosh-hashanah";
const FRAMES = [
  `${BASE}/rh-1.svg`,
  `${BASE}/rh-2.svg`,
  `${BASE}/rh-3.svg`,
  `${BASE}/rh-4.svg`,
] as const;

export function RoshHashanahScene(props: HolidaySceneProps) {
  const t = useTranslations("templates");
  return (
    <FrameSequenceScene
      {...props}
      frames={FRAMES}
      alt={t("holidays.roshHashanahAlt")}
    />
  );
}
