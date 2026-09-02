import {
  Sparkles,
  Heart,
  Gamepad2,
  Camera,
  Gift,
  PartyPopper,
  HeartHandshake,
  Star,
  BookOpen,
} from "lucide-react";
import type { FilterTab } from "../types";

/** Canonical category id -> lucide icon shown on the filter pill. */
export const CATEGORY_ICON_MAP: Record<string, FilterTab["icon"]> = {
  all: Sparkles,
  romantic: Heart,
  fun: Gamepad2,
  memories: Camera,
  gifts: Gift,
  birthday: PartyPopper,
  wedding: HeartHandshake,
  holidays: Star,
  mitzvah: BookOpen,
};

export const ALL_FILTER_TAB: FilterTab = {
  id: "all",
  labelKey: "filters.all",
  icon: Sparkles,
};
