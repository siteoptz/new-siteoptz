import Link from "next/link";
import CTABand from "@/components/blocks/CTABand";
import PageHero from "@/components/blocks/PageHero";
import StageSequence from "@/components/blocks/StageSequence";
import Breadcrumbs, { type BreadcrumbItem } from "@/components/layout/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import Container from "@/components/ui/Container";
import Prose from "@/components/ui/Prose";
import SectionHead from "@/components/ui/SectionHead";
import Section from "@/components/ui/Section";
import { getRoute, type RouteEntry } from "@/lib/nav";
import { buildHowTo } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Marketing Attribution Audit | SiteOptz",
  description:
    "Four stages: measurement audit, build the layer, run the programs, standing review. The first two are fixed scope and useful on their own.",
  path: "/how-it-works",
});

const STEPS = [
  {
    name: "Measurement audit",
    text: "Map what is currently tracked against what the revenue system actually records, and produce a written account of the gap between the two.",
  },
  {
    name: "Build the layer",
    text: "Call scoring, CRM or EMR matching, and a cost-per-booked-outcome model, built directly against the client's own systems.",
  },
  {
    name: "Run the programs",
    text: "Campaigns run and budget moves against the new measurement standard rather than platform-reported numbers.",
  },
  {
    name: "Standing review",
    text: "Monthly reporting against booked outcomes, with a decision log tying each budget change to the data that prompted it.",
  },
];

function buildTrail(route: RouteEntry): BreadcrumbItem[] {
  const trail: BreadcrumbItem[] = [];
  let current: RouteEntry | null = route;
  while (current) {
    trail.unshift({ name: current.label, path: current.path });
    current = current.parent ? getRoute(current.parent) : null;
  }
  return trail;
}

