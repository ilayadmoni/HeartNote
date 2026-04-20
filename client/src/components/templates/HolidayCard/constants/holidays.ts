import type { HolidayKind } from "../../types";

export const HOLIDAY_PRESETS: Record<
  HolidayKind,
  {
    icon: string;
    defaultTitle: string;
    defaultGreeting: string;
    bgColor: string;
    borderColor: string;
  }
> = {
  rosh: {
    icon: "🍎",
    defaultTitle: "שנה טובה ומתוקה!",
    defaultGreeting: "שתהיה שנה מלאה בדבש.",
    bgColor: "#fff5f2",
    borderColor: "rgba(212,130,111,0.3)",
  },
  hanukkah: {
    icon: "🕎",
    defaultTitle: "חג אורים שמח!",
    defaultGreeting: "שיהיה חג מלא באור וסופגניות.",
    bgColor: "#f0f4f8",
    borderColor: "rgba(65,90,119,0.3)",
  },
  purim: {
    icon: "🎭",
    defaultTitle: "חג פורים שמח!",
    defaultGreeting: "עד דלא ידע! חג שמח ומבדח.",
    bgColor: "#f8f0f8",
    borderColor: "rgba(168,85,247,0.3)",
  },
  pesach: {
    icon: "🍷",
    defaultTitle: "חג חירות שמח!",
    defaultGreeting: "שנזכה לפרוח ולשמוח באביב.",
    bgColor: "#fffaeb",
    borderColor: "rgba(234,179,8,0.3)",
  },
};
