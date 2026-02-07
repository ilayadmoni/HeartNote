"use client";

/**
 * GalleryTemplate Component
 * Main export with responsive wrapper for Desktop/Mobile views
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useAuth } from "@/contexts/AuthContext";
import { LoginModal } from "@/components/auth";
import { GalleryTemplateDesktop } from "./Desktop/GalleryTemplateDesktop";
import { GalleryTemplateMobile } from "./Mobile/GalleryTemplateMobile";
import type { GalleryTemplateProps, Template } from "./types";

export function GalleryTemplate(props: GalleryTemplateProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const router = useRouter();
  const { user } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [pendingLink, setPendingLink] = useState<string | null>(null);

  const handleTemplateClick = (template: Template) => {
    if (user) {
      router.push(template.link);
    } else {
      setPendingLink(template.link);
      setIsLoginModalOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
    if (pendingLink) {
      router.push(pendingLink);
      setPendingLink(null);
    }
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
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToRegister={() => {
          // Register handling if needed
        }}
      />
    </>
  );
}

export default GalleryTemplate;
