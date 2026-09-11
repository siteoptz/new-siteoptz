import { notFound } from "next/navigation";
import BoundaryStatement from "@/components/blocks/BoundaryStatement";
import CrossLinks from "@/components/blocks/CrossLinks";
import CTABand from "@/components/blocks/CTABand";
import FAQ from "@/components/blocks/FAQ";
import PageHero from "@/components/blocks/PageHero";
import StageGrid from "@/components/blocks/StageGrid";
import Breadcrumbs, { type BreadcrumbItem } from "@/components/layout/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import Container from "@/components/ui/Container";
import Prose from "@/components/ui/Prose";
import Section from "@/components/ui/Section";
import { type ContentEntry, type ServiceFrontmatter, getServiceEntries } from "@/lib/content";
import { getRoute, type RouteEntry } from "@/lib/nav";
import { buildService } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

export const dynamicParams = false;

const CONTACT_CTA = { label: "Book a call", href: "/contact" };

async function getEntry(slug: string): Promise<ContentEntry<ServiceFrontmatter>> {
  const entries = await getServiceEntries();
  const entry = entries.find((candidate) => candidate.slug === slug);
  if (!entry) notFound();
  return entry;
}

function buildTrail(route: RouteEntry): BreadcrumbItem[] {
  const trail: BreadcrumbItem[] = [];
  let current: RouteEntry | null = route;
  while (current) {
    trail.unshift({ name: current.label, path: current.path });
    current = current.parent ? getRoute(current.parent) : null;
  }
  return trail;
}

export async function generateStaticParams() {
  const entries = await getServiceEntries();
  return entries.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = await getEntry(slug);
  return buildMetadata({
    title: entry.frontmatter.title,
    description: entry.frontmatter.description,
    path: `/services/${slug}`,
  });
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = await getEntry(slug);
  const fm = entry.frontmatter;
  const route = getRoute(`/services/${slug}`);
  const trail = buildTrail(route);

  const serviceSchema = buildService({
    name: fm.h1,
    description: fm.description,
    path: route.path,
  });
  // BreadcrumbList JSON-LD is rendered by <Breadcrumbs> itself, and
  // FAQPage JSON-LD by <FAQ> itself — not duplicated here.

  if (fm.pageType === "hub") {
    return (
      <div>
        <JsonLd data={serviceSchema} />
        <Section surface="navy">
          <Container>
            <Breadcrumbs trail={trail} />
            <PageHero kicker={fm.heroKicker} heading={fm.h1} lead={fm.lead} />
          </Container>
        </Section>

        <Section surface="paper">
          <Container>
            <Prose>{entry.content}</Prose>
          </Container>
        </Section>

        <Section surface="paper-2">
          <Container>
            <StageGrid stage={fm.funnelStage} />
          </Container>
        </Section>

        <Section surface="navy">
          <Container>
            <CTABand heading={fm.cta.heading} body={fm.cta.body} cta={CONTACT_CTA} />
          </Container>
        </Section>
      </div>
    );
  }

  return (
    <div>
      <JsonLd data={serviceSchema} />

      <Section surface="navy">
        <Container>
          <Breadcrumbs trail={trail} />
          <PageHero kicker={fm.heroKicker} heading={fm.h1} lead={fm.lead} />
        </Container>
      </Section>

      {fm.funnelStage !== "cross" && fm.boundary ? (
        <Section surface="paper-2">
          <Container>
            <BoundaryStatement slug={slug} funnelStage={fm.funnelStage}>
              <p>{fm.boundary}</p>
            </BoundaryStatement>
          </Container>
        </Section>
      ) : null}

      <Section surface="paper">
        <Container>
          <Prose>{entry.content}</Prose>
        </Container>
      </Section>

      {fm.faq ? (
        <Section surface="paper-2">
          <Container>
            <FAQ items={fm.faq} />
          </Container>
        </Section>
      ) : null}

      {fm.crossLinks ? (
        <Section surface="paper">
          <Container>
            <CrossLinks slugs={fm.crossLinks} />
          </Container>
        </Section>
      ) : null}

      <Section surface="navy">
        <Container>
          <CTABand heading={fm.cta.heading} body={fm.cta.body} cta={CONTACT_CTA} />
        </Container>
      </Section>
    </div>
  );
}
