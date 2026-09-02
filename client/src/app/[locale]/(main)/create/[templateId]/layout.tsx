import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildPageMetadata } from "@/lib/seo/metadata";
import type { Locale } from "@/i18n/locale";

/**
 * Server layout for the client-only editor page (`page.tsx` needs
 * `useParams`/hooks, so metadata has to live in a sibling server file).
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({ locale, path: "/create", key: "create" });
}

export default function CreateTemplateLayout({ children }: { children: ReactNode }): JSX.Element {
  return <>{children}</>;
}
