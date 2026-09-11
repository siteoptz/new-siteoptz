import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs, { type BreadcrumbItem } from "@/components/layout/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import Container from "@/components/ui/Container";
import Prose from "@/components/ui/Prose";
import Section from "@/components/ui/Section";
import { type ArticleEntry, getPointOfViewEntries } from "@/lib/content";
import { buildArticle, buildPerson } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

export const dynamicParams = false;

async function getEntry(slug: string): Promise<ArticleEntry> {
  const entries = await getPointOfViewEntries();
  const entry = entries.find((candidate) => candidate.slug === slug);
  if (!entry) notFound();
  return entry;
}

/** Articles store `title` with the same " | SiteOptz" meta suffix every other collection uses; the on-page heading strips it back off. */
function stripSiteSuffix(title: string): string {
  return title.replace(/\s*\|\s*SiteOptz\s*$/i, "");
}

/**
 * frontmatter dates are calendar dates ("2026-09-11"), not timestamps.
 * `new Date(iso)` parses that as UTC midnight, so formatting it in the
 * server's local timezone can display the day before — force UTC so the
 * displayed date always matches what's written in the MDX.
 */
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export async function generateStaticParams() {
  const entries = await getPointOfViewEntries();
  return entries.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = await getEntry(slug);
  return buildMetadata({
    title: entry.frontmatter.title,
    description: entry.frontmatter.description,
    path: `/point-of-view/${slug}`,
  });
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = await getEntry(slug);
  const fm = entry.frontmatter;
  const heading = stripSiteSuffix(fm.title);

  const allEntries = await getPointOfViewEntries();
  const related = fm.relatedSlugs
    .map((relatedSlug) => allEntries.find((candidate) => candidate.slug === relatedSlug))
    .filter((candidate): candidate is ArticleEntry => candidate !== undefined);

  const trail: BreadcrumbItem[] = [
    { name: "Home", path: "/" },
    { name: "Point of View", path: "/point-of-view" },
    { name: heading, path: `/point-of-view/${slug}` },
  ];

  const articleSchema = buildArticle({
    headline: heading,
    description: fm.description,
    path: `/point-of-view/${slug}`,
    authorName: fm.author.name,
    publishedAt: fm.publishedAt,
    updatedAt: fm.updatedAt,
  });
  const personSchema = buildPerson({ name: fm.author.name, role: fm.author.role });

  const showUpdated = fm.updatedAt !== fm.publishedAt;

  return (
    <div>
      <JsonLd data={articleSchema} />
      <JsonLd data={personSchema} />

      <Section surface="base">
        <Container>
          <Breadcrumbs trail={trail} />
          <h1 className="mt-4 max-w-[28ch] font-serif text-[2rem] leading-[1.2] min-[900px]:text-[2.5rem]">
            {heading}
          </h1>
          <p className="mt-4 max-w-[var(--measure-sans)] text-muted">{fm.description}</p>
          <div className="mt-6 text-sm text-muted">
            <span>
              {fm.author.name}, {fm.author.role}
            </span>
            <span className="mx-2">·</span>
            <span>Published {formatDate(fm.publishedAt)}</span>
            {showUpdated ? (
              <>
                <span className="mx-2">·</span>
                <span>Updated {formatDate(fm.updatedAt)}</span>
              </>
            ) : null}
          </div>
        </Container>
      </Section>

      <Section surface="reading">
        <Container>
          <div className="grid grid-cols-1 gap-10 min-[1100px]:grid-cols-[220px_1fr]">
            {entry.headings.length > 0 ? (
              <nav
                aria-label="Table of contents"
                className="min-[1100px]:sticky min-[1100px]:top-24 min-[1100px]:self-start"
              >
                {/* text-muted measures 2.6:1 on the reading surface — reading-ink/65 is this
                    section's own equivalent secondary-text tone, clearing 4.5:1. */}
                <p className="font-display text-sm text-reading-ink/65">In this article</p>
                <ul className="mt-3">
                  {entry.headings.map((h) => (
                    // border-rule is a warm overlay tuned for dark surfaces and disappears on
                    // reading's light background — reading-ink at low opacity is the equivalent
                    // here. /15 measured as barely perceptible on screen; /25 is the value that
                    // actually reads as a deliberate hairline rather than a rendering fluke.
                    <li key={h.id} className="border-t border-reading-ink/25 py-2 first:border-t-0">
                      <a href={`#${h.id}`} className="text-sm text-reading-accent">
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : null}

            <article>
              <Prose variant="serif">{entry.content}</Prose>
            </article>
          </div>
        </Container>
      </Section>

      {related.length > 0 ? (
        <Section surface="raised">
          <Container>
            <p className="font-display text-sm text-muted">Related</p>
            <div className="mt-4 grid grid-cols-1 gap-px bg-rule min-[900px]:grid-cols-2">
              {related.map((article) => (
                <Link
                  key={article.slug}
                  href={`/point-of-view/${article.slug}`}
                  className="bg-base p-6 hover:brightness-110"
                >
                  <p className="font-display text-accent">
                    {stripSiteSuffix(article.frontmatter.title)}
                  </p>
                  <p className="mt-1 text-sm text-muted">{article.frontmatter.dek}</p>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}
    </div>
  );
}
