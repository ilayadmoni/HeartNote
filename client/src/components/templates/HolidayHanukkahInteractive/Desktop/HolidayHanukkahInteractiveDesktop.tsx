"use client";

import { HolidayInteractiveCard } from "@/components/templates/holidays-shared/HolidayInteractiveCard";
import type { InteractiveGreetingData, TemplateComponentProps } from "@/components/templates/types";

export function HolidayHanukkahInteractiveDesktop(
  props: TemplateComponentProps<InteractiveGreetingData>,
) {
  return <HolidayInteractiveCard {...props} slug="holiday-hanukkah-interactive" />;
}
