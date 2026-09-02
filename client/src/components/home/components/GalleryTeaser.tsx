"use client";

/**
 * GalleryTeaser Component
 * Bento-style preview of up to 4 popular templates, first card featured.
 */

import { Link, useRouter } from "@/i18n/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { LoginModal } from "@/components/auth";
import { stagger, viewportOnce, useMotionOk } from "@/lib/motion";
import { usePopularTemplates, type PopularTemplate } from "../hooks/usePopularTemplates";
import { GalleryTeaserCard } from "./GalleryTeaserCard";
import type { GalleryTeaserProps } from "../types";

export function GalleryTeaser({ className = "" }: GalleryTeaserProps): JSX.Element {
  const t = useTranslations("home.gallery");
  const router = useRouter();
  const { user } = useAuth();
  const motionOk = useMotionOk();
  const { templates, loading } = usePopularTemplates();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [pendingLink, setPendingLink] = useState<string | null>(null);

  useEffect(() => {
    if (user && pendingLink) {
      setIsLoginModalOpen(false);
      router.push(pendingLink);
      setPendingLink(null);
    }
  }, [user, pendingLink, router]);

  const handleTemplateClick = (template: PopularTemplate): void => {
    if (template.isPremium) {
      setIsLoginModalOpen(true);
      setPendingLink(template.link);
      return;
    }
    router.push(template.link);
  };

  return (
    <>
      <section className={`py-section-sm px-gutter bg-surface ${className}`}>
        <div className="mx-auto max-w-shell">
          <div className="text-center mb-12">
            <motion.h2
              initial={motionOk ? { opacity: 0, y: 20 } : false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              className="text-display-md text-ink mb-4"
            >
              {t("title")}
            </motion.h2>
            <motion.p
              initial={motionOk ? { opacity: 0, y: 20 } : false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ delay: 0.1 }}
              className="text-body-md text-ink-muted max-w-prose mx-auto"
            >
              {t("subtitle")}
            </motion.p>
          </div>

          <motion.div
            initial={motionOk ? "hidden" : "visible"}
            whileInView="visible"
            viewport={viewportOnce}
            variants={stagger(0.08)}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-surface-sunken rounded-card h-72 animate-pulse" />
                ))
              : templates.map((template, index) => (
                  <div key={template.id} className={index === 0 ? "lg:col-span-2" : ""}>
                    <GalleryTeaserCard template={template} featured={index === 0} onClick={() => handleTemplateClick(template)} />
                  </div>
                ))}
          </motion.div>

          <motion.div
            initial={motionOk ? { opacity: 0, y: 20 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            className="flex justify-center"
          >
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-pill text-body-lg font-bold text-accent-ink bg-accent shadow-glow-sm hover:bg-accent-hover hover:shadow-glow transition-colors duration-base ease-out-quint"
            >
              {t("cta")}
              <ArrowRight size={20} className="rtl:-scale-x-100" />
            </Link>
          </motion.div>
        </div>
      </section>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => { setIsLoginModalOpen(false); setPendingLink(null); }} onSwitchToRegister={() => {}} />
    </>
  );
}
