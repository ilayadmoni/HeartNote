"use client";

/**
 * RelationshipQuiz Component
 * Responsive wrapper — delegates to Desktop or Mobile layout
 */

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { RelationshipQuizDesktop } from "./Desktop/RelationshipQuizDesktop";
import { RelationshipQuizMobile } from "./Mobile/RelationshipQuizMobile";
import type { TemplateComponentProps, RelationshipQuizData } from "./types";

export function RelationshipQuiz({
  data,
}: TemplateComponentProps<RelationshipQuizData>) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return isMobile ? (
    <RelationshipQuizMobile data={data} />
  ) : (
    <RelationshipQuizDesktop data={data} />
  );
}
