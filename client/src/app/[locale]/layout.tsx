import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { GoogleTagManager } from "@next/third-parties/google";
import { Toaster } from "sonner";
import "@/app/globals.css";
import { routing } from "@/i18n/routing";
import { dirFor, type Locale } from "@/i18n/locale";
import { glacialIndifference, openSans } from "@/lib/fonts";
import { buildRootMetadata } from "@/lib/seo/metadata";
import { ThemeProvider } from "@/components/theme";
import { AccessibilityProvider, AccessibilityWidget, MotionGuard } from "@/components/accessibility";
import { AuthProvider } from "@/contexts/AuthContext";
import { QueryProvider } from "@/providers/QueryProvider";
import { CookieBanner } from "@/components/cookieBanner";
import { InitialLoader } from "@/components/initialLoader";
import FontReadyGateway from "@/components/FontReadyGateway";
import { StructuredData } from "@/components/StructuredData";
import GTMVerifierWrapper from "@/components/GTMVerifier";
import { BootScripts } from "@/components/boot/BootScripts";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams(): Array<{ locale: Locale }> {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  return buildRootMetadata(locale);
}

export const viewport: Viewport = {
  themeColor: "#F5EDE8",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps): Promise<JSX.Element> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const dir = dirFor(locale);

  return (
    <html
      lang={locale}
      dir={dir}
      suppressHydrationWarning
      className={`${glacialIndifference.variable} ${openSans.variable}`}
    >
      <body dir={dir} className="font-body overflow-x-hidden">
        <BootScripts />
        <InitialLoader />
        {GTM_ID && <GoogleTagManager gtmId={GTM_ID} />}
        <NextIntlClientProvider>
          <ThemeProvider>
            <AccessibilityProvider>
              <MotionGuard>
                <FontReadyGateway>
                  <div id="a11y-content">
                    <QueryProvider>
                      <AuthProvider>{children}</AuthProvider>
                    </QueryProvider>
                    <CookieBanner />
                  </div>
                  <AccessibilityWidget />
                </FontReadyGateway>
              </MotionGuard>
            </AccessibilityProvider>
          </ThemeProvider>
          <Toaster
            position={dir === "rtl" ? "bottom-right" : "bottom-left"}
            richColors
            duration={4000}
            closeButton
          />
        </NextIntlClientProvider>
        <StructuredData />
        <GTMVerifierWrapper />
      </body>
    </html>
  );
}
