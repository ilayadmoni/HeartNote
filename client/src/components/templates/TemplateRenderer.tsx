"use client";

/**
 * TemplateRenderer
 * Dynamic component loader that renders templates based on PascalCase registry key.
 * Uses the centralized registry.
 */

import { Suspense } from "react";
import { getTemplateComponent } from "./registry";

export interface TemplateRendererProps {
  componentKey: string;
  data: unknown;
  creationId?: string;
}

export function TemplateRenderer({
  componentKey,
  data,
  creationId,
}: TemplateRendererProps) {
  const Component = getTemplateComponent(componentKey);

  if (!Component) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="text-center p-8">
          <p className="text-xl text-red-500 mb-2">❌</p>
          <p className="text-gray-600 dark:text-gray-400">
            תבנית לא נמצאה: {componentKey}
          </p>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<TemplateLoader />}>
      <Component data={data} creationId={creationId} />
    </Suspense>
  );
}

function TemplateLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#d4826f] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400 text-hebrew-body">
          טוען...
        </p>
      </div>
    </div>
  );
}
