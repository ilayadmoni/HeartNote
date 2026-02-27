import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/theme";
import {
  AccessibilityProvider,
  AccessibilityWidget,
} from "@/components/accessibility";
import { AuthProvider } from "@/contexts/AuthContext";
import { QueryProvider } from "@/providers/QueryProvider";
import { CookieBanner } from "@/components/cookieBanner";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

// Construct metadataBase from environment or fallback
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const metadataBase = new URL(siteUrl);

export const metadata: Metadata = {
  metadataBase,
  title: "HeartNote - מפעל הברכות הדיגיטלי",
  description: "צור ברכות דיגיטליות מרהיבות בקלות ובמהירות",
  keywords: ["ברכות", "ברכה דיגיטלית", "אירועים", "HeartNote"],
  authors: [{ name: "HeartNote", url: siteUrl }],
  creator: "HeartNote",
  icons: {
    icon: "/assets/images/logo_heartnote.png",
    apple: "/assets/images/logo_heartnote.png",
    shortcut: "/assets/images/logo_heartnote.png",
  },
  openGraph: {
    type: "website",
    locale: "he_IL",
    url: siteUrl,
    siteName: "HeartNote",
    title: "HeartNote - מפעל הברכות הדיגיטלי",
    description: "צור ברכות דיגיטליות מרהיבות בקלות ובמהירות",
    images: [
      {
        url: "/assets/images/full_logo.png",
        width: 1200,
        height: 630,
        alt: "HeartNote - מפעל הברכות הדיגיטלי",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HeartNote - מפעל הברכות הדיגיטלי",
    description: "צור ברכות דיגיטליות מרהיבות בקלות ובמהירות",
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
    <html lang="he" dir="rtl" suppressHydrationWarning>
      <body className={`${inter.className} overflow-x-hidden`}>
        {/* Google Consent Mode v2 — default all to denied */}
        <Script id="gtm-consent-default" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              ad_storage: 'denied',
              analytics_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              wait_for_update: 500
            });
          `}
        </Script>

        {/* Google Tag Manager */}
        {GTM_ID && (
          <Script id="gtm-script" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `}
          </Script>
        )}

        {/* GTM noscript fallback */}
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}

        <ThemeProvider>
          <AccessibilityProvider>
            <AuthProvider>
              <QueryProvider>{children}</QueryProvider>
            </AuthProvider>
            <AccessibilityWidget />
          </AccessibilityProvider>
          <CookieBanner />
        </ThemeProvider>
        <Toaster
          position="bottom-right"
          richColors
          duration={4000}
          closeButton
        />
      </body>
    </html>
  );
}
