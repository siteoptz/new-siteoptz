import Link from "next/link";
import { counterpartsOf } from "@/lib/nav";

export interface BoundaryStatementProps {
  slug: string;
  children: React.ReactNode;
}

/**
 * Calls counterpartsOf(slug) itself and renders the counterpart links from
 * nav.ts — the author never writes these links by hand. Throws at build
 * time if there are none.
 *
 * This is a purely data-driven check against lib/nav.ts's boundary table,
 * not against funnelStage or pageType — the table has 14 entries against 22
 * non-pillar service pages, so eight (including the attribution pillar)
 * legitimately have no counterpart and render no BoundaryStatement at all.
 * The template only calls this component when frontmatter.boundary is
 * present, which is itself required exactly when a counterpart exists.
 */
export default function BoundaryStatement({ slug, children }: BoundaryStatementProps) {
  const counterparts = counterpartsOf(slug);

  if (counterparts.length === 0) {
    throw new Error(
      `BoundaryStatement: counterpartsOf("${slug}") returned no counterparts — every service page must declare a boundary`
    );
  }

  return (
    // The rule hairline reads fine on paper-2 but disappears against raised — accent at
    // reduced opacity keeps the left border visible without turning it into a second link color.
    <div className="border-l-2 border-accent/40 bg-raised py-4 pl-6">
      <div>{children}</div>
      <p className="mt-3 text-sm">
        {counterparts.map((route, index) => (
          <span key={route.path}>
            {index > 0 ? " · " : null}
            <Link href={route.path} className="text-accent hover:text-accent-lt">
              {route.anchorVariants[0] ?? route.label}
            </Link>
          </span>
        ))}
      </p>
    </div>
  );
}
