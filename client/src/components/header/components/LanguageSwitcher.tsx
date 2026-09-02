"use client";

/**
 * LanguageSwitcher
 * Pill toggle between Hebrew and English. Swaps the locale segment of the
 * current URL (next-intl keeps the cookie in sync) and, for signed-in
 * users, persists the choice on their profile.
 */

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { LOCALES, type Locale } from "@/i18n/locale";
import { useAuth } from "@/contexts/AuthContext";
import { setMyLocale } from "@/actions/profile/setLocale";
import { cn } from "@/lib/utils";

const LABELS: Record<Locale, string> = { he: "עב", en: "EN" };

export function LanguageSwitcher({ className = "" }: { className?: string }): JSX.Element {
  const t = useTranslations("common");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [isPending, startTransition] = useTransition();

  const switchTo = (next: Locale): void => {
    if (next === locale || isPending) return;
    const query = searchParams?.toString();
    const target = query ? `${pathname}?${query}` : pathname;
    startTransition(() => {
      router.replace(target, { locale: next });
      if (user) void setMyLocale(next);
    });
  };

  return (
    <div
      role="group"
      aria-label={t("language.switcher")}
      className={cn(
        "inline-flex items-center rounded-pill border border-line bg-surface-raised p-0.5",
        isPending && "opacity-70",
        className,
      )}
    >
      {LOCALES.map((code) => {
        const active = code === locale;
        return (
          <button
            key={code}
            type="button"
            lang={code}
            onClick={() => switchTo(code)}
            aria-pressed={active}
            aria-label={t(`language.${code}`)}
            className={cn(
              "min-w-[2.5rem] rounded-pill px-2.5 py-1 text-xs font-bold tracking-wide transition-colors duration-200",
              active
                ? "bg-ink text-surface shadow-soft"
                : "text-ink-muted hover:text-ink",
            )}
          >
            {LABELS[code]}
          </button>
        );
      })}
    </div>
  );
}
