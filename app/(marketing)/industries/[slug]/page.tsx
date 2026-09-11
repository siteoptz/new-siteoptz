import Link from "next/link";
import { notFound } from "next/navigation";
import CTABand from "@/components/blocks/CTABand";
import FAQ from "@/components/blocks/FAQ";
import PageHero from "@/components/blocks/PageHero";
import Breadcrumbs, { type BreadcrumbItem } from "@/components/layout/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import Container from "@/components/ui/Container";
import Prose from "@/components/ui/Prose";
import SectionHead from "@/components/ui/SectionHead";
import Section from "@/components/ui/Section";
import { type ContentEntry, type IndustryFrontmatter, getIndustryEntries } from "@/lib/content";
import { getRoute, industryServices, type RouteEntry } from "@/lib/nav";
import { buildService } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

export const dynamicParams = false;

const CONTACT_CTA = { label: "Book a call", href: "/contact" };

async function getEntry(slug: string): Promise<ContentEntry<IndustryFrontmatter>> {
  const entries = await getIndustryEntries();
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
  const entries = await getIndustryEntries();
  return entries.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = await getEntry(slug);
  return buildMetadata({
    title: entry.frontmatter.title,
    description: entry.frontmatter.description,
    path: `/industries/${slug}`,
  });
}

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = await getEntry(slug);
  const fm = entry.frontmatter;
  const route = getRoute(`/industries/${slug}`);
  const trail = buildTrail(route);
  const services = industryServices(slug);

  const serviceSchema = buildService({
    name: fm.h1,
    description: fm.description,
    path: route.path,
  });

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
          <SectionHead heading="Which services apply" />
          <div className="grid grid-cols-1 gap-px bg-rule min-[900px]:grid-cols-2">
            {services.map((service) => (
              <Link
                key={service.path}
                href={service.path}
                className="bg-paper p-6 hover:bg-paper-2"
              >
                <p className="font-display text-blue-600">{service.shortLabel}</p>
                <p className="mt-1 text-sm text-muted">{service.description}</p>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {fm.faq ? (
        <Section surface="paper">
          <Container>
            <FAQ items={fm.faq} />
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
