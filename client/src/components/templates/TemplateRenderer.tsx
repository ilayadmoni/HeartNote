"use client";

/**
 * TemplateRenderer
 * Dynamic component loader that renders templates based on component_key
 */

import { Suspense } from "react";
import {
  DateInvite,
  ScratchCard,
  Timeline,
  LoveCoupons,
  RelationshipQuiz,
  OpenWhen,
  type DateInviteData,
  type ScratchCardData,
  type TimelineData,
  type LoveCouponsData,
  type RelationshipQuizData,
  type OpenWhenData,
} from "@/components/templates";

// Component registry - maps component_key to actual component
const TEMPLATE_COMPONENTS: Record<
  string,
  React.ComponentType<{ data: unknown }>
> = {
  DateInvite: DateInvite as React.ComponentType<{ data: unknown }>,
  ScratchCard: ScratchCard as React.ComponentType<{ data: unknown }>,
  Timeline: Timeline as React.ComponentType<{ data: unknown }>,
  LoveCoupons: LoveCoupons as React.ComponentType<{ data: unknown }>,
  RelationshipQuiz: RelationshipQuiz as React.ComponentType<{ data: unknown }>,
  OpenWhen: OpenWhen as React.ComponentType<{ data: unknown }>,
};

export interface TemplateRendererProps {
  componentKey: string;
  data: unknown;
}

export function TemplateRenderer({
  componentKey,
  data,
}: TemplateRendererProps) {
  const Component = TEMPLATE_COMPONENTS[componentKey];

  if (!Component) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf7f5] dark:bg-gray-900">
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
      <Component data={data} />
    </Suspense>
  );
}

function TemplateLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf7f5] dark:bg-gray-900">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#d4826f] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400 text-hebrew-body">
          טוען...
        </p>
      </div>
    </div>
  );
}

// Type helper for getting the correct data type based on component key
export type TemplateDataType<K extends keyof typeof TEMPLATE_COMPONENTS> =
  K extends "DateInvite"
    ? DateInviteData
    : K extends "ScratchCard"
      ? ScratchCardData
      : K extends "Timeline"
        ? TimelineData
        : K extends "LoveCoupons"
          ? LoveCouponsData
          : K extends "RelationshipQuiz"
            ? RelationshipQuizData
            : K extends "OpenWhen"
              ? OpenWhenData
              : never;
