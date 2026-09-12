import type { Metadata } from "next";
import Script from "next/script";
import JsonLd from "@/components/seo/JsonLd";
import { buildOrganization, buildWebSite } from "@/lib/schema";
import { fontDisplay, fontSans, fontSerif } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "SiteOptz",
  description: "SiteOptz",
};

/**
 * GTM loads only on a real production deploy with a container configured —
 * never on preview/staging, so preview traffic never pollutes analytics.
 * GA4 is configured inside the container itself, not hardcoded here.
 */
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const GTM_ENABLED = process.env.VERCEL_ENV === "production" && Boolean(GTM_ID);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fontDisplay.variable} ${fontSans.variable} ${fontSerif.variable}`}
    >
      <body>
        {GTM_ENABLED ? (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height={0}
              width={0}
              title="Google Tag Manager"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        ) : null}
        {GTM_ENABLED ? (
          <Script id="gtm" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');`}
          </Script>
        ) : null}
        <JsonLd
          data={buildOrganization({
            name: "SiteOptz",
            logoUrl: "/logo-512.png",
            email: "info@siteoptz.com",
          })}
        />
        <JsonLd data={buildWebSite({ name: "SiteOptz" })} />
        {children}
      </body>
    </html>
  );
}
