import Link from "next/link";
import { getRoute } from "@/lib/nav";

export interface CrossLinksProps {
  /** Exactly three route paths from lib/nav.ts. */
  slugs: string[];
}

/** A row of three sibling links in a 1px grid. Throws if given other than three. */
export default function CrossLinks({ slugs }: CrossLinksProps) {
  if (slugs.length !== 3) {
    throw new Error(`CrossLinks: expected exactly 3 slugs, got ${slugs.length}`);
  }

  const routes = slugs.map((path) => getRoute(path));

  return (
    <div className="grid grid-cols-1 gap-px bg-rule min-[900px]:grid-cols-3">
      {routes.map((route) => (
        <Link key={route.path} href={route.path} className="bg-base p-6 hover:bg-raised">
          <p className="font-display text-accent">{route.shortLabel}</p>
          <p className="mt-1 text-sm text-muted">{route.description}</p>
        </Link>
      ))}
    </div>
  );
}
