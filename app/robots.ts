import type { MetadataRoute } from "next";

/**
 * Fails closed: disallow all unless VERCEL_ENV is explicitly 'production'.
 * An unset VERCEL_ENV — the case locally and in any misconfigured deploy —
 * disallows.
 */
export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.VERCEL_ENV === "production";

  if (!isProduction) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) {
    throw new Error("app/robots: NEXT_PUBLIC_SITE_URL is not set");
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: new URL("/sitemap.xml", siteUrl).toString(),
  };
}
