/**
 * TermsHeader Component
 * Header section for the terms of use page.
 */

import { getTranslations, getFormatter } from "next-intl/server";
import { FileText } from "lucide-react";
import { LEGAL_LAST_UPDATED } from "../constants";

export async function TermsHeader(): Promise<JSX.Element> {
  const t = await getTranslations("legal.terms");
  const format = await getFormatter();

  return (
    <div className="text-center mb-10">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-soft mb-5">
        <FileText size={32} className="text-accent" />
      </div>

      <h1 className="text-title-lg text-ink mb-5">{t("title")}</h1>

      <p className="text-caption text-ink-subtle mt-2">
        {t("lastUpdatedLabel")} {format.dateTime(LEGAL_LAST_UPDATED, { dateStyle: "long" })}
      </p>
    </div>
  );
}
