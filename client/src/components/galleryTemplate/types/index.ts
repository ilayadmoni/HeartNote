/**
 * Gallery Template Types
 * Type definitions for the gallery template feature
 */

export interface Template {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  category: TemplateCategory;
  badge?: TemplateBadge;
  link: string;
  linkText?: string;
  isFree?: boolean;
}

export type TemplateCategory =
  | "all"
  | "dates-love"
  | "birthdays"
  | "family-friends"
  | "humor";

export interface TemplateBadge {
  type: "heart" | "star" | "new" | "free";
  color?: string;
}

export interface FilterTab {
  id: TemplateCategory;
  label: string;
}

export interface GalleryTemplateProps {
  className?: string;
}

export interface TemplateCardProps {
  template: Template;
  className?: string;
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
