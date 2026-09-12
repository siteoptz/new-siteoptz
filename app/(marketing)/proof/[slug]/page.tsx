import { notFound } from "next/navigation";
import CrossLinks from "@/components/blocks/CrossLinks";
import DefinitionList from "@/components/blocks/DefinitionList";
import MetricTable from "@/components/blocks/MetricTable";
import PageHero from "@/components/blocks/PageHero";
import QuoteBlock from "@/components/blocks/QuoteBlock";
import Breadcrumbs, { type BreadcrumbItem } from "@/components/layout/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import Container from "@/components/ui/Container";
import Prose from "@/components/ui/Prose";
import Section from "@/components/ui/Section";
import SectionHead from "@/components/ui/SectionHead";
import { type ContentEntry, type ProofFrontmatter, getProofEntries } from "@/lib/content";
import { getRoute } from "@/lib/nav";
import { buildArticle, buildBreadcrumbList } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

export const dynamicParams = false;

type ProofEntry = ContentEntry<ProofFrontmatter>;

async function getEntry(slug: string): Promise<ProofEntry> {
  const entries = await getProofEntries();
  const entry = entries.find((candidate) => candidate.slug === slug);
  if (!entry) notFound();
  return entry;
}

/**
 * frontmatter dates are calendar dates ("2026-09-11"), not timestamps —
 * force UTC so the displayed date always matches what's written in the MDX,
 * same reasoning as the point-of-view article template's formatDate.
 */
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** situation / whatWasUnmeasurable / whatWeBuilt are single frontmatter strings that may contain blank-line-separated paragraphs. */
function renderParagraphs(text: string) {
  return text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph, index) => <p key={index}>{paragraph}</p>);
}

export async function generateStaticParams() {
  const entries = await getProofEntries();
  return entries.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = await getEntry(slug);
  return buildMetadata({
    title: entry.frontmatter.title,
    description: entry.frontmatter.description,
    path: `/proof/${slug}`,
  });
}

export default async function ProofDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = await getEntry(slug);
  const fm = entry.frontmatter;
  const industry = getRoute(`/industries/${fm.industrySlug}`);

  const trail: BreadcrumbItem[] = [
    { name: "Home", path: "/" },
    { name: "Proof", path: "/proof" },
    { name: fm.title, path: `/proof/${slug}` },
  ];

  const articleSchema = buildArticle({
    headline: fm.title,
    description: fm.description,
    path: `/proof/${slug}`,
    authorName: "SiteOptz",
    publishedAt: fm.publishedAt,
    updatedAt: fm.updatedAt,
  });
  const breadcrumbSchema = buildBreadcrumbList(trail);

  return (
    <div>
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />

      <Section surface="base">
        <Container>
          <Breadcrumbs trail={trail} />
          <PageHero kicker={industry.label} heading={fm.title} lead={fm.description} />
          <p className="mt-6 text-sm text-muted">
            Approved by {fm.approvedBy.name}, {formatDate(fm.approvedBy.date)}
          </p>
        </Container>
      </Section>

      <Section surface="raised">
        <Container>
          <SectionHead heading="The situation" />
          <Prose>{renderParagraphs(fm.situation)}</Prose>
        </Container>
      </Section>

      <Section surface="base">
        <Container>
          <SectionHead heading="What was unmeasurable" />
          <Prose>{renderParagraphs(fm.whatWasUnmeasurable)}</Prose>
        </Container>
      </Section>

      <Section surface="raised">
        <Container>
          <SectionHead heading="What we built" />
          <Prose>{renderParagraphs(fm.whatWeBuilt)}</Prose>
        </Container>
      </Section>

      <Section surface="base">
        <Container>
          <SectionHead heading="What changed" />
          <MetricTable
            caption={fm.whatChanged.caption}
            columns={fm.whatChanged.columns}
            rows={fm.whatChanged.rows}
            source={fm.whatChanged.source}
          />
        </Container>
      </Section>

      <Section surface="raised">
        <Container>
          <SectionHead heading="Timeline" />
          <DefinitionList
            items={fm.timeline.map((stage) => ({ term: stage.label, definition: stage.description }))}
          />
        </Container>
      </Section>

      <Section surface="base">
        <Container>
          <QuoteBlock
            quote={fm.quote.quote}
            name={fm.quote.name}
            role={fm.quote.role}
            organization={fm.quote.organization}
          />
        </Container>
      </Section>

      <Section surface="raised">
        <Container>
          <SectionHead heading="Services used" />
          <CrossLinks slugs={fm.servicesUsed} />
        </Container>
      </Section>
    </div>
  );
}
