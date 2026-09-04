import type { HolidayInteractiveConfig, HolidayInteractiveSlug } from "../types";

/**
 * `name`, `galleryTitle`, `galleryDescription`, `defaultTitle`, `revealLine`
 * and `prompt` hold message KEYS (not literal text), resolved against the
 * `templates` namespace, e.g. `t("holidays.<slug>.name")` with
 * `useTranslations("templates")`. See `src/messages/{he,en}/templates.json`.
 */
export const HOLIDAY_INTERACTIVE_CONFIGS: Record<
  HolidayInteractiveSlug,
  HolidayInteractiveConfig
> = {
  "holiday-rosh-hashanah-interactive": {
    slug: "holiday-rosh-hashanah-interactive",
    componentKey: "HolidayRoshHashanahInteractive",
    name: "holidays.holiday-rosh-hashanah-interactive.name",
    galleryTitle: "holidays.holiday-rosh-hashanah-interactive.galleryTitle",
    galleryDescription: "holidays.holiday-rosh-hashanah-interactive.galleryDescription",
    defaultTitle: "holidays.holiday-rosh-hashanah-interactive.defaultTitle",
    revealLine: "holidays.holiday-rosh-hashanah-interactive.revealLine",
    prompt: "holidays.holiday-rosh-hashanah-interactive.prompt",
    accent: "#d4826f",
    interaction: "honey",
    revealMotion: "fade-up",
    wash: "#FBEFE6",
  },
  "holiday-passover-interactive": {
    slug: "holiday-passover-interactive",
    componentKey: "HolidayPassoverInteractive",
    name: "holidays.holiday-passover-interactive.name",
    galleryTitle: "holidays.holiday-passover-interactive.galleryTitle",
    galleryDescription: "holidays.holiday-passover-interactive.galleryDescription",
    defaultTitle: "holidays.holiday-passover-interactive.defaultTitle",
    revealLine: "holidays.holiday-passover-interactive.revealLine",
    prompt: "holidays.holiday-passover-interactive.prompt",
    accent: "#b7791f",
    interaction: "matzah",
    revealMotion: "slide-open",
    wash: "#F6EDD9",
  },
  "holiday-purim-interactive": {
    slug: "holiday-purim-interactive",
    componentKey: "HolidayPurimInteractive",
    name: "holidays.holiday-purim-interactive.name",
    galleryTitle: "holidays.holiday-purim-interactive.galleryTitle",
    galleryDescription: "holidays.holiday-purim-interactive.galleryDescription",
    defaultTitle: "holidays.holiday-purim-interactive.defaultTitle",
    revealLine: "holidays.holiday-purim-interactive.revealLine",
    prompt: "holidays.holiday-purim-interactive.prompt",
    accent: "#8b5cf6",
    interaction: "mask",
    revealMotion: "spin-in",
    wash: "#F1EBFB",
  },
  "holiday-shavuot-interactive": {
    slug: "holiday-shavuot-interactive",
    componentKey: "HolidayShavuotInteractive",
    name: "holidays.holiday-shavuot-interactive.name",
    galleryTitle: "holidays.holiday-shavuot-interactive.galleryTitle",
    galleryDescription: "holidays.holiday-shavuot-interactive.galleryDescription",
    defaultTitle: "holidays.holiday-shavuot-interactive.defaultTitle",
    revealLine: "holidays.holiday-shavuot-interactive.revealLine",
    prompt: "holidays.holiday-shavuot-interactive.prompt",
    accent: "#7ed957",
    interaction: "bloom",
    revealMotion: "bloom",
    wash: "#EEF9E7",
  },
  "holiday-sukkot-interactive": {
    slug: "holiday-sukkot-interactive",
    componentKey: "HolidaySukkotInteractive",
    name: "holidays.holiday-sukkot-interactive.name",
    galleryTitle: "holidays.holiday-sukkot-interactive.galleryTitle",
    galleryDescription: "holidays.holiday-sukkot-interactive.galleryDescription",
    defaultTitle: "holidays.holiday-sukkot-interactive.defaultTitle",
    revealLine: "holidays.holiday-sukkot-interactive.revealLine",
    prompt: "holidays.holiday-sukkot-interactive.prompt",
    accent: "#5f8f2f",
    interaction: "sukkah",
    revealMotion: "fade-up",
    wash: "#EFF4E5",
  },
  "holiday-hanukkah-interactive": {
    slug: "holiday-hanukkah-interactive",
    componentKey: "HolidayHanukkahInteractive",
    name: "holidays.holiday-hanukkah-interactive.name",
    galleryTitle: "holidays.holiday-hanukkah-interactive.galleryTitle",
    galleryDescription: "holidays.holiday-hanukkah-interactive.galleryDescription",
    defaultTitle: "holidays.holiday-hanukkah-interactive.defaultTitle",
    revealLine: "holidays.holiday-hanukkah-interactive.revealLine",
    prompt: "holidays.holiday-hanukkah-interactive.prompt",
    accent: "#38b6ff",
    interaction: "hanukkah",
    revealMotion: "fade-up",
    wash: "#E9F6FF",
  },
};

export const HOLIDAY_INTERACTIVE_SLUGS = Object.keys(
  HOLIDAY_INTERACTIVE_CONFIGS,
) as HolidayInteractiveSlug[];
