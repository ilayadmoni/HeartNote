"use client";

/**
 * Template Create Page
 * Dynamic route for template editor wizard
 */

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { TemplateEditor } from "@/components/editor";

import { pushToDataLayer } from "@/utils/gtm";

export default function CreateTemplatePage() {
  const params = useParams();
  const templateId = params.templateId as string;

  useEffect(() => {
    pushToDataLayer({
      event: "view_template",
      template_name: templateId,
    });
  }, [templateId]);

  return <TemplateEditor templateId={templateId} />;
}
