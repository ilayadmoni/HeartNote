/**
 * FAQ Component
 * Main FAQ page content with accordion.
 */

import { getTranslations } from "next-intl/server";
import { HelpCircle } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { FAQHeader, FAQAccordion } from "./components";
import type { FAQProps } from "./types";

export async function FAQ({ className = "" }: FAQProps): Promise<JSX.Element> {
  const t = await getTranslations("faq");

  return (
    <section className={`relative py-section-sm px-gutter min-h-[100dvh] bg-surface ${className}`}>
      {/* Background Decorative Elements */}
      <div className="absolute top-20 start-10 opacity-5 pointer-events-none hidden lg:block">
        <HelpCircle size={180} className="text-ink" />
      </div>
      <div className="absolute bottom-20 end-10 opacity-5 pointer-events-none hidden lg:block">
        <HelpCircle size={140} className="text-ink" />
      </div>

      <div className="mx-auto max-w-3xl relative z-10">
        <FAQHeader />
        <FAQAccordion />

        {/* Contact CTA */}
        <div className="mt-10 text-center">
          <p className="text-body-sm text-ink-subtle">
            {t("footer.prompt")}{" "}
            <Link href="/contact" className="text-accent hover:underline font-medium">
              {t("footer.cta")}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
