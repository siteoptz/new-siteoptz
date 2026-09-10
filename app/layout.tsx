import type { Metadata } from "next";
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
      <body>{children}</body>
    </html>
  );
}
