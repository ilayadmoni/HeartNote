import type { HolidayKind as SharedHolidayKind } from "../../types";

export type HolidayVariant = "desktop" | "mobile";

// Re-export the shared HolidayKind so holidays/ is the source-of-truth
// for the holiday enum. Now includes: rosh, hanukkah, purim, pesach, sukkot.
export type HolidayKind = SharedHolidayKind;

export interface HolidayDecorationProps {
  variant: HolidayVariant;
}
