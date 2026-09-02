"use client";

import { useTranslations } from "next-intl";
import { FrameSequenceScene } from "./FrameSequenceScene";
import type { HolidaySceneProps } from "../holiday-scene-types";

const BASE = "/assets/images/holiday-interactive/frames/sukkot";
const FRAMES = [
  `${BASE}/sukkot1.svg`,
  `${BASE}/sukkot2.svg`,
  `${BASE}/sukkot3.svg`,
] as const;

export function SukkotScene(props: HolidaySceneProps) {
  const t = useTranslations("templates");
  return (
    <FrameSequenceScene
      {...props}
      frames={FRAMES}
      alt={t("holidays.sukkotAlt")}
    />
  );
}
