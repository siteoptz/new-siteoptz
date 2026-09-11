import Link from "next/link";
import { counterpartsOf, type FunnelStage } from "@/lib/nav";

export interface BoundaryStatementProps {
  slug: string;
  funnelStage: FunnelStage;
  children: React.ReactNode;
}

/**
 * Calls counterpartsOf(slug) itself and renders the counterpart links from
 * nav.ts — the author never writes these links by hand. Throws at build
 * time if there are none, unless funnelStage is 'cross' — the attribution
 * pillar has no counterpart and renders no BoundaryStatement at all, but
 * this guard stays conditional rather than removed so a normal service page
 * missing its boundary still fails loudly.
 */
export default function BoundaryStatement({ slug, funnelStage, children }: BoundaryStatementProps) {
  const counterparts = counterpartsOf(slug);

  if (funnelStage !== "cross" && counterparts.length === 0) {
    throw new Error(
      `BoundaryStatement: counterpartsOf("${slug}") returned no counterparts — every service page must declare a boundary`
    );
  }

  return (
    <div className="border-l-2 border-rule bg-paper-2 py-4 pl-6">
      <div>{children}</div>
      <p className="mt-3 text-sm">
        {counterparts.map((route, index) => (
          <span key={route.path}>
            {index > 0 ? " · " : null}
            <Link href={route.path} className="text-blue-600 hover:text-blue-700">
              {route.anchorVariants[0] ?? route.label}
            </Link>
          </span>
        ))}
      </p>
    </div>
  );
}
