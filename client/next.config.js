/** @type {import('next').NextConfig} */

// SEC-HIGH-5: Content Security Policy
// Allows: self, Supabase (REST/Storage/Realtime), Google Tag Manager/Analytics,
// Dicebear avatars, Google profile images.
const cspDirectives = [
  "default-src 'self'",
  "worker-src 'self' blob:;",
  // Next.js inlines a bootstrap script; GTM loads additional scripts from googletagmanager.
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
  // Tailwind + Framer Motion generate inline styles; Google Fonts issues stylesheets.
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  [
    "img-src 'self' data: blob:",
    "https://*.supabase.co",
    "https://api.dicebear.com",
    "https://lh3.googleusercontent.com",
    "https://www.google-analytics.com",
    "https://www.googletagmanager.com",
  ].join(" "),
  [
    "connect-src 'self'",
    "https://*.supabase.co",
    "wss://*.supabase.co",
    "https://www.google-analytics.com",
    "https://www.googletagmanager.com",
    "https://region1.google-analytics.com",
  ].join(" "),
  "frame-src 'self' https://www.googletagmanager.com",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  // Only upgrade insecure requests in production (HTTPS). In local HTTP dev/LAN
  // testing this directive causes browsers to silently rewrite all fetches to
  // HTTPS, which fails because the dev server only listens on HTTP.
  ...(process.env.NODE_ENV === "production" ? ["upgrade-insecure-requests"] : []),
].join("; ");

// Security headers for all routes
const securityHeaders = [
  { key: "Content-Security-Policy", value: cspDirectives },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_SUPABASE_URL:
      process.env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost:8000",
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || "HeartNote",
  },
  images: {
    remotePatterns: [
      // Supabase Storage
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      // HeartNote production domain
      {
        protocol: "https",
        hostname: "www.heartnote.co.il",
      },
      {
        protocol: "https",
        hostname: "heartnote.co.il",
      },
      // Google profile avatars
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },
  // SEC-MED-4: Limit Server Action body size
  experimental: {
    serverActions: {
      bodySizeLimit: "1mb",
    },
  },
  // SEC-MED-1: Security headers
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};


module.exports = nextConfig;
