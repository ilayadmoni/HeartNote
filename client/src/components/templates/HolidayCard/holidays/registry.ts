import type { ComponentType } from "react";
import type { HolidayKind } from "../../types";
import type { HolidayDecorationProps } from "./types";
import { RoshHashanahDecorations } from "./RoshHashanah";
import { HanukkahDecorations } from "./Hanukkah";
import { PurimDecorations } from "./Purim";
import { PesachDecorations } from "./Pesach";
import { SukkotDecorations } from "./Sukkot";

export interface HolidayTheme {
  Decorations: ComponentType<HolidayDecorationProps>;
  /** Text + accent color inside the glass card (headline). */
  accentColor: string;
  /** Glow color behind the glass card. */
  glowColor: string;
  /** Glass tint (rgba) for the message card fill. */
  glassTint: string;
  /** Border color for the glass card. */
  glassBorder: string;
}

export const HOLIDAY_REGISTRY: Record<HolidayKind, HolidayTheme> = {
  rosh: {
    Decorations: RoshHashanahDecorations,
    accentColor: "#8a3b12",
    glowColor: "rgba(255, 200, 100, 0.45)",
    glassTint: "rgba(255, 250, 235, 0.35)",
    glassBorder: "rgba(255, 220, 150, 0.6)",
  },
  hanukkah: {
    Decorations: HanukkahDecorations,
    accentColor: "#fde68a",
    glowColor: "rgba(253, 224, 71, 0.35)",
    glassTint: "rgba(30, 58, 138, 0.35)",
    glassBorder: "rgba(253, 224, 71, 0.45)",
  },
  purim: {
    Decorations: PurimDecorations,
    accentColor: "#ffffff",
    glowColor: "rgba(255, 255, 255, 0.4)",
    glassTint: "rgba(255, 255, 255, 0.25)",
    glassBorder: "rgba(255, 255, 255, 0.5)",
  },
  pesach: {
    Decorations: PesachDecorations,
    accentColor: "#78350f",
    glowColor: "rgba(251, 191, 36, 0.35)",
    glassTint: "rgba(255, 251, 235, 0.4)",
    glassBorder: "rgba(234, 179, 8, 0.45)",
  },
  sukkot: {
    Decorations: SukkotDecorations,
    accentColor: "#f7fee7",
    glowColor: "rgba(132, 204, 22, 0.35)",
    glassTint: "rgba(63, 98, 18, 0.35)",
    glassBorder: "rgba(190, 242, 100, 0.5)",
  },
};
