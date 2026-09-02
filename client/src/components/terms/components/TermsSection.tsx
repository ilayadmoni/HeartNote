/**
 * TermsSection Component
 * Renders one clause group of the terms of use.
 */

import { getTranslations } from "next-intl/server";
import type { TermsSectionId } from "../constants";

interface TermsSectionProps {
  id: TermsSectionId;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === "string");
}

export async function TermsSection({ id }: TermsSectionProps): Promise<JSX.Element> {
  const t = await getTranslations("legal.terms");
  const title = t(`sections.${id}.title`);
  const raw = t.raw(`sections.${id}.paragraphs`);
  const paragraphs = isStringArray(raw) ? raw : [];

  return (
    <section className="mb-8 last:mb-0" aria-labelledby={title ? `terms-section-${id}` : undefined}>
      {title && (
        <h2 id={`terms-section-${id}`} className="text-title-sm text-ink mb-3">
          {title}
        </h2>
      )}
      <div className="space-y-2 max-w-prose">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="text-body-sm text-ink-muted leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}
