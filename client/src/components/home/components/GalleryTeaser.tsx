"use client";

/**
 * GalleryTeaser Component
 * Preview of template gallery with 4 featured cards
 */

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { GALLERY_TITLE, GALLERY_SUBTITLE, GALLERY_CTA } from "../constants";
import { GalleryTeaserCard, type TeaserCardData } from "./GalleryTeaserCard";
import type { GalleryTeaserProps } from "../types";

// Template data for teaser
const FEATURED_TEMPLATES: TeaserCardData[] = [
  {
    id: 1,
    title: "ההזמנה הוויראלית",
    description:
      'כרטיס אינטראקטיבי שבו כפתור ה"לא" בורח מהאצבע. אי אפשר לסרב לזה.',
    tag: "הכי פופולרי",
    isPremium: false,
    previewType: "viral",
  },
  {
    id: 2,
    title: "כרטיס חיש-גד",
    description: "שלחו לינק לכרטיס דיגיטלי שמסתיר את ההצעה המרגשת שלכם.",
    isPremium: false,
    previewType: "scratch",
  },
  {
    id: 3,
    title: "ציר הזמן שלנו",
    description:
      "מסע נוסטלגי דרך הזיכרונות החשובים: הנשיקה הראשונה, הדייט הראשון והיום.",
    isPremium: false,
    previewType: "timeline",
  },
  {
    id: 4,
    title: "קופונים לאהובים",
    description:
      "קופונים דיגיטליים. כולל עדכון הקישור כשהצד השני משתמש בקופון!",
    isPremium: true,
    previewType: "coupons",
  },
];

export function GalleryTeaser({ className = "" }: GalleryTeaserProps) {
  return (
    <section className={`py-20 px-4 bg-white dark:bg-gray-900 ${className}`}>
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
          {FEATURED_TEMPLATES.map((template, index) => (
            <GalleryTeaserCard
              key={template.id}
              template={template}
              index={index}
            />
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
  );
}
