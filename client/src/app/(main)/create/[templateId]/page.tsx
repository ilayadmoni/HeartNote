"use client";

/**
 * Template Create Page
 * Dynamic route for template editor wizard
 */

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { TemplateEditor } from "@/components/editor";

export default function CreateTemplatePage() {
  const params = useParams();
  const templateId = params.templateId as string;

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "custom_template_view",
      page_path: window.location.pathname,
      template_id: templateId,
    });
  }, [templateId]);

  return <TemplateEditor templateId={templateId} />;
}
