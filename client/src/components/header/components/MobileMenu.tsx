"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { MobileNavItem } from "./MobileNavItem";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import type { MobileMenuProps } from "../types";
import { FocusTrap } from "@/components/accessibility";
import { useAuth } from "@/contexts/AuthContext";
import { useMotionOk } from "@/lib/motion";

const listVariants = {
  open: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
  closed: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
};

export function MobileMenu({
  isOpen,
  onClose,
  navItems,
  onLoginClick,
}: MobileMenuProps): JSX.Element {
  const t = useTranslations("nav");
  const { user, loading } = useAuth();
  const motionOk = useMotionOk();

  return (
    <>
      {/* Backdrop */}
      <div
        className={`
          fixed start-0 end-0 bottom-0 bg-ink/40 backdrop-blur-sm
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
              initial={motionOk ? { opacity: 0, y: -8 } : undefined}
              animate={{ opacity: 1, y: 0 }}
              exit={motionOk ? { opacity: 0, y: -8 } : undefined}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-16 start-0 end-0 z-[95] lg:hidden overflow-hidden bg-surface border-t border-line shadow-lift px-4 pb-6 pt-5"
              aria-label={t("menu")}
            >
              <nav aria-label={t("menu")} className="relative w-full">
                <motion.ul
                  role="list"
                  className="list-none m-0 p-0"
                  variants={listVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                >
                  {navItems.map((item) => (
                    <MobileNavItem
                      key={item.id}
                      href={item.href}
                      label={t(item.labelKey)}
                      onClick={onClose}
                    />
                  ))}
                </motion.ul>

                <div className="flex items-center justify-between gap-3 mt-5 pt-5 border-t border-line">
                  <LanguageSwitcher />
                  <ThemeToggle />
                </div>

                {!loading && !user && onLoginClick && (
                  <motion.button
                    type="button"
                    onClick={() => {
                      onClose();
                      onLoginClick();
                    }}
                    initial={motionOk ? { opacity: 0, y: 6 } : undefined}
                    animate={{ opacity: 1, y: 0 }}
                    exit={motionOk ? { opacity: 0, y: 6 } : undefined}
                    transition={{ delay: navItems.length * 0.07 + 0.05, duration: 0.2 }}
                    whileTap={motionOk ? { scale: 0.97 } : undefined}
                    className="
                      w-full mt-5 min-h-[3rem] px-4 py-3.5 rounded-pill
                      bg-accent text-accent-ink font-bold text-body-md
                      shadow-glow-sm transition-opacity duration-150
                      active:opacity-90 cursor-pointer
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-accent
                      focus-visible:ring-offset-2 focus-visible:ring-offset-surface
                    "
                  >
                    {t("loginOrRegister")}
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
