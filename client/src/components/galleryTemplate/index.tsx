"use client";

/**
 * GalleryTemplate Component
 * Main export with responsive wrapper for Desktop/Mobile views.
 *
 * Also handles middleware auth redirects:
 * When an unauthenticated user tries to access a protected route,
 * middleware redirects here with ?login=true&redirect=/original/path.
 * This component reads those params to auto-open the login modal
 * and redirect after successful login.
 */

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useAuth } from "@/contexts/AuthContext";
import { LoginModal } from "@/components/auth";
import { GalleryTemplateDesktop } from "./Desktop/GalleryTemplateDesktop";
import { GalleryTemplateMobile } from "./Mobile/GalleryTemplateMobile";
import type { GalleryTemplateProps, Template } from "./types";

export function GalleryTemplate(props: GalleryTemplateProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [pendingLink, setPendingLink] = useState<string | null>(null);

  // Auto-open login modal when redirected from middleware (?login=true)
  useEffect(() => {
    const shouldLogin = searchParams.get("login") === "true";
    const redirectPath = searchParams.get("redirect");

    if (shouldLogin && !user) {
      setPendingLink(redirectPath);
      setIsLoginModalOpen(true);
    }
  }, [searchParams, user]);

  // If the user logs in while modal is open (e.g. via middleware redirect),
  // redirect them to the originally requested route
  useEffect(() => {
    if (user && pendingLink) {
      setIsLoginModalOpen(false);
      router.push(pendingLink);
      setPendingLink(null);
    }
  }, [user, pendingLink, router]);

  const handleTemplateClick = (template: Template) => {
    if (user) {
      router.push(template.link);
    } else {
      setPendingLink(template.link);
      setIsLoginModalOpen(true);
    }
  };

  const handleLoginClose = () => {
    setIsLoginModalOpen(false);
    setPendingLink(null);
  };

  return (
    <>
      {isMobile ? (
        <GalleryTemplateMobile
          {...props}
          onTemplateClick={handleTemplateClick}
        />
      ) : (
        <GalleryTemplateDesktop
          {...props}
          onTemplateClick={handleTemplateClick}
        />
      )}

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={handleLoginClose}
        onSwitchToRegister={() => {
          // Register handling if needed
        }}
      />
    </>
  );
}

export default GalleryTemplate;
