"use client";

import { HolidayInteractiveCard } from "@/components/templates/holidays-shared/HolidayInteractiveCard";
import type { InteractiveGreetingData, TemplateComponentProps } from "@/components/templates/types";

export function HolidayPurimInteractiveMobile(
  props: TemplateComponentProps<InteractiveGreetingData>,
) {
  return <HolidayInteractiveCard {...props} slug="holiday-purim-interactive" />;
}
