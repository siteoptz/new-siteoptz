import fs from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";

// No password, no login, no session — this route has no authentication of
// any kind. The URL segment below is checked against a single secret held in
// DASHBOARD_SLUG (never committed) and that comparison is the entire access
// control. Anyone holding the exact URL can view the report; do not add
// features here on the assumption that a signed-in check happens elsewhere.

export const metadata = {
  title: "Multi-Location ENT & Allergy Group — Media ROI & Attribution",
  robots: { index: false, follow: false },
};

const REPORT_PATH = path.join(process.cwd(), "app/d/[slug]/report.html");

interface ParsedReport {
  fontLinks: { rel: string; href: string; crossOrigin?: "anonymous" }[];
  css: string;
  bodyHtml: string;
}

/**
 * report.html is authored as a complete, standalone document — openable and
 * printable on its own, offline — not as a fragment. This route can't nest a
 * second <html>/<head>/<body> inside the site's own document, so it pulls out
 * the three pieces that matter (the Google Fonts <link>s, the <style> block,
 * and the <body> contents) and places each where React expects it, instead of
 * dumping the whole document into one dangerouslySetInnerHTML div.
 */
function parseReport(html: string): ParsedReport {
  const fontLinks = Array.from(html.matchAll(/<link\b([^>]*)>/g)).map((match) => {
    const attrs = match[1] ?? "";
    const rel = /\brel="([^"]*)"/.exec(attrs)?.[1] ?? "";
    const href = /\bhref="([^"]*)"/.exec(attrs)?.[1] ?? "";
    const crossOrigin = /\bcrossorigin\b/.test(attrs) ? ("anonymous" as const) : undefined;
    return { rel, href, crossOrigin };
  });

  const css = /<style>([\s\S]*?)<\/style>/.exec(html)?.[1] ?? "";
  const bodyHtml = /<body>([\s\S]*?)<\/body>/.exec(html)?.[1] ?? "";

  return { fontLinks, css, bodyHtml };
}

export default async function ClientDashboardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const expectedSlug = process.env.DASHBOARD_SLUG;

  if (!expectedSlug || slug !== expectedSlug) {
    notFound();
  }

  const html = fs.readFileSync(REPORT_PATH, "utf8");
  const { fontLinks, css, bodyHtml } = parseReport(html);

  return (
    <>
      {fontLinks.map((link) => (
        <link key={link.href} rel={link.rel} href={link.href} crossOrigin={link.crossOrigin} />
      ))}
      <style>{css}</style>
      <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
    </>
  );
}
