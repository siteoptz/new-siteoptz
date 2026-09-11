/**
 * Postbuild check: counts contextual internal links actually rendered inside
 * <main> for each static, non-dynamic page.tsx route, using the built HTML
 * in .next/server/app — not the .tsx source. A page whose links come from a
 * .map() over an array (the industries hub's four cards, the point-of-view
 * hub's article list) previously showed one source occurrence in
 * scripts/content-check.ts regardless of how many times it actually
 * rendered; this counts what a reader and a crawler actually see, and gets
 * more accurate as content grows instead of less.
 *
 * Runs as "postbuild" (after `next build`), not "prebuild", because it needs
 * the build's own output to exist — that's also why this is a separate
 * script rather than folded into content-check.ts. The MDX checks and the
 * other .tsx checks (banned words, bracket placeholders, MetricTable and
 * QuoteBlock placeholders) don't need a build and stay in content-check.ts
 * as "prebuild", so those still fail fast without waiting on a full build.
 *
 * Excludes: the breadcrumb nav, and any anchor rendered by the shared
 * Button component — identified by Button's exact base class, not by page
 * structure, since a hero CTA and a CTA-band button both need excluding
 * from a count of contextual body-copy links, and neither is a "nav",
 * "footer", or "breadcrumb" to exclude structurally. header/footer nav
 * links need no separate handling — they render outside <main> entirely.
 *
 * Dynamic `[slug]/page.tsx` templates are excluded, same as
 * content-check.ts's .tsx pass — their real link count comes from the MDX
 * content they render, already covered by checkServicePageDepth /
 * checkArticleLinks there.
 */
import fs from "node:fs";
import path from "node:path";

const APP_ROOT = path.join(process.cwd(), "app");
const NEXT_HTML_ROOT = path.join(process.cwd(), ".next", "server", "app");
const MIN_INTERNAL_LINKS = 4;
const BUTTON_CLASS_SIGNATURE = "inline-flex items-center justify-center rounded-default border";

interface Violation {
  file: string;
  reason: string;
}

function walkAppTsxFiles(): string[] {
  if (!fs.existsSync(APP_ROOT)) return [];
  return fs
    .readdirSync(APP_ROOT, { recursive: true })
    .filter((entry): entry is string => typeof entry === "string" && entry.endsWith(".tsx"))
    .map((entry) => path.join(APP_ROOT, entry));
}

/** app/(marketing)/about/page.tsx -> /about. Route-group segments (in parens) are stripped, matching the URL Next.js actually serves. */
function routePathFor(filePath: string): string {
  const relative = path.relative(APP_ROOT, filePath);
  const segments = relative
    .split(path.sep)
    .filter((segment) => !/^\(.*\)$/.test(segment))
    .filter((segment) => segment !== "page.tsx");
  return segments.length === 0 ? "/" : `/${segments.join("/")}`;
}

function htmlFileFor(routePath: string): string {
  const name = routePath === "/" ? "index" : routePath.slice(1);
  return path.join(NEXT_HTML_ROOT, `${name}.html`);
}

/** Distinct internal hrefs inside <main>, minus the breadcrumb trail and anything rendered by Button. */
function countRenderedInternalLinks(html: string): number {
  const mainContent = /<main\b[^>]*>([\s\S]*)<\/main>/.exec(html)?.[1];
  if (!mainContent) return 0;

  const withoutBreadcrumb = mainContent.replace(/<nav aria-label="Breadcrumb">[\s\S]*?<\/nav>/, "");

  const hrefs = new Set<string>();
  for (const match of withoutBreadcrumb.matchAll(/<a\b([^>]*)>/g)) {
    const tag = match[1] ?? "";
    const href = /\bhref="([^"]*)"/.exec(tag)?.[1];
    if (!href || !href.startsWith("/")) continue;

    const tagClass = /\bclass="([^"]*)"/.exec(tag)?.[1];
    if (tagClass?.includes(BUTTON_CLASS_SIGNATURE)) continue;

    hrefs.add(href.split("#")[0] ?? href);
  }

  return hrefs.size;
}

function main(): void {
  const violations: Violation[] = [];
  const missingBuildOutput: string[] = [];

  for (const filePath of walkAppTsxFiles()) {
    const isPage = path.basename(filePath) === "page.tsx";
    const isDynamicTemplate = filePath.includes("[");
    if (!isPage || isDynamicTemplate) continue;

    const relativePath = path.relative(process.cwd(), filePath);
    const routePath = routePathFor(filePath);
    const htmlPath = htmlFileFor(routePath);

    if (!fs.existsSync(htmlPath)) {
      missingBuildOutput.push(relativePath);
      continue;
    }

    const html = fs.readFileSync(htmlPath, "utf8");
    const count = countRenderedInternalLinks(html);
    if (count < MIN_INTERNAL_LINKS) {
      violations.push({
        file: relativePath,
        reason: `${routePath} renders ${count} contextual internal link(s) inside <main>, below the ${MIN_INTERNAL_LINKS}-link minimum`,
      });
    }
  }

  if (missingBuildOutput.length > 0) {
    console.error("check-rendered-links: no built HTML found for:");
    for (const file of missingBuildOutput) console.error(`  ${file}`);
    console.error("This check reads .next/server/app and must run after `next build`.");
    process.exitCode = 1;
    return;
  }

  if (violations.length === 0) {
    console.log("check-rendered-links: no violations found");
    return;
  }

  console.error(`check-rendered-links: ${violations.length} violation(s) found\n`);
  for (const violation of violations) {
    console.error(`${violation.file} — ${violation.reason}`);
  }

  if (process.env.VERCEL_ENV === "production") {
    console.error("\ncheck-rendered-links: failing the build — VERCEL_ENV is 'production'");
    process.exitCode = 1;
  } else {
    console.error("\ncheck-rendered-links: not failing the build — VERCEL_ENV is not 'production'");
  }
}

main();
