"use client";

import { BirthdayCandlesCore } from "../components/BirthdayCandlesCore";
import type { BirthdayInteractiveData, TemplateComponentProps } from "@/components/templates/types";

export function BirthdayCandlesInteractiveDesktop(
  props: TemplateComponentProps<BirthdayInteractiveData>,
) {
  return <BirthdayCandlesCore {...props} />;
}
