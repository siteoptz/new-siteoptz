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
import Section, { type SectionSurface } from "@/components/ui/Section";
import { type ContentEntry, type ServiceFrontmatter, getServiceEntries } from "@/lib/content";
import { getRoute, type RouteEntry } from "@/lib/nav";
import { buildService } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

export const dynamicParams = false;

const CONTACT_CTA = { label: "Book a call", href: "/contact" };

interface LeafSurfaces {
  hero: SectionSurface;
  boundary: SectionSurface;
  prose: SectionSurface;
  faq: SectionSurface;
  crossLinks: SectionSurface;
  cta: SectionSurface;
}

/**
 * boundary, faq, and crossLinks are each optional per service, so the number
 * of sections actually on the page varies. Assigning every slot a fixed
 * surface risks a run of three or more identical surfaces in a row once
 * enough optional sections are missing (hero, prose, crossLinks, and cta are
 * all "base" by default — today's schema always requires faq for a service
 * page, which keeps that run from happening, but the layout shouldn't depend
 * on that content rule to stay correct). This walks the slots in render
 * order and only falls back to a slot's default surface when it wouldn't sit
 * behind two of the same surface already — two of the same in a row still
 * get the automatic hairline seam (globals.css's `.surface-x + .surface-x`
 * rule), three do not.
 */
function deriveLeafSurfaces(fm: ServiceFrontmatter): LeafSurfaces {
  const slots: Array<{ key: keyof LeafSurfaces; surface: SectionSurface; when: boolean }> = [
    { key: "hero", surface: "base", when: true },
    { key: "boundary", surface: "raised", when: Boolean(fm.boundary) },
    { key: "prose", surface: "base", when: true },
    { key: "faq", surface: "raised", when: Boolean(fm.faq) },
    { key: "crossLinks", surface: "base", when: Boolean(fm.crossLinks) },
    { key: "cta", surface: "base", when: true },
  ];

  const result = {} as LeafSurfaces;
  const rendered: SectionSurface[] = [];

  for (const slot of slots) {
    let surface = slot.surface;
    if (slot.when) {
      const last = rendered[rendered.length - 1];
      const secondLast = rendered[rendered.length - 2];
      if (surface === last && surface === secondLast) {
        surface = surface === "base" ? "raised" : "base";
      }
      rendered.push(surface);
    }
    result[slot.key] = surface;
  }

  return result;
}

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
        <Section surface="base">
          <Container>
            <Breadcrumbs trail={trail} />
            <PageHero kicker={fm.heroKicker} heading={fm.h1} lead={fm.lead} />
          </Container>
        </Section>

        <Section surface="base">
          <Container>
            <Prose>{entry.content}</Prose>
          </Container>
        </Section>

        <Section surface="raised">
          <Container>
            <StageGrid stage={fm.funnelStage} />
          </Container>
        </Section>

        <Section surface="base">
          <Container>
            <CTABand heading={fm.cta.heading} body={fm.cta.body} cta={CONTACT_CTA} />
          </Container>
        </Section>
      </div>
    );
  }

  const surfaces = deriveLeafSurfaces(fm);

  return (
    <div>
      <JsonLd data={serviceSchema} />

      <Section surface={surfaces.hero}>
        <Container>
          <Breadcrumbs trail={trail} />
          <PageHero kicker={fm.heroKicker} heading={fm.h1} lead={fm.lead} />
        </Container>
      </Section>

      {fm.boundary ? (
        <Section surface={surfaces.boundary}>
          <Container>
            <BoundaryStatement slug={slug}>
              <p>{fm.boundary}</p>
            </BoundaryStatement>
          </Container>
        </Section>
      ) : null}

      <Section surface={surfaces.prose}>
        <Container>
          <Prose>{entry.content}</Prose>
        </Container>
      </Section>

      {fm.faq ? (
        <Section surface={surfaces.faq}>
          <Container>
            <FAQ items={fm.faq} />
          </Container>
        </Section>
      ) : null}

      {fm.crossLinks ? (
        <Section surface={surfaces.crossLinks}>
          <Container>
            <CrossLinks slugs={fm.crossLinks} />
          </Container>
        </Section>
      ) : null}

      <Section surface={surfaces.cta}>
        <Container>
          <CTABand heading={fm.cta.heading} body={fm.cta.body} cta={CONTACT_CTA} />
        </Container>
      </Section>
    </div>
  );
}
