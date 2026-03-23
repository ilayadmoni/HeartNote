import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { inter, glacialIndifference, openSans } from "@/lib/fonts";
import { ThemeProvider } from "@/components/theme";
import {
  AccessibilityProvider,
  AccessibilityWidget,
} from "@/components/accessibility";
import { AuthProvider } from "@/contexts/AuthContext";
import { QueryProvider } from "@/providers/QueryProvider";
import { CookieBanner } from "@/components/cookieBanner";
import { InitialLoader } from "@/components/initialLoader";
import FontReadyGateway from "@/components/FontReadyGateway";
import { Toaster } from "sonner";
import { StructuredData } from "@/components/StructuredData";
import { GoogleTagManager } from "@next/third-parties/google";
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

export const metadata: Metadata = {
  metadataBase: new URL("https://www.heartnote.co.il"),
  title: "HeartNote | יצירת ברכות דיגיטליות",
  description:
    "הפתיעו את האנשים שאתם אוהבים עם ברכה דיגיטלית ואינטראקטיבית. בחרו מתוך מגוון תבניות: גלגל החלטות, כרטיס גירוד, הזמנה לדייט, ציר זמן, קופוני אהבה, חידון חברות ועוד. בואו נתחיל ליצור ביחד.",
  applicationName: "HeartNote",
  keywords: [
    "ברכות",
    "ברכה דיגיטלית",
    "ברכה",
    "ברכה ליום הולדת",
    "ברכה ליום האהבה",
    "ברכה לחג",
    "יצירת ברכות",
    "עיצוב ברכות דיגיטליות",
    "אירועים",
    "HeartNote",
  ],
  authors: [{ name: "HeartNote", url: "https://www.heartnote.co.il" }],
  creator: "HeartNote",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/assets/images/logo_heartnote.png",
    apple: "/assets/images/logo_heartnote.png",
    shortcut: "/assets/images/logo_heartnote.png",
  },
  openGraph: {
    title: "HeartNote | יצירת ברכות דיגיטליות",
    description:
      "הפתיעו את האנשים שאתם אוהבים עם ברכה דיגיטלית ואינטראקטיבית. בחרו מתוך מגוון תבניות: גלגל החלטות, כרטיס גירוד, הזמנה לדייט, ציר זמן, קופוני אהבה, חידון חברות ועוד. בואו נתחיל ליצור ביחד.",
    url: "https://www.heartnote.co.il",
    siteName: "HeartNote",
    locale: "he_IL",
    type: "website",
    images: [
      {
        url: "/assets/images/full_logo.png",
        width: 1200,
        height: 630,
        alt: "HeartNote - יצירת ברכות דיגיטליות",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HeartNote | יצירת ברכות דיגיטליות",
    description:
      "הפתיעו את האנשים שאתם אוהבים עם ברכה דיגיטלית ואינטראקטיבית. בחרו מתוך מגוון תבניות: גלגל החלטות, כרטיס גירוד, הזמנה לדייט, ציר זמן, קופוני אהבה, חידון חברות ועוד. בואו נתחיל ליצור ביחד.",
    images: ["/assets/images/full_logo.png"],
    creator: "@HeartNote",
  },
};

export const viewport: Viewport = {
  themeColor: "#faf7f5",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="he"
      dir="rtl"
      suppressHydrationWarning
      className={`${inter.variable} ${glacialIndifference.variable} ${openSans.variable}`}
    >
      <body className={`${inter.className} overflow-x-hidden`}>
        {/* Inline script to prevent FOUT: applies app-loading class before React hydrates.
            This ensures the loading screen is shown before any unstyled content paints.
            The FontReadyGateway component removes this class once fonts are ready. */}
        <Script id="prevent-fout" strategy="beforeInteractive">
          {`
            (function() {
              if (document.documentElement.classList) {
                document.documentElement.classList.add('app-loading');
              }
            })();
          `}
        </Script>

        {/* Pre-hydration loading screen — visible before React mounts */}
        <InitialLoader />

        {/* Google Consent Mode v2 — default all to denied */}
        <Script id="gtm-consent-default" strategy="beforeInteractive">
          {`
            function gtag(){(window.dataLayer=window.dataLayer||[]).push(arguments);}
            gtag('consent', 'default', {
              ad_storage: 'denied',
              analytics_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              wait_for_update: 500
            });
          `}
        </Script>

        {/* Official Next.js Google Tag Manager Component */}
        {GTM_ID && <GoogleTagManager gtmId={GTM_ID} />}

        <ThemeProvider>
          <AccessibilityProvider>
            <FontReadyGateway>
              <div id="a11y-content">
                <AuthProvider>
                  <QueryProvider>{children}</QueryProvider>
                </AuthProvider>
                <CookieBanner />
              </div>
              <AccessibilityWidget />
            </FontReadyGateway>
          </AccessibilityProvider>
        </ThemeProvider>
        <Toaster
          position="bottom-right"
          richColors
          duration={4000}
          closeButton
        />
        <StructuredData />
      </body>
    </html>
  );
}
