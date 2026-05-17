"use client";

import { HolidayInteractiveCard } from "@/components/templates/holidays-shared/HolidayInteractiveCard";
import type { InteractiveGreetingData, TemplateComponentProps } from "@/components/templates/types";

export function HolidayRoshHashanahInteractiveDesktop(
  props: TemplateComponentProps<InteractiveGreetingData>,
) {
  return <HolidayInteractiveCard {...props} slug="holiday-rosh-hashanah-interactive" />;
}
