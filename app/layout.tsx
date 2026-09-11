import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { buildOrganization, buildWebSite } from "@/lib/schema";
import { fontDisplay, fontSans, fontSerif } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "SiteOptz",
  description: "SiteOptz",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fontDisplay.variable} ${fontSans.variable} ${fontSerif.variable}`}
    >
      <body>
        <JsonLd
          data={buildOrganization({
            name: "SiteOptz",
            logoUrl: "/favicon.ico",
            email: "info@siteoptz.com",
          })}
        />
        <JsonLd data={buildWebSite({ name: "SiteOptz" })} />
        {children}
      </body>
    </html>
  );
}
