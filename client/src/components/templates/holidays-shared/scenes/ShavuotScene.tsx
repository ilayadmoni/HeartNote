"use client";

import { useTranslations } from "next-intl";
import { FrameSequenceScene } from "./FrameSequenceScene";
import type { HolidaySceneProps } from "../holiday-scene-types";

const BASE = "/assets/images/holiday-interactive/frames/shavuot";
const FRAMES = [
  `${BASE}/shavuot1.svg`,
  `${BASE}/shavuot2.svg`,
  `${BASE}/shavuot3.svg`,
] as const;

export function ShavuotScene(props: HolidaySceneProps) {
  const t = useTranslations("templates");
  return (
    <FrameSequenceScene
      {...props}
      frames={FRAMES}
      alt={t("holidays.shavuotAlt")}
    />
  );
}
