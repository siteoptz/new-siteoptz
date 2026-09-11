import Link from "next/link";
import AttributionChain from "@/components/blocks/AttributionChain";
import DefinitionList from "@/components/blocks/DefinitionList";
import MetricTable from "@/components/blocks/MetricTable";
import QuoteBlock from "@/components/blocks/QuoteBlock";
import { getRoute } from "./nav";

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
