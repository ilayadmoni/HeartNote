"use client";

/** UserMenu – avatar + dropdown when signed in. */

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/hooks/useUser";
import { useMotionOk } from "@/lib/motion";
import { MenuItem } from "./MenuItem";
import { UserAvatar } from "./UserAvatar";

interface UserMenuProps {
  onMenuToggle?: (isOpen: boolean) => void;
}

export function UserMenu({ onMenuToggle }: UserMenuProps = {}): JSX.Element | null {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const { user, signOut } = useAuth();
  const { data: profile } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const motionOk = useMotionOk();
  const router = useRouter();

  useEffect(() => {
    const onMouseDown = (e: MouseEvent): void => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setIsOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent): void => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const handleSignOut = async (): Promise<void> => {
    setIsOpen(false);
    await signOut();
  };

  if (!user) return null;

  const firstName = profile?.first_name;
  const lastName = profile?.last_name;
  const displayName = firstName || user.email?.split("@")[0] || tCommon("brand");
  const fullName = firstName && lastName ? `${firstName} ${lastName}` : firstName || displayName;
  const avatarUrl = profile?.avatar_url ?? null;

  return (
    <div ref={menuRef} className="relative z-[150]" onMouseDown={(e) => e.stopPropagation()}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          const newState = !isOpen;
          setIsOpen(newState);
          onMenuToggle?.(newState);
        }}
        className="
          flex items-center gap-2 px-3 py-1.5
          rounded-pill
          bg-surface-raised
          border border-line
          hover:border-accent
          transition-all duration-200
          focus:outline-none focus-visible:ring-2 focus-visible:ring-accent
        "
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={`${t("userMenu")} - ${displayName}`}
      >
        <UserAvatar avatarUrl={avatarUrl} displayName={displayName} />
        <span className="text-body-sm font-medium text-ink max-w-[100px] truncate hidden sm:inline">
          {displayName}
        </span>
        <ChevronDown
          size={16}
          className={`text-ink-subtle transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={motionOk ? { opacity: 0, y: -10, scale: 0.95 } : undefined}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={motionOk ? { opacity: 0, y: -10, scale: 0.95 } : undefined}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
            className="
              absolute top-full start-0 mt-2
              w-56 max-w-[calc(100vw-1rem)]
              bg-surface-raised
              rounded-card shadow-lift
              border border-line
              overflow-hidden
              z-[250]
            "
          >
            <div className="px-4 py-3 border-b border-line">
              <p className="text-body-sm font-bold text-ink truncate">{fullName}</p>
            </div>

            <div className="py-1">
              <MenuItem
                icon={<User size={16} />}
                label={t("profile")}
                onClick={() => {
                  setIsOpen(false);
                  router.push("/profile");
                }}
              />
              <div className="h-px bg-line my-1" />
              <MenuItem
                icon={<LogOut size={16} />}
                label={t("logout")}
                onClick={handleSignOut}
                variant="danger"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
