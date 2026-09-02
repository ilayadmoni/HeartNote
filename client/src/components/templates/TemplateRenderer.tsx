"use client";

/**
 * TemplateRenderer
 * Dynamic component loader that renders templates based on PascalCase registry key.
 * Uses the centralized registry.
 */

"use client";

import { Suspense } from "react";
import { useTranslations } from "next-intl";
import { AlertTriangle } from "lucide-react";
import { getTemplateComponent } from "./registry";

export interface TemplateRendererProps {
  componentKey: string;
  data: unknown;
  creationId?: string;
  verificationCode?: string | null;
}

export function TemplateRenderer({
  componentKey,
  data,
  creationId,
  verificationCode,
}: TemplateRendererProps) {
  const Component = getTemplateComponent(componentKey);
  const t = useTranslations("templates");

  if (!Component) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-transparent">
        <div className="text-center p-8">
          <AlertTriangle className="mx-auto mb-2 text-accent" size={24} aria-hidden="true" />
          <p className="text-ink-muted">{t("common.notFound", { key: componentKey })}</p>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<TemplateLoader />}>
      <Component data={data} creationId={creationId} verificationCode={verificationCode} />
    </Suspense>
  );
}

function TemplateLoader() {
  const t = useTranslations("templates");
  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-transparent">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-ink-muted">{t("common.loading")}</p>
      </div>
    </div>
  );
}
