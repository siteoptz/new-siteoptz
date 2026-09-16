import Link from "next/link";
import AttributionChain from "@/components/blocks/AttributionChain";
import DefinitionList from "@/components/blocks/DefinitionList";
import MetricTable from "@/components/blocks/MetricTable";
import QuoteBlock from "@/components/blocks/QuoteBlock";
import { getRoute } from "./nav";
import { slugifyHeading } from "./slugify";

function MdxAnchor({ href, children }: { href?: string; children?: React.ReactNode }) {
  if (!href) return <a>{children}</a>;
  const route = getRoute(href);
  return <Link href={route.path}>{children}</Link>;
}

/**
 * The only components content/services MDX may use, plus markdown links
 * (resolved through nav.ts via the `a` override) — nothing else, so content
 * cannot introduce new layout.
 */
export const servicesMdxComponents = {
  DefinitionList,
  MetricTable,
  QuoteBlock,
  AttributionChain,
  a: MdxAnchor,
};

/**
 * Point-of-view articles aren't in nav.ts — that table is the curated,
 * roughly-fixed set of structural routes from docs/sitemap-seo-plan.md,
 * while articles get added ad hoc on their own schedule. An article
 * linking to another article therefore can't go through MdxAnchor's
 * getRoute lookup, which throws on anything nav.ts doesn't know about.
 * This anchor takes the live list of real article slugs instead and
 * resolves a `/point-of-view/<slug>` href against that; anything else
 * still resolves through nav.ts, so a link to a service or industry page
 * from inside an article is validated exactly as strictly as before.
 */
function createArticleMdxAnchor(articleSlugs: readonly string[]) {
  return function ArticleMdxAnchor({ href, children }: { href?: string; children?: React.ReactNode }) {
    if (!href) return <a>{children}</a>;
    const articleSlug = href.match(/^\/point-of-view\/([^/]+)$/)?.[1];
    if (articleSlug) {
      if (!articleSlugs.includes(articleSlug)) {
        throw new Error(`lib/mdx-components: unknown article slug "${articleSlug}" linked from an article body`);
      }
      return <Link href={href}>{children}</Link>;
    }
    const route = getRoute(href);
    return <Link href={route.path}>{children}</Link>;
  };
}

function flattenText(node: React.ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(flattenText).join("");
  if (node && typeof node === "object" && "props" in node) {
    const props = (node as { props?: { children?: React.ReactNode } }).props;
    return flattenText(props?.children);
  }
  return "";
}

/**
 * Assigns the id lib/content.ts's extractH2Headings computed for this exact
 * heading text, via the same slugify function — so the table of contents'
 * anchors and the ids actually rendered here cannot drift apart.
 *
 * tabIndex={-1} makes the heading programmatically focusable without adding
 * it to tab order. The table of contents links are plain `#id` anchors with
 * no JS — browsers move focus to the fragment target as part of native hash
 * navigation, but only when the target is focusable, so without this a
 * screen reader user lands on the section visually with no "you are here"
 * announced.
 */
function ArticleH2({ children }: { children?: React.ReactNode }) {
  const id = slugifyHeading(flattenText(children));
  return (
    <h2 id={id} tabIndex={-1}>
      {children}
    </h2>
  );
}

/**
 * The only components content/point-of-view MDX may use. No AttributionChain
 * — that is a service-page device, not an editorial one. Takes the current
 * list of real article slugs so its anchor override can resolve a link to
 * another article — see createArticleMdxAnchor.
 */
export function createArticleMdxComponents(articleSlugs: readonly string[]) {
  return {
    DefinitionList,
    MetricTable,
    QuoteBlock,
    a: createArticleMdxAnchor(articleSlugs),
    h2: ArticleH2,
  };
}
