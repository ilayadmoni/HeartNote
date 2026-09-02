"use client";

/**
 * GalleryTeaser Component
 * Preview of template gallery with up to 4 popular templates.
 * Reuses the shared TemplateCard component with Coming Soon logic for premium templates.
 */

import { Link, useRouter } from "@/i18n/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { GALLERY_TITLE, GALLERY_SUBTITLE, GALLERY_CTA } from "../constants";
import { getPopularTemplates } from "@/actions";
import { TEMPLATES } from "@/components/galleryTemplate/data/templates";
import { TemplateCard } from "@/components/galleryTemplate/components";
import { useAuth } from "@/contexts/AuthContext";
import { LoginModal } from "@/components/auth";
import type { Template } from "@/components/galleryTemplate/types";
import type { GalleryTeaserProps } from "../types";

export function GalleryTeaser({ className = "" }: GalleryTeaserProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [popularTemplates, setPopularTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [pendingLink, setPendingLink] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPopular() {
      try {
        const result = await getPopularTemplates();
        if ("data" in result) {
          // Map DB rows to UI Template objects using the local registry
          const mapped = result.data
            .map((dbTemplate) => {
              const uiTemplate = TEMPLATES.find(
                (t) => t.id === dbTemplate.slug
              );
              if (!uiTemplate) return null;

              const isPremium = dbTemplate.is_premium;
              const badge = isPremium
                ? { type: "premium" as const, color: "#f59e0b" }
                : { type: "free" as const, color: "#22c55e" };

              return {
                ...uiTemplate,
                isPremium,
                isFree: !isPremium,
                badge,
                link: `/create/${dbTemplate.slug}`,
              } as Template;
            })
            .filter((t): t is Template => t !== null);

          setPopularTemplates(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch popular templates:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPopular();
  }, []);

  // Redirect after login
  useEffect(() => {
    if (user && pendingLink) {
      setIsLoginModalOpen(false);
      router.push(pendingLink);
      setPendingLink(null);
    }
  }, [user, pendingLink, router]);

  const handleTemplateClick = (template: Template) => {
    if (template.isPremium) {
      setIsLoginModalOpen(true);
      setPendingLink(template.link);
      return;
    }
    router.push(template.link);
  };



  const handleLoginClose = () => {
    setIsLoginModalOpen(false);
    setPendingLink(null);
  };

  return (
    <>
      <section
        className={`py-20 px-4 bg-white dark:bg-gray-900 ${className}`}
      >
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl lg:text-4xl font-black text-[#2e3c52] dark:text-white mb-4 text-hebrew-heading"
            >
              {GALLERY_TITLE}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-[#2e3c52] dark:text-gray-300 font-medium max-w-2xl mx-auto text-hebrew-body"
            >
              {GALLERY_SUBTITLE}
            </motion.p>
          </div>

          {/* Template Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-gray-100 dark:bg-gray-800 rounded-2xl h-72 animate-pulse"
                  />
                ))
              : popularTemplates.map((template, index) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <TemplateCard
                      template={template}
                      onClick={handleTemplateClick}
                    />
                  </motion.div>
                ))}
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-lg font-bold text-white bg-[#2e3c52] hover:bg-[#415A77] shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 text-hebrew-heading"
            >
              {GALLERY_CTA}
              <ArrowLeft size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={handleLoginClose}
        onSwitchToRegister={() => {}}
      />
    </>
  );
}
