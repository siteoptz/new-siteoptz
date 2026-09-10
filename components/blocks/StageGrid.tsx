import Link from "next/link";
import { getServiceEntries } from "@/lib/content";
import { type FunnelStage, type RouteEntry, servicesByStage } from "@/lib/nav";

export interface StageGridProps {
  stage: FunnelStage;
}

interface StageGridRow {
  route: RouteEntry;
  summary: string;
}

/**
 * Lists a stage's services as hairline rows, reading summaries from content
 * — never duplicates copy into the hub. Renders nothing (not an empty
 * container) if there's no matching content yet.
 */
export default async function StageGrid({ stage }: StageGridProps) {
  const routes = servicesByStage(stage);
  if (routes.length === 0) return null;

  const entries = await getServiceEntries();
  const summaryBySlug = new Map(entries.map((entry) => [entry.slug, entry.frontmatter.summary]));

  const rows: StageGridRow[] = [];
  for (const route of routes) {
    const slug = route.path.split("/").pop();
    const summary = slug ? summaryBySlug.get(slug) : undefined;
    if (summary) {
      rows.push({ route, summary });
    }
  }

  if (rows.length === 0) return null;

  return (
    <div>
      {rows.map(({ route, summary }) => (
        <div key={route.path} className="border-b border-rule py-6 first:border-t">
          <Link href={route.path} className="font-display text-blue-600 hover:text-blue-700">
            {route.shortLabel}
          </Link>
          <p className="mt-1 text-muted">{summary}</p>
        </div>
      ))}
    </div>
  );
}
