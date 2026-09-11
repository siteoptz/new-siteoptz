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

      <Section surface="navy">
        <Container>
          <Breadcrumbs trail={trail} />
          <h1 className="mt-4 max-w-[28ch] font-serif text-[2rem] leading-[1.2] min-[900px]:text-[2.5rem]">
            {heading}
          </h1>
          <p className="mt-4 max-w-[var(--measure-sans)] text-[#B7C4DA]">{fm.description}</p>
          <div className="mt-6 text-sm text-[#93A3BD]">
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

      <Section surface="paper">
        <Container>
          <div className="grid grid-cols-1 gap-10 min-[1100px]:grid-cols-[220px_1fr]">
            {entry.headings.length > 0 ? (
              <nav
                aria-label="Table of contents"
                className="min-[1100px]:sticky min-[1100px]:top-24 min-[1100px]:self-start"
              >
                <p className="font-display text-sm text-muted">In this article</p>
                <ul className="mt-3">
                  {entry.headings.map((h) => (
                    <li key={h.id} className="border-t border-rule py-2 first:border-t-0">
                      <a href={`#${h.id}`} className="text-sm text-blue-600 hover:text-blue-700">
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
        <Section surface="paper-2">
          <Container>
            <p className="font-display text-sm text-muted">Related</p>
            <div className="mt-4 grid grid-cols-1 gap-px bg-rule min-[900px]:grid-cols-2">
              {related.map((article) => (
                <Link
                  key={article.slug}
                  href={`/point-of-view/${article.slug}`}
                  className="bg-paper p-6 hover:bg-paper-2"
                >
                  <p className="font-display text-blue-600">
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
