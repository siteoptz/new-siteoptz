import Link from "next/link";
import type { ArticleEntry } from "@/lib/content";

export interface RelatedReadingProps {
  /**
   * Articles already resolved via lib/content.ts's getSupportingArticles —
   * fetched once by the page (which also needs to know whether this list is
   * empty, to pick the right section surface) rather than fetched again
   * here, so a page with several optional sections doesn't recompile every
   * article's MDX twice.
   */
  articles: ArticleEntry[];
}

/** Articles store `title` with the same " | SiteOptz" meta suffix every other collection uses. */
function stripSiteSuffix(title: string): string {
  return title.replace(/\s*\|\s*SiteOptz\s*$/i, "");
}

/**
 * frontmatter dates are calendar dates ("2026-09-11"), not timestamps.
 * `new Date(iso)` parses that as UTC midnight, so formatting it in the
 * server's local timezone can display the day before — force UTC.
 */
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/**
 * The reciprocal half of the topic-cluster link: lists point-of-view
 * articles that name this page in supportsServices or supportsIndustries.
 * Renders nothing at all — not an empty container, not a heading with
 * nothing under it — when no article supports the page yet, since article
 * support is emergent rather than a gap to apologize for. Same degradation
 * pattern as StageGrid and the article template's own "Related" section.
 */
export default function RelatedReading({ articles }: RelatedReadingProps) {
  if (articles.length === 0) return null;

  return (
    <div>
      <p className="font-display text-sm text-muted">Related reading</p>
      <div className="mt-4 grid grid-cols-1 gap-px bg-rule min-[900px]:grid-cols-2">
        {articles.map((article, index) => {
          // A lone leftover card in an odd-count grid spans both columns instead of
          // leaving an empty cell — same fix the article template's own related-articles
          // grid uses, for the same reason (an empty cell paints no divider background).
          const isTrailingOdd = articles.length % 2 === 1 && index === articles.length - 1;
          return (
            <Link
              key={article.slug}
              href={`/point-of-view/${article.slug}`}
              className={`bg-base p-6 hover:bg-raised ${isTrailingOdd ? "min-[900px]:col-span-2" : ""}`}
            >
              <p className="font-display text-accent">{stripSiteSuffix(article.frontmatter.title)}</p>
              <p className="mt-1 text-sm text-muted">{article.frontmatter.dek}</p>
              <p className="mt-2 text-sm text-muted">{formatDate(article.frontmatter.publishedAt)}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
