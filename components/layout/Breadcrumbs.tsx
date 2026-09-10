import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbList } from "@/lib/schema";

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export interface BreadcrumbsProps {
  trail: BreadcrumbItem[];
}

/**
 * Renders the visible trail and its BreadcrumbList JSON-LD from the same
 * array, so the two can never diverge. Current page is plain text with
 * aria-current, not a link.
 */
export default function Breadcrumbs({ trail }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb">
      <JsonLd data={buildBreadcrumbList(trail)} />
      <ol className="flex flex-wrap items-center gap-2 text-sm text-muted">
        {trail.map((item, index) => {
          const isLast = index === trail.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-2">
              {isLast ? (
                <span aria-current="page">{item.name}</span>
              ) : (
                <Link href={item.path} className="hover:text-ink">
                  {item.name}
                </Link>
              )}
              {isLast ? null : (
                <span aria-hidden="true" className="text-rule">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
