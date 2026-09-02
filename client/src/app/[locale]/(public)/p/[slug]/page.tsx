/**
 * Public Creation View
 * Displays user-created cards by ID — NO main site header/nav.
 *
 * Routing: unknown ID → notFound().
 * Expired: custom branded UI.
 * Valid: template + share buttons + footer.
 */

import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Clock } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/locale";
import { languageAlternates } from "@/lib/seo/metadata";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/utils/logger";
import { UserPageClient } from "./client";

interface PageProps {
  params: Promise<{ locale: Locale; slug: string }>;
}

interface CreationData {
  id: string;
  template_slug: string;
  template_name: string;
  metadata: Record<string, unknown>;
  is_paid: boolean | null;
  expires_at: string | null;
  created_at: string;
}

async function getCreation(id: string): Promise<CreationData | null> {
  try {
    const creation = await prisma.creation.findFirst({
      where: { id, isDeleted: false },
      include: { template: { select: { slug: true, name: true } } },
    });

    if (!creation) return null;

    return {
      id: creation.id,
      template_slug: creation.template.slug,
      template_name: creation.template.name ?? "",
      metadata: (creation.metadata as Record<string, unknown>) ?? {},
      is_paid: creation.isPaid,
      expires_at: creation.expiresAt ? creation.expiresAt.toISOString() : null,
      created_at: creation.createdAt.toISOString(),
    };
  } catch (error) {
    logger.error("[getCreation] Error fetching creation", { error });
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const creation = await getCreation(slug);
  const t = await getTranslations({ locale, namespace: "meta" });
  const fallbackName = t("share.fallbackName");
  const name = creation?.template_name || fallbackName;

  if (!creation) {
    return { title: "HeartNote" };
  }

  return {
    title: t("share.title", { name }),
    description: t("share.description"),
    alternates: { languages: languageAlternates(`/p/${slug}`) },
    openGraph: {
      title: t("share.ogTitle"),
      description: t("share.ogDescription"),
      type: "website",
    },
  };
}

export default async function PublicPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const creation = await getCreation(slug);

  // ── 404 → show not found page ───────────────────────────────────
  if (!creation) {
    notFound();
  }

  // ── Expired → branded UI ─────────────────────────────────────────
  if (creation.expires_at && new Date(creation.expires_at) < new Date()) {
    const t = await getTranslations({ locale, namespace: "share" });
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-surface p-6">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-accent-soft flex items-center justify-center">
            <Clock className="text-accent" size={40} aria-hidden="true" />
          </div>
          <h1 className="text-title-lg font-bold text-ink mb-3">{t("expiredTitle")}</h1>
          <p className="text-ink-muted mb-6 leading-relaxed">{t("expiredMessage")}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-hover text-accent-ink rounded-pill transition-colors font-bold"
          >
            {t("expiredCta")}
          </Link>
        </div>
      </div>
    );
  }

  // ── Render Template + Share + Footer ──────────────────────────────
  return (
    <UserPageClient
      templateKey={creation.template_slug}
      contentData={creation.metadata}
      isPaid={!!creation.is_paid}
      creationId={creation.id}
    />
  );
}
