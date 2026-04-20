/**
 * Gallery Template Types
 * Type definitions for the gallery template feature
 */

export interface Template {
  id: string;
  title: string;
  description: string;
  imageSrc?: string;
  category?: TemplateCategory; // Deprecated: use categories array instead
  categories?: string[]; // New: array of categories from DB
  badge?: TemplateBadge;
  link: string;
  linkText?: string;
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
  | "SteamyWindow"
  | "SurpriseGift"
  | "SlotMachine"
  | "PunchingBag"
  | "ApologySearch"
  | "BirthdayCandles"
  | "ExcuseGenerator"
  | "WeddingGlass"
  | "HolidayCard"
  | "BarBatMitzvah";

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

export interface TemplateBadge {
  type: "heart" | "star" | "new" | "free" | "premium";
  color?: string;
}

export interface FilterTab {
  id: TemplateCategory;
  label: string;
  emoji?: string;
}

export interface GalleryTemplateProps {
  className?: string;
  onTemplateClick?: (template: Template) => void;
}

export interface TemplateCardProps {
  template: Template;
  className?: string;
  onPreview?: (template: Template) => void;
  onClick?: (template: Template) => void;
}

export interface FilterTabsProps {
  activeTab: TemplateCategory;
  onTabChange: (tab: TemplateCategory) => void;
  className?: string;
}

export interface GalleryHeaderProps {
  title: string;
  subtitle: string;
  className?: string;
}
