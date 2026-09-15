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
  "Ten sectors, one shared problem: the outcome that matters is recorded in a system - an EMR, a core banking system, a case file - ad platforms cannot see.";

export const metadata = buildMetadata({
  title: "Industries We Serve Marketing | SiteOptz",
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
            lead="Ten sectors, each recording its real outcome in a system built for something other than marketing - and each needing the same measurement layer built to reach into it anyway."
          />
        </Container>
      </Section>

      <Section surface="base">
        <Container>
          <Prose>
            <p>
              Ten sectors sit on this page, and what they share is not a market category - it is
              where the outcome that actually matters gets recorded. A multi-location healthcare
              group&rsquo;s real outcome is a booked, attended consultation, and it lives inside an
              EMR. A bank or credit union&rsquo;s is a funded account, inside a core banking system.
              A freight or logistics operator&rsquo;s is a booked load, inside a TMS. An educational
              institution&rsquo;s is an enrolled student, inside a student information system. A
              self-storage operator&rsquo;s is a rented unit, inside a property management system. A
              law firm&rsquo;s is a signed case, inside a case management system. None of those six
              systems was ever built with a marketing team in mind, let alone to report back to an
              ad platform, and the remaining four sectors
              carry a version of the same problem in a system just as closed: a distributor&rsquo;s
              own records a manufacturer rarely sees, a permitting and interconnection process
              standing between a signature and a real installation, a CRM holding a cohort of deals
              still working through a multi-month cycle, and - for an agency partner - a client&rsquo;s
              own systems this measurement layer is built to reach into on someone else&rsquo;s behalf.
            </p>
            <p>
              A blended, company-wide number hides this the same way in every one of the ten. The
              number itself is rarely wrong, exactly; averaging away the location, the account, or
              the practice area simply erases the one piece of information that would tell an
              operator where to act. A healthcare group&rsquo;s regional cost per lead can look
              healthy while one location quietly drains budget it cannot convert. A law firm&rsquo;s
              blended cost per lead can look acceptable while a low-value practice area masks a
              high-value one with a genuine intake problem. The same structure repeats in a
              distributor channel that hides the end buyer, a TMS blending real bookings with
              price-shopping inquiries, and a core banking system holding funded accounts a
              marketing dashboard never sees. The blended number is not dishonest. It simply cannot
              see the thing that most needs fixing.
            </p>
            <p>
              What differs across the ten is which system holds the answer, what constrains getting
              it out, and how long the gap runs between the marketing that produced an inquiry and
              the system finally recording an outcome. A regulated sector - healthcare, finance,
              education - adds a compliance layer on top of the system boundary: HIPAA, PII rules,
              or FERPA constrain not just what gets tracked but how it can be connected at all, and
              marketing copy itself often needs review before it can run. An operational sector -
              manufacturing, transportation and logistics, energy and utilities - adds a different
              constraint instead: a distributor or installer who never reports back, a booking
              system that exports poorly, a permitting process that adds months between a
              signature and a real result. Professional services and legal each carry a version of
              both, a long or highly variable decision cycle sitting on top of a system, a CRM or a
              case management platform, that was never built with attribution in mind. Agency
              partners is the exception that proves the pattern: the system in question belongs to
              someone else&rsquo;s client, and the measurement layer runs underneath a brand that
              is not our own.
            </p>
            <p>
              Ten different systems, ten different constraints, and the same underlying discipline
              applied to each: find where the real outcome is recorded, build a connection into it
              that respects whatever boundary governs that system, and report against that outcome
              rather than the platform-reported click or the leading indicator that arrived weeks
              before it.
            </p>
            <p>
              The version of that discipline built for each sector looks different on the page
              that follows it - a healthcare page describing HIPAA-aware call scoring reads
              nothing like a freight page describing TMS exports, and neither reads like a law
              firm&rsquo;s page on intake call review. What stays constant underneath the
              difference is the standard the reporting gets held to: cost per real,
              system-confirmed outcome, broken out by whatever unit that sector actually competes
              at - location, lane, practice area, programme, territory - rather than rolled into
              one company-wide average that flatters the whole while hiding which part of it is
              actually working. What follows is each sector&rsquo;s specific version of that work.
            </p>
          </Prose>
        </Container>
      </Section>

      <Section surface="raised">
        <Container>
          <SectionHead heading="The ten industries" />
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