export default function HowItWorksPage() {
  const trail = buildTrail(getRoute("/how-it-works"));

  const howToSchema = buildHowTo({
    name: "How a SiteOptz engagement runs",
    description: metadata.description as string,
    steps: STEPS,
  });

  return (
    <div>
      <JsonLd data={howToSchema} />

      <Section surface="base">
        <Container>
          <Breadcrumbs trail={trail} />
          <PageHero
            kicker="Process"
            heading="How a marketing attribution audit runs, stage by stage."
            lead="Four stages, in order. The first two are fixed scope and produce something useful whether or not the relationship continues past them."
          />
        </Container>
      </Section>

      <Section surface="base">
        <Container>
          <Prose>
            <p>
              Most agencies describe their process as a relationship: onboarding, strategy,
              execution, optimization, repeat. That framing works fine for creative and media
              buying, and it hides exactly the part of the engagement that determines whether
              anything downstream can be trusted - the measurement layer underneath it. This page
              describes the four stages in the order they actually happen, with what each one
              requires, what it produces, and how long it takes.
            </p>
          </Prose>
          <SectionHead
            heading="The four stages"
            lead="Each stage has a defined input, a defined output, and a duration that holds regardless of how the engagement is going."
          />
          <StageSequence
            stages={[
              { number: "01", title: "Measurement audit", body: "What is tracked, mapped against what the revenue system records.", when: "Weeks 1–2" },
              { number: "02", title: "Build the layer", body: "Call scoring, CRM or EMR matching, and a cost-per-booked-outcome model.", when: "Weeks 3–6" },
              { number: "03", title: "Run the programs", body: "Campaigns run against the new measurement standard.", when: "Week 7 onward" },
              { number: "04", title: "Standing review", body: "Monthly reporting, with budget reallocated toward what is working.", when: "Ongoing" },
            ]}
          />
        </Container>
      </Section>

      <Section surface="raised">
        <Container>
          <Prose>
            <h2>Measurement audit - weeks 1 and 2</h2>
            <p>
              The audit starts with access, not a meeting: read access to the ad accounts and
              analytics currently in use, and either an export or a read-only connection to
              whatever system records a booked outcome - a CRM, an EMR, a property management
              system. From that, we build a channel-by-location map showing what is tracked today
              against what the revenue system actually recorded, and name the specific gap between
              the two rather than describing it in general terms.
            </p>
            <p>
              The output is a written document: which channels and locations have a real,
              auditable connection to a booked outcome, which are inferred or estimated, and which
              have none at all. It is scoped to two weeks regardless of how many locations or
              channels are involved, and it stands on its own - a business that stops here walks
              away with an accurate account of where its reporting can be trusted and where it
              cannot.
            </p>

            <h2>Build the layer - weeks 3 through 6</h2>
            <p>
              This stage requires a different kind of access: administrative rights to the ad
              platforms and call tracking system, since offline conversion import and call scoring
              both make changes inside those tools directly. Call scoring goes live first, against
              a fixed rubric agreed with the client&rsquo;s team, followed by the CRM or EMR matching
              that connects a scored call or form to what actually got booked.
            </p>
            <p>
              The output is{" "}
              <Link href="/services/marketing-attribution">
                attribution built to your revenue system
              </Link>
              : a cost-per-booked-outcome model, broken out by channel and location, feeding back
              into each ad platform&rsquo;s own bidding algorithm through offline conversion import.
              Four weeks is typical; a stack with more than one CRM or a manual, non-digital intake
              process usually needs the full six.
            </p>

            <h2>Run the programs - week 7 onward</h2>
            <p>
              Campaigns that were previously judged on platform-reported clicks and conversions
              start reporting against the new standard instead, and budget moves accordingly - 
              sometimes toward a channel that had looked mediocre under the old measurement, and
              sometimes away from one that had looked strong. The first full reporting cycle
              against the new layer typically produces at least one reallocation nobody would have
              made under the previous numbers.
            </p>
            <p>
              That shift is not confined to one channel. It reaches every stage a program runs
              in - {" "}
              <Link href="/services/top-of-funnel">top-of-funnel programs</Link>,{" "}
              <Link href="/services/middle-of-funnel">middle-of-funnel programs</Link>, and{" "}
              <Link href="/services/bottom-of-funnel">bottom-of-funnel programs</Link> alike - 
              since all three report against the identical cost-per-booked-outcome standard from
              week seven onward.
            </p>
            <p>
              This is also where the account team we recommend hiring or reallocating in-house
              starts working from the same standard the account itself is judged on, rather than a
              second, informal read built from whatever dashboard happened to be open. Creative
              tests, launch sequencing, and channel-mix decisions all draw on the same
              cost-per-booked-outcome figures the standing review reports each month, so a decision
              made in week nine and a decision made in month six are answerable to the identical
              number.
            </p>

            <h2>Standing review - ongoing</h2>
            <p>
              Reporting runs on a monthly cadence: cost per booked outcome by channel and
              location, checked against the previous month, with a decision log recording what
              changed and the specific data that prompted it. The cadence is fixed from the start;
              what changes over the first two cycles is how much of the reporting still needs
              caveats attached, as more of a location&rsquo;s intake gets fully instrumented.
            </p>
          </Prose>
        </Container>
      </Section>

      <Section surface="base">
        <Container>
          <SectionHead heading="What the audit deliverable contains" />
          <Prose>
            <p>
              A channel-and-location matrix showing current tracking status against what the
              revenue system records, with each cell marked as connected, estimated, or missing
              entirely. A written account of the largest gaps, in the order they are worth fixing
              first, rather than a flat list with no priority attached. And a specific recommendation
              for each gap - an access request, a tagging fix, an export schedule - concrete enough
              to act on without a follow-up call to clarify what it means.
            </p>
            <p>
              The matrix also states plainly which gaps the audit itself cannot close. A location
              still running paper intake forms, or a CRM with no export and no API, shows up as a
              named limitation rather than a footnote buried in an appendix - the kind of finding a
              business needs while it can still decide whether the build stage is worth starting,
              before any retainer begins. Every recommendation in the deliverable is one the
              client&rsquo;s own team could execute without us, if that turned out to be the right call.
            </p>
          </Prose>
        </Container>
      </Section>

      <Section surface="raised">
        <Container>
          <SectionHead heading="What we need from your team" />
          <Prose>
            <p>
              Access is the largest requirement, and it grows across the four stages: read-only
              for the audit, administrative for the build stage, since call scoring and offline
              conversion import both make changes inside the ad platforms directly. Beyond access,
              one person who can answer how intake actually works day to day - which forms route
              where, what a call sounds like before anyone scores it, where a lead can quietly get
              lost. That person does not need to be senior. They need to be the one who would
              actually notice if a step silently stopped happening.
            </p>
            <p>
              Response time on access requests matters more than most clients expect going in. A
              build stage waiting three weeks on an administrative login runs three weeks longer,
              in full, since call scoring and CRM matching cannot be tested against real traffic
              until the access behind them actually exists. Setting a single point of contact for
              access requests before the audit even finishes is the fastest way to keep the
              six-week build window realistic rather than aspirational.
            </p>
          </Prose>
        </Container>
      </Section>

      <Section surface="base">
        <Container>
          <SectionHead heading="How pricing works" />
          <Prose>
            <p>
              The measurement audit is fixed price, agreed before it starts, with the two-week
              scope staying fixed regardless of account size. The standing engagement that follows
              is a monthly retainer sized to the number of programs and locations actually under
              management, revisited at each standing review as that scope changes. A business
              adding a location or a new channel sees that retainer move with it, in either
              direction, as part of the normal review cadence rather than as a surprise at renewal.
            </p>
          </Prose>
        </Container>
      </Section>

      <Section surface="raised">
        <Container>
          <SectionHead heading="If we are not the right fit" />
          <Prose>
            <p>
              Sometimes the audit itself is the honest end point: a business with too little
              tracking infrastructure in place to build a real measurement layer on top of it, or
              one not ready to grant the administrative access the build stage requires. When that
              happens, we say so directly at the end of the audit rather than starting a retainer
              we do not believe will produce a trustworthy number, and point toward what would need
              to change first for the next stage to be worth doing.
            </p>
            <p>
              A single-location business with a short, simple sales cycle is another common case:
              the audit still produces a useful account of what is tracked, but the layer built in
              stage two earns its cost fastest at multi-location or multi-channel scale, where a
              blended report otherwise hides which site or program is actually producing customers.
              Telling a single-location business that plainly, before spend, costs us a retainer
              and saves them one they would not have gotten full value from.
            </p>
          </Prose>
        </Container>
      </Section>

      <Section surface="base">
        <Container>
          <CTABand
            heading="Start with the measurement audit."
            body="Two weeks, fixed scope, useful whether or not we work together after."
            cta={{ label: "Book a call", href: "/contact" }}
          />
        </Container>
      </Section>
    </div>
  );
}
