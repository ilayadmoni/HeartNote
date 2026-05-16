export interface InteractiveGreetingData {
  recipientName?: string;
  senderName?: string;
  greetingTitle?: string;
  message?: string;
  signature?: string;
}

export interface BirthdayInteractiveData extends InteractiveGreetingData {
  recipientAge?: number;
}

export interface WeddingInteractiveData {
  coupleNames?: string;
  senderName?: string;
  greetingTitle?: string;
  message?: string;
}

export type HolidayInteractiveSlug =
  | "holiday-rosh-hashanah-interactive"
  | "holiday-passover-interactive"
  | "holiday-purim-interactive"
  | "holiday-shavuot-interactive"
  | "holiday-sukkot-interactive"
  | "holiday-hanukkah-interactive";

export type HolidayInteraction =
  | "honey"
  | "matzah"
  | "mask"
  | "bloom"
  | "sukkah"
  | "hanukkah";

export interface HolidayInteractiveConfig {
  slug: HolidayInteractiveSlug;
  componentKey: string;
  name: string;
  galleryTitle: string;
  galleryDescription: string;
  defaultTitle: string;
  revealLine: string;
  prompt: string;
  accent: string;
  interaction: HolidayInteraction;
}
