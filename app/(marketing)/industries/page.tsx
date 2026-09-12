import Link from "next/link";
import CTABand from "@/components/blocks/CTABand";
import PageHero from "@/components/blocks/PageHero";
import Breadcrumbs, { type BreadcrumbItem } from "@/components/layout/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import Container from "@/components/ui/Container";
import Prose from "@/components/ui/Prose";
import SectionHead from "@/components/ui/SectionHead";
import Section from "@/components/ui/Section";
import { getIndustryEntries } from "@/lib/content";
import { getRoute, ROUTES, type RouteEntry } from "@/lib/nav";
import { buildCollectionPage } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

const PAGE_DESCRIPTION =
  "Multi-location healthcare, self-storage portfolios, professional services, and agency partners — where measurement is the hard part.";

export const metadata = buildMetadata({
  title: "Industries We Work In | SiteOptz",
  description: PAGE_DESCRIPTION,
  path: "/industries",
});

function buildTrail(route: RouteEntry): BreadcrumbItem[] {
  const trail: BreadcrumbItem[] = [];
  let current: RouteEntry | null = route;
  while (current) {
    trail.unshift({ name: current.label, path: current.path });
    current = current.parent ? getRoute(current.parent) : null;
  }
  return trail;
}

export default async function IndustriesHubPage() {
  const trail = buildTrail(getRoute("/industries"));
  const rawEntries = await getIndustryEntries();

  // Ordered per lib/nav.ts's ROUTES, the canonical order from section 5 of
  // the SEO plan — not directory-read order, which is alphabetical by slug.
  const industryOrder = ROUTES.filter((route) => route.parent === "/industries").map(
    (route) => route.path.split("/").pop()
  );
  const entries = industryOrder
    .map((slug) => rawEntries.find((entry) => entry.slug === slug))
    .filter((entry): entry is (typeof rawEntries)[number] => entry !== undefined);

  const collectionSchema = buildCollectionPage({
    name: "Industries We Work In",
    description: PAGE_DESCRIPTION,
    path: "/industries",
  });

  return (
    <div>
      <JsonLd data={collectionSchema} />

      <Section surface="base">
        <Container>
          <Breadcrumbs trail={trail} />
          <PageHero
            kicker="Industries"
            heading="Where measurement is the hard part."
            lead="Four verticals, each with its own reason a blended report cannot be trusted, and its own version of the same measurement layer built to fix it."
          />
        </Container>
      </Section>

      <Section surface="base" width="narrow">
        <Container>
          <Prose>
            <p>
              These four operator types share a structural problem more than a market: each runs
              marketing across more than one location, channel, or client relationship, where a
              single blended number hides which specific site, program, or account is actually
              producing results. A multi-location healthcare group, a self-storage portfolio, a
              professional services firm with a long sales cycle, and an agency running this
              measurement layer under its own name all need the same underlying discipline —
              attribution that survives being broken out by location or account — applied to
              different systems and different constraints.
            </p>
          </Prose>
        </Container>
      </Section>

      <Section surface="raised">
        <Container>
          <SectionHead heading="The four industries" />
          <div className="grid grid-cols-1 gap-10 min-[900px]:grid-cols-2">
            {entries.map((entry) => {
              const route = getRoute(`/industries/${entry.slug}`);
              return (
                <div key={entry.slug}>
                  <h3>{route.label}</h3>
                  <p className="mt-2 text-muted">{entry.frontmatter.summary}</p>
                  <Link
                    href={route.path}
                    className="mt-2 inline-block text-sm text-accent hover:text-accent-lt"
                  >
                    {entry.frontmatter.h1}
                  </Link>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section surface="base">
        <Container>
          <CTABand
            heading="Find out what your industry's version of this looks like."
            body="A short conversation about your specific locations, systems, and where your current reporting stops being trustworthy."
            cta={{ label: "Book a call", href: "/contact" }}
          />
        </Container>
      </Section>
    </div>
  );
}
