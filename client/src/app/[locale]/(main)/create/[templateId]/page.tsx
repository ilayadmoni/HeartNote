"use client";

/**
 * Template Create Page
 * Dynamic route for template editor wizard
 */

import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { TemplateEditor } from "@/components/editor";

import { pushToDataLayer } from "@/utils/gtm";

export default function CreateTemplatePage(): JSX.Element {
  const params = useParams();
  const templateId = params.templateId as string;
  const hasTrackedView = useRef(false);

  useEffect(() => {
    if (!hasTrackedView.current && templateId) {
      pushToDataLayer({
        event: "view_template",
        template_name: templateId,
      });
      hasTrackedView.current = true;
    }
  }, [templateId]);

  return <TemplateEditor templateId={templateId} />;
}
