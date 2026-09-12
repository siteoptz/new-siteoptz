import Link from "next/link";
import CTABand from "@/components/blocks/CTABand";
import PageHero from "@/components/blocks/PageHero";
import RuleList from "@/components/blocks/RuleList";
import Breadcrumbs, { type BreadcrumbItem } from "@/components/layout/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import Container from "@/components/ui/Container";
import Prose from "@/components/ui/Prose";
import SectionHead from "@/components/ui/SectionHead";
import Section from "@/components/ui/Section";
import { getRoute, servicesByStage, type RouteEntry } from "@/lib/nav";
import { buildCollectionPage } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

const PAGE_DESCRIPTION =
  "Twenty programs organized into three funnel stages, with one measurement layer underneath all three rather than a fourth stage beside them.";

export const metadata = buildMetadata({
  title: "Marketing Intelligence Services | SiteOptz",
  description: PAGE_DESCRIPTION,
  path: "/services",
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

export default function ServicesHubPage() {
  const trail = buildTrail(getRoute("/services"));

  const pillar = getRoute("/services/marketing-attribution");
  const tof = getRoute("/services/top-of-funnel");
  const mof = getRoute("/services/middle-of-funnel");
  const bof = getRoute("/services/bottom-of-funnel");

  const collectionSchema = buildCollectionPage({
    name: "Marketing Intelligence Services",
    description: PAGE_DESCRIPTION,
    path: "/services",
  });

  return (
    <div>
      <JsonLd data={collectionSchema} />

      <Section surface="base">
        <Container>
          <Breadcrumbs trail={trail} />
          <PageHero
            kicker="Services"
            heading="Twenty programs, one measurement layer underneath."
            lead="Three funnel stages, each with its own measurement problem, and the attribution layer underneath all three, holding every stage to the same standard."
          />
        </Container>
      </Section>

      <Section surface="base" width="narrow">
        <Container>
          <Prose>
            <p>
              Twenty programs, organized entirely by where a customer actually is in the
              relationship when they encounter one of them.{" "}
              <Link href={tof.path}>Top of funnel</Link> reaches someone who does not yet know the
              business exists. <Link href={mof.path}>Middle of funnel</Link> works on someone who
              knows but has not decided. <Link href={bof.path}>Bottom of funnel</Link> converts
              demand that already exists. Every one of the twenty programs belongs to exactly one
              of those three stages, and each stage&rsquo;s own page names the specific thing that
              makes measurement hard at that point in the relationship — three different problems,
              each one specific to its stage.
            </p>
            <p>
              <Link href={pillar.path}>Marketing attribution</Link> sits underneath all three, not
              beside them as a fourth option. It is the measurement standard every program in
              every stage above is held to, the layer that connects whatever a program spent to
              what the business actually recorded. That is why it appears in its own section
              below, structurally distinct from the three stage cards above it.
            </p>
          </Prose>
        </Container>
      </Section>

      <Section surface="raised">
        <Container>
          <SectionHead
            heading="The three stages"
            lead="Every program on this site belongs to exactly one of these, based on where the customer actually is in the relationship."
          />
          <RuleList
            items={[
              {
                label: `${servicesByStage("tof").length} programs`,
                heading: tof.label,
                description: "Reaching people who do not know you yet.",
                href: tof.path,
              },
              {
                label: `${servicesByStage("mof").length} programs`,
                heading: mof.label,
                description: "People who know you and have not decided yet.",
                href: mof.path,
              },
              {
                label: `${servicesByStage("bof").length} programs`,
                heading: bof.label,
                description: "Converting the demand you already have.",
                href: bof.path,
              },
            ]}
          />
          <Prose>
            <p className="mt-8">
              A program&rsquo;s stage is fixed by where the customer is, never by which platform
              it happens to run on. Paid media shows up in all three stages, for exactly that
              reason: prospecting a cold audience is a top-of-funnel job, retargeting a warm one is
              bottom-of-funnel, and defending a brand term someone already searches for sits in the
              middle. The platform is incidental. The customer&rsquo;s position in the relationship
              is what actually determines how a program gets measured and what it can honestly be
              held to. That is also why the same platform can produce two very different reports
              depending on which audience it was pointed at: a paid social campaign built to reach
              people who have never heard of the business answers a different question than one
              built to bring back a visitor who already looked at pricing twice, even when both run
              through the identical ad account.
            </p>
          </Prose>
        </Container>
      </Section>

      <Section surface="base" width="narrow">
        <Container>
          <SectionHead as="h2" heading="The layer underneath" />
          <Prose>
            <p>
              Every program above reports into the same place: a call scored against a fixed
              rubric, a form matched to a CRM or EMR record, a booked outcome traced back to the
              channel, campaign, and location that actually produced it. That shared layer is what
              lets a dollar spent at the top of the funnel and a dollar spent at the bottom get
              judged on the identical standard: what the business actually booked.
            </p>
            <p>
              Some of that matching is deterministic — a phone number or email captured at the
              point of conversion connects a click to the record it produced with no ambiguity.
              Some of it has to be estimated, using timing, geography, and session behavior when no
              shared identifier exists, and reported with a confidence score attached to show
              exactly how sure that estimate is. Every program above inherits that same honesty requirement:
              whichever stage a report comes from, it says plainly which of its numbers are
              measured and which are estimated.{" "}
              <Link href={pillar.path}>See how the measurement layer works</Link> for the full
              detail on how that split gets documented.
            </p>
          </Prose>
        </Container>
      </Section>

      <Section surface="base" width="narrow">
        <Container>
          <Prose>
            <p>
              An operator new to this site usually starts by identifying which of the three
              stages their most urgent problem actually belongs to. A launch with no history yet
              to measure against points to the top of the funnel. A long, undecided sales cycle
              where nobody can say what actually moved a prospect forward points to the middle. A
              warm-audience channel whose reported return looks suspiciously good points to the
              bottom, and specifically to whichever program there has never been tested against a
              holdout. Each of those situations has a specific stage page that names the actual fix for it.
            </p>
            <p>
              The same three stages apply regardless of which industry a business operates in. A
              multi-location healthcare group, a self-storage portfolio, a professional services
              firm, and an agency running this measurement layer behind its own name are all
              working with the identical twenty programs, organized the identical way — what
              differs is which specific programs matter most for that operator&rsquo;s own numbers,
              covered on the <Link href="/industries">industries</Link> pages.
            </p>
            <p>
              For a walkthrough of how an engagement actually runs once a starting point is
              chosen — what gets built in the first weeks, and when programs start running against
              the new standard — see <Link href="/how-it-works">how it works</Link>.
            </p>
          </Prose>
        </Container>
      </Section>

      <Section surface="base">
        <Container>
          <CTABand
            heading="Find the stage your next program belongs to."
            body="A short conversation about where your current spend sits across the three stages, and whether the attribution underneath it is solid enough to trust."
            cta={{ label: "Book a call", href: "/contact" }}
          />
        </Container>
      </Section>
    </div>
  );
}
