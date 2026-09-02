/**
 * Gallery Template Types
 * Type definitions for the gallery template feature
 */

import type { LucideIcon } from "lucide-react";

export interface Template {
  id: string;
  /** Message key resolved via t(nameKey) under the "gallery" namespace. */
  nameKey: string;
  /** Message key resolved via t(descriptionKey) under the "gallery" namespace. */
  descriptionKey: string;
  /** Raw name from the DB row, used only if nameKey has no catalog translation. */
  dbName?: string;
  imageSrc?: string;
  category?: TemplateCategory; // Deprecated: use categories array instead
  categories?: string[]; // New: array of categories from DB
  link: string;
  isFree?: boolean;
  isPremium?: boolean;
  componentKey: TemplateComponentKey;
}

export type TemplateComponentKey =
  | "DateInvite"
  | "ScratchCard"
  | "Timeline"
  | "LoveCoupons"
  | "RelationshipQuiz"
  | "OpenWhen"
  | "DecisionWheel"
  | "SurpriseGift"
  | "SlotMachine"
  | "PunchingBag"
  | "ApologySearch"
  | "ExcuseGenerator"
  | "BarBatMitzvah"
  | "BirthdayCandlesInteractive"
  | "WeddingGlassInteractive"
  | "HolidayRoshHashanahInteractive"
  | "HolidayPassoverInteractive"
  | "HolidayPurimInteractive"
  | "HolidayShavuotInteractive"
  | "HolidaySukkotInteractive"
  | "HolidayHanukkahInteractive";

export type TemplateCategory =
  | "all"
  | "romantic"
  | "fun"
  | "memories"
  | "gifts"
  | "birthday"
  | "wedding"
  | "holidays"
  | "mitzvah";

export interface FilterTab {
  id: string;
  /** Message key resolved via t(labelKey) under the "gallery" namespace. */
  labelKey: string;
  icon: LucideIcon;
}

export interface GalleryTemplateProps {
  className?: string;
  onTemplateClick?: (template: Template) => void;
  skipLoadingGate?: boolean;
}

export interface TemplateCardProps {
  template: Template;
  className?: string;
  onPreview?: (template: Template) => void;
  onClick?: (template: Template) => void;
}

export interface FilterTabsProps {
  tabs: FilterTab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  className?: string;
}

export interface GalleryHeaderProps {
  title: string;
  subtitle: string;
  className?: string;
}

export interface GalleryTemplateViewProps {
  className?: string;
  onTemplateClick?: (template: Template) => void;
  templates: Template[];
  loading: boolean;
  error: string | null;
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: FilterTab[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
}
