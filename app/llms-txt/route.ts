/**
 * Serves /llms.txt — next.config.ts rewrites that public path to this
 * route, since Next's file-system router does not treat a literal dot in
 * a folder name as a normal route segment.
 *
 * No major AI provider currently commits to reading or acting on
 * llms.txt. It is not a crawler directive the way robots.txt is, and
 * nothing about this site's positioning, discoverability, or SEO plan
 * should depend on anything reading this file. It exists as a cheap,
 * honestly-labeled experiment, not infrastructure the business relies on.
 *
 * Generated from lib/nav.ts and each entry's own frontmatter, not
 * hand-written — adding a route to nav.ts, or a new article, changes this
 * file's output the next time it builds, rather than requiring someone to
 * remember to update a second, hardcoded list.
 */
import { getIndustryEntries, getPointOfViewEntries, getServiceEntries } from "@/lib/content";
import { getRoute, industriesList } from "@/lib/nav";

// No request-time data is used here — prerender once at build time, the
// same as sitemap.ts and robots.ts, rather than regenerating this on every
// request.
export const dynamic = "force-static";

/** The same positioning line used in the footer — reused, not rewritten. */
const SITE_POSITIONING =
  "We build the measurement layer that connects what you spend to what your business books, then run the acquisition programs on top of it.";

const HUB_SLUGS = ["top-of-funnel", "middle-of-funnel", "bottom-of-funnel"] as const;
const COMPANY_PATHS = ["/how-it-works", "/proof", "/contact"] as const;

/** Articles store `title` with the same " | SiteOptz" meta suffix every other collection uses. */
function stripSiteSuffix(title: string): string {
  return title.replace(/\s*\|\s*SiteOptz\s*$/i, "");
}

function linkLine(label: string, path: string, description: string): string {
  return `- [${label}](${path}): ${description}`;
}

function section(heading: string, lines: readonly string[]): string {
  return [`## ${heading}`, "", ...lines].join("\n");
}

export async function GET() {
  const [services, industries, articles] = await Promise.all([
    getServiceEntries(),
    getIndustryEntries(),
    getPointOfViewEntries(),
  ]);

  const serviceBySlug = new Map(services.map((entry) => [entry.slug, entry]));
  const industryBySlug = new Map(industries.map((entry) => [entry.slug, entry]));

  const pillarRoute = getRoute("/services/marketing-attribution");
  const pillarEntry = serviceBySlug.get("marketing-attribution");
  const attributionSection = section("Attribution", [
    linkLine(pillarRoute.label, pillarRoute.path, pillarEntry?.frontmatter.description ?? ""),
  ]);

  const hubLines = HUB_SLUGS.map((slug) => {
    const route = getRoute(`/services/${slug}`);
    const entry = serviceBySlug.get(slug);
    return linkLine(route.label, route.path, entry?.frontmatter.description ?? "");
  });
  const funnelSection = section("Funnel Stages", hubLines);

  const industryLines = industriesList().map((route) => {
    const slug = route.path.split("/").pop() ?? "";
    const entry = industryBySlug.get(slug);
    return linkLine(route.label, route.path, entry?.frontmatter.description ?? "");
  });
  const industriesSection = section("Industries", industryLines);

  const articleLines = [...articles]
    .sort((a, b) => new Date(b.frontmatter.publishedAt).getTime() - new Date(a.frontmatter.publishedAt).getTime())
    .map((entry) =>
      linkLine(
        stripSiteSuffix(entry.frontmatter.title),
        `/point-of-view/${entry.slug}`,
        entry.frontmatter.description
      )
    );
  const pointOfViewSection = section("Point of View", articleLines);

  const companyLines = COMPANY_PATHS.map((path) => {
    const route = getRoute(path);
    return linkLine(route.label, route.path, route.description);
  });
  const companySection = section("Company", companyLines);

  const body =
    [
      "# SiteOptz",
      "",
      `> ${SITE_POSITIONING}`,
      "",
      attributionSection,
      "",
      funnelSection,
      "",
      industriesSection,
      "",
      pointOfViewSection,
      "",
      companySection,
    ].join("\n") + "\n";

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
