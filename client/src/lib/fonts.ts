/**
 * Font Configuration with next/font
 * Preloads all fonts in the HTML <head> to eliminate FOUT
 */

import { Inter } from "next/font/google";
import localFont from "next/font/local";

// Google Font - system UI fallback
export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Custom Font - GlacialIndifference (brand logo/headings)
export const glacialIndifference = localFont({
  src: [
    {
      path: "../../public/assets/fonts/Glacial-Indifference-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/assets/fonts/Glacial-Indifference-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-glacial-indifference",
  display: "swap",
});

// Custom Font - OpenSans Hebrew (body text & Hebrew typography)
export const openSans = localFont({
  src: [
    {
      path: "../../public/assets/fonts/Open-Sans-Hebrew-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/assets/fonts/Open-Sans-Hebrew-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-open-sans",
  display: "swap",
});
