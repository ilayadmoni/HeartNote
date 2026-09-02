"use client";

/**
 * ScrollToTop Component
 * Floating button that appears after scrolling down, with smooth scroll to top
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";
import { useTranslations } from "next-intl";

const SCROLL_THRESHOLD = 300;

export function ScrollToTop(): JSX.Element {
  const t = useTranslations("editor");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > SCROLL_THRESHOLD);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial state

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onClick={scrollToTop}
          aria-label={t("calendar.scrollToTop")}
          className="
            fixed bottom-6 start-6 z-50
            w-12 h-12 rounded-full
            bg-accent hover:bg-accent-hover
            text-accent-ink
            shadow-glow-sm hover:shadow-glow
            flex items-center justify-center
            transition-colors duration-base ease-out-quint
            backdrop-blur-sm
          "
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronUp size={24} strokeWidth={2.5} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
