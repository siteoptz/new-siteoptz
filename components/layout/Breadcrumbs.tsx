import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";
import { buildBreadcrumbList } from "@/lib/schema";

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export interface BreadcrumbsProps {
  trail: BreadcrumbItem[];
  /** "reading" is the article template's one light surface; every other page stays "dark". */
  variant?: "dark" | "reading";
}

const TEXT_CLASSES: Record<NonNullable<BreadcrumbsProps["variant"]>, string> = {
  dark: "text-muted",
  reading: "text-reading-ink/65",
};

// Dark-variant links never had a resting color distinct from the trail's own muted
// text — only the hover state changed. Reading gives its links --color-reading-accent
// at rest, per the article template's "links use reading-accent" rule.
const LINK_CLASSES: Record<NonNullable<BreadcrumbsProps["variant"]>, string> = {
  dark: "text-muted hover:text-white",
  reading: "text-reading-accent hover:text-reading-ink",
};

/**
 * Renders the visible trail and its BreadcrumbList JSON-LD from the same
 * array, so the two can never diverge. Current page is plain text with
 * aria-current, not a link.
 */
export default function Breadcrumbs({ trail, variant = "dark" }: BreadcrumbsProps) {
  const textClass = TEXT_CLASSES[variant];
  const linkClass = LINK_CLASSES[variant];

  return (
    <nav aria-label="Breadcrumb">
      <JsonLd data={buildBreadcrumbList(trail)} />
      <ol className={`flex flex-wrap items-center gap-2 text-sm ${textClass}`}>
        {trail.map((item, index) => {
          const isLast = index === trail.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-2">
              {isLast ? (
                <span aria-current="page">{item.name}</span>
              ) : (
                <Link href={item.path} className={linkClass}>
                  {item.name}
                </Link>
              )}
              {isLast ? null : (
                // --color-rule is a low-opacity overlay now, not a solid color — invisible as
                // text. muted (or its reading-surface equivalent) is the solid equivalent for a
                // separator that still needs to read.
                <span aria-hidden="true" className={textClass}>
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
