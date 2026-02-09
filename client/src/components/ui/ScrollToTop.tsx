"use client";

/**
 * ScrollToTop Component
 * Floating button that appears after scrolling down, with smooth scroll to top
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";

const SCROLL_THRESHOLD = 300;

export function ScrollToTop() {
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
          initial={{ opacity: 0, scale: 0.8, y: 20, x: "-50%" }}
          animate={{ opacity: 1, scale: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, scale: 0.8, y: 20, x: "-50%" }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onClick={scrollToTop}
          aria-label="גלול למעלה"
          className="
            fixed top-6 left-1/2 z-50
            w-12 h-12 rounded-full
            bg-[#d4826f] hover:bg-[#c4735f]
            dark:bg-[#e8917a] dark:hover:bg-[#d4826f]
            text-white
            shadow-lg shadow-[#d4826f]/30 dark:shadow-[#e8917a]/30
            hover:shadow-xl hover:shadow-[#d4826f]/40
            flex items-center justify-center
            transition-all duration-200
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
