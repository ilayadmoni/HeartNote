"use client";

/**
 * GalleryTemplate Component
 * Main export with responsive wrapper for Desktop/Mobile views.
 * Owns all gallery state: activeTab, searchQuery, tabs derivation, and filtering.
 */

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useAuth } from "@/contexts/AuthContext";
import { LoginModal } from "@/components/auth";
import { useActiveTemplates } from "@/hooks/useActiveTemplates";
import { useGallerySearch } from "@/components/GallerySearchBar";
import { GalleryTemplateDesktop } from "./Desktop/GalleryTemplateDesktop";
import { GalleryTemplateMobile } from "./Mobile/GalleryTemplateMobile";
import { TEMPLATES, CATEGORY_KEY, CATEGORY_ICON_MAP, ALL_FILTER_TAB } from "./data/templates";
import type { GalleryTemplateProps, Template, FilterTab } from "./types";

export function GalleryTemplate(props: GalleryTemplateProps): JSX.Element {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const t = useTranslations("gallery");

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [pendingLink, setPendingLink] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { enrichedTemplates, loading, error } = useActiveTemplates(TEMPLATES);

  const tabs = useMemo<FilterTab[]>(() => {
    const seen = new Set<string>();
    const dynamic = enrichedTemplates
      .flatMap((tpl) => tpl.categories ?? [])
      .filter((cat) => {
        if (seen.has(cat)) return false;
        seen.add(cat);
        return true;
      })
      .map((cat): FilterTab => {
        const canonicalId = CATEGORY_KEY[cat];
        return {
          id: cat,
          labelKey: canonicalId ? `categories.${canonicalId}` : "filters.all",
          icon: CATEGORY_ICON_MAP[canonicalId] ?? CATEGORY_ICON_MAP.all,
        };
      });
    return [ALL_FILTER_TAB, ...dynamic];
  }, [enrichedTemplates]);

  const { filteredTemplates } = useGallerySearch(
    enrichedTemplates,
    activeTab,
    searchQuery,
    t
  );

  // Auto-open login modal when redirected from middleware (?login=true)
  useEffect(() => {
    const shouldLogin = searchParams.get("login") === "true";
    const redirectPath = searchParams.get("redirect");
    if (shouldLogin && !user) {
      setPendingLink(redirectPath);
      setIsLoginModalOpen(true);
    }
  }, [searchParams, user]);

  // Redirect after login
  useEffect(() => {
    if (user && pendingLink) {
      setIsLoginModalOpen(false);
      router.push(pendingLink);
      setPendingLink(null);
    }
  }, [user, pendingLink, router]);

  const handleTemplateClick = (template: Template): void => {
    router.push(template.link);
  };

  const handleLoginClose = (): void => {
    setIsLoginModalOpen(false);
    setPendingLink(null);
  };

  const viewProps = {
    ...props,
    templates: filteredTemplates,
    loading,
    error,
    activeTab,
    onTabChange: setActiveTab,
    tabs,
    searchQuery,
    onSearchChange: setSearchQuery,
    onTemplateClick: handleTemplateClick,
  };

  return (
    <>
      {isMobile ? (
        <GalleryTemplateMobile {...viewProps} />
      ) : (
        <GalleryTemplateDesktop {...viewProps} />
      )}

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={handleLoginClose}
        redirectTo={pendingLink}
      />
    </>
  );
}

export default GalleryTemplate;
