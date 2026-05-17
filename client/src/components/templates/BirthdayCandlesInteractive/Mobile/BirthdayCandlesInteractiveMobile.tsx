"use client";

import { BirthdayCandlesCore } from "../components/BirthdayCandlesCore";
import type { BirthdayInteractiveData, TemplateComponentProps } from "@/components/templates/types";

export function BirthdayCandlesInteractiveMobile(
  props: TemplateComponentProps<BirthdayInteractiveData>,
) {
  return <BirthdayCandlesCore {...props} />;
}
