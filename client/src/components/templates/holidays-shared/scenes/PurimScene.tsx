"use client";

import { useTranslations } from "next-intl";
import { FrameSequenceScene } from "./FrameSequenceScene";
import type { HolidaySceneProps } from "../holiday-scene-types";

const BASE = "/assets/images/holiday-interactive/frames/purim";
const FRAMES = [
  `${BASE}/purim1.svg`,
  `${BASE}/purim2.svg`,
  `${BASE}/purim3.svg`,
] as const;

export function PurimScene(props: HolidaySceneProps) {
  const t = useTranslations("templates");
  return (
    <FrameSequenceScene
      {...props}
      frames={FRAMES}
      alt={t("holidays.purimAlt")}
    />
  );
}
