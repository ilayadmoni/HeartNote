"use client";

import { useTranslations } from "next-intl";
import { FrameSequenceScene } from "./FrameSequenceScene";
import type { HolidaySceneProps } from "../holiday-scene-types";

const BASE = "/assets/images/holiday-interactive/frames/hanukkah";
const FRAMES = [
  `${BASE}/hanukkah1.svg`,
  `${BASE}/hanukkah2.svg`,
  `${BASE}/hanukkah3.svg`,
  `${BASE}/hanukkah4.svg`,
] as const;

export function HanukkahScene(props: HolidaySceneProps) {
  const t = useTranslations("templates");
  return (
    <FrameSequenceScene
      {...props}
      frames={FRAMES}
      alt={t("holidays.hanukkahAlt")}
    />
  );
}
