"use client";

import { HolidayInteractiveCard } from "../holidays-shared/HolidayInteractiveCard";
import type { InteractiveGreetingData } from "../types";
import type { TemplateComponentProps } from "../../types";

export function HolidayRoshHashanahInteractive(
  props: TemplateComponentProps<InteractiveGreetingData>,
) {
  return <HolidayInteractiveCard {...props} slug="holiday-rosh-hashanah-interactive" />;
}
