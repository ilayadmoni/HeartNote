"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MobileNavItem } from "./MobileNavItem";
import type { MobileMenuProps } from "../types";
import { FocusTrap } from "@/components/accessibility";
import { useAuth } from "@/contexts/AuthContext";

const C = {
  coral: "#d4826f",
  coralDark: "#b86a57",
} as const;



const listVariants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
  closed: {
    transition: { staggerChildren: 0.04, staggerDirection: -1 },
  },
};

export function MobileMenu({
  isOpen,
  onClose,
  navItems,
  onLoginClick,
}: MobileMenuProps) {
  const { user, loading } = useAuth();

  return (
    <>
      {/* Backdrop */}
      <div
        className={`
          fixed left-0 right-0 bottom-0 bg-black/40 backdrop-blur-sm
          transition-opacity duration-300 lg:hidden z-[90]
          ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
        style={{ top: "64px" }}
        onClick={onClose}
        aria-hidden="true"
      />

      <FocusTrap active={isOpen} onEscape={onClose}>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="
                absolute top-16 left-0 right-0 z-[95] lg:hidden overflow-hidden
                bg-[#faf8f5f2] dark:bg-[#1a1f2e]
              "
              style={{
                willChange: "opacity, transform",
                boxShadow:
                  "0 30px 70px -20px rgba(212,130,111,0.35), 0 2px 6px rgba(0,0,0,0.1)",
                borderTop: "1px solid rgba(212,130,111,0.18)",
                padding: "20px 18px 22px",
                fontFamily: "var(--font-open-sans)",
              }}
              aria-label="תפריט ניווט"
            >
  

              <nav aria-label="ניווט נייד" style={{ position: "relative", width: "100%" }}>
                <motion.ul
                  role="list"
                  style={{ listStyle: "none", margin: 0, padding: 0 }}
                  variants={listVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                >
                  {navItems.map((item) => (
                    <MobileNavItem
                      key={item.id}
                      href={item.href}
                      label={item.label}
                      onClick={onClose}
                    />
                  ))}
                </motion.ul>

                {!loading && !user && onLoginClick && (
                  <motion.button
                    type="button"
                    onClick={() => {
                      onClose();
                      onLoginClick();
                    }}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ delay: navItems.length * 0.07 + 0.05, duration: 0.2 }}
                    whileTap={{ scale: 0.97 }}
                    className="
                      w-full mt-5 px-4 py-3.5 rounded-full
                      text-white font-bold text-[15px]
                      transition-opacity duration-150
                      active:opacity-90 cursor-pointer
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4826f]
                      focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf8f5] dark:focus-visible:ring-offset-[#1a1f2e]
                    "
                    style={{
                      background: `linear-gradient(135deg, ${C.coral} 0%, ${C.coralDark} 100%)`,
                      boxShadow: "0 8px 20px -4px rgba(212,130,111,0.45)",
                      fontFamily: "var(--font-open-sans)",
                    }}
                  >
                    התחברות / הרשמה
                  </motion.button>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </FocusTrap>
    </>
  );
}
