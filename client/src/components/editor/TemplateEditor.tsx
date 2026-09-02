"use client";

/**
 * TemplateEditor Component
 * Main editor layout with sidebar, preview, and toolbar
 */

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { EditorDesktop } from "./Desktop/EditorDesktop";
import { EditorMobile } from "./Mobile/EditorMobile";
import type { TemplateEditorProps } from "./types";

export function TemplateEditor(props: TemplateEditorProps): JSX.Element {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return isMobile ? <EditorMobile {...props} /> : <EditorDesktop {...props} />;
}
