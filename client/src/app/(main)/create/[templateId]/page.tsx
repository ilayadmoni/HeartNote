"use client";

/**
 * Template Create Page
 * Dynamic route for template editor wizard
 */

import { useParams } from "next/navigation";
import { TemplateEditor } from "@/components/editor";

export default function CreateTemplatePage() {
  const params = useParams();
  const templateId = params.templateId as string;

  return <TemplateEditor templateId={templateId} />;
}
