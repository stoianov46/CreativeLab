import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets the dev server's HMR/data requests through when the site is
  // opened via the LAN IP (e.g. testing from a phone) instead of
  // localhost — otherwise Next.js blocks those as cross-origin for
  // safety, which breaks client-side interactivity (header dropdowns,
  // etc.) even though the initial page still renders.
  allowedDevOrigins: ["192.168.1.101"],

  experimental: {
    // app/global-not-found.tsx: our root layout lives under [locale], which
    // can't host a regular not-found.tsx for unmatched URLs.
    globalNotFound: true,
  },

  images: {
    // AVIF first (smaller), WebP fallback — next/image negotiates per browser.
    formats: ["image/avif", "image/webp"],
  },

  // Security headers on every response (proposal §14 TECH). Fingerprinted
  // /_next/static assets already get immutable caching from Next itself —
  // overriding that is discouraged by the build. No CSP yet: the
  // consent-gated analytics scripts would need their hosts allow-listed —
  // see NOTES.md.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
    ];
  },
};

export default nextConfig;
