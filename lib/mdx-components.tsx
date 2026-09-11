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
 */
function ArticleH2({ children }: { children?: React.ReactNode }) {
  const id = slugifyHeading(flattenText(children));
  return <h2 id={id}>{children}</h2>;
}

/**
 * The only components content/point-of-view MDX may use. No AttributionChain
 * — that is a service-page device, not an editorial one.
 */
export const articleMdxComponents = {
  DefinitionList,
  MetricTable,
  QuoteBlock,
  a: MdxAnchor,
  h2: ArticleH2,
};
