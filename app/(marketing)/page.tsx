import Link from "next/link";
import AttributionChain from "@/components/blocks/AttributionChain";
import CTABand from "@/components/blocks/CTABand";
import DefinitionList from "@/components/blocks/DefinitionList";
import RuleList from "@/components/blocks/RuleList";
import StageSequence from "@/components/blocks/StageSequence";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Prose from "@/components/ui/Prose";
import SectionHead from "@/components/ui/SectionHead";
import Section from "@/components/ui/Section";
import { buildMetadata } from "@/lib/seo";
import { getRoute, industriesList, servicesByStage } from "@/lib/nav";

export const metadata = buildMetadata({
  title: "Marketing Attribution Consultancy | SiteOptz",
  description:
    "SiteOptz is a marketing attribution consultancy: we build the system connecting spend to booked revenue, then run campaigns on top of it.",
  path: "/",
});

export default function HomePage() {
  const pillar = getRoute("/services/marketing-attribution");
  const howItWorks = getRoute("/how-it-works");
  const industries = getRoute("/industries");
  const healthcare = getRoute("/industries/healthcare-marketing");
  const selfStorage = getRoute("/industries/self-storage-marketing");
  const contact = getRoute("/contact");
  const industryCount = industriesList().length;

  const tof = getRoute("/services/top-of-funnel");
  const mof = getRoute("/services/middle-of-funnel");
  const bof = getRoute("/services/bottom-of-funnel");

  return (
    <div>
      <Section surface="base">
        <Container>
          <div className="grid grid-cols-1 gap-10 min-[900px]:grid-cols-2">
            <div>
              <h1 className="max-w-[18ch]">Know which marketing spend produced revenue.</h1>
              <p className="mt-4 max-w-[46ch] text-muted">
                Most reporting stops at the click. SiteOptz is the marketing attribution
                consultancy that builds the layer connecting spend to the business outcome it
                produced - a booked appointment, signed agreement, or completed sale - so budget
                moves toward what the business actually recorded, not what a platform claims.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button variant="primary" href={contact.path}>
                  Book a call
                </Button>
                <Button variant="ghost" href={pillar.path}>
                  See how attribution works
                </Button>
              </div>
            </div>
            <AttributionChain />
          </div>
        </Container>
      </Section>

      <Section surface="base">
        <Container>
          <SectionHead
            heading="Three systems that don't talk to each other."
            lead="Most marketing measurement problems are not analytics problems. They are systems problems."
          />
          <Prose>
            <p>
              Every account runs three systems that were never built to speak to each other: the
              ad platforms reporting clicks and impressions, the phone and form tools capturing
              the inquiry, and the CRM, EMR, or property management system where a booked outcome
              is actually recorded. Each reports its own version of the same customer journey.
              None of them reports what the business needs to know - which dollar produced which
              outcome.
            </p>
            <p>
              When those systems stay disconnected, budget drifts toward whichever channel
              produces the largest volume of leads. A channel that generates fewer, better
              inquiries starts to look expensive next to one that generates a flood of unqualified
              clicks, and it gets cut first. Decisions end up made on whichever result was loudest
              in last week&rsquo;s marketing team meeting.
            </p>
            <p>
              We build the measurement layer before we touch a campaign, because every later
              decision depends on it. Reallocating budget, testing new creative, launching a
              market - none of it means anything if the number it is judged against is not real.
            </p>
          </Prose>
        </Container>
      </Section>

      <Section surface="raised">
        <Container>
          <SectionHead heading="What a marketing attribution consultancy does" />
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
          <div className="mt-8 border-t-2 border-accent pt-6">
            <Link
              href={pillar.path}
              className="font-display text-accent hover:text-accent-lt"
            >
              {pillar.label}
            </Link>
            <p className="mt-1 text-muted">
              Underneath all three stages above - the layer that measures whether any of it
              produced revenue.
            </p>
          </div>
        </Container>
      </Section>

      <Section surface="base">
        <Container>
          <SectionHead heading="How an engagement runs" />
          <StageSequence
            stages={[
              {
                number: "01",
                title: "Measurement audit",
                body: "We map what is currently tracked against what your revenue system actually records.",
                when: "Weeks 1–2",
              },
              {
                number: "02",
                title: "Build the layer",
                body: "Call scoring, CRM or EMR matching, and a cost-per-booked-outcome model, built to your systems.",
                when: "Weeks 3–6",
              },
              {
                number: "03",
                title: "Run the programs",
                body: "Campaigns run against the cost-per-booked-outcome standard the previous stage built.",
                when: "Week 7 onward",
              },
              {
                number: "04",
                title: "Standing review",
                body: "Monthly reporting against booked outcomes, with budget reallocated toward what is working.",
                when: "Ongoing",
              },
            ]}
          />
          <Link href={howItWorks.path} className="mt-6 inline-block text-sm text-accent hover:text-white">
            {howItWorks.label}
          </Link>
        </Container>
      </Section>

      <Section surface="base">
        <Container>
          <SectionHead
            heading="Who this is built for"
            lead="Four examples here - the same problem shows up well beyond this list."
          />
          <div className="grid grid-cols-1 gap-8 min-[900px]:grid-cols-2">
            <div>
              <h3>Multi-location healthcare</h3>
              <p className="mt-2 text-muted">
                Healthcare groups running paid and organic programs across a dozen or more sites,
                where a lead is worthless if it cannot be tied back to the location and channel
                that produced it. The question that matters is which location&rsquo;s spend is
                actually producing patients.
              </p>
              <Link href={healthcare.path} className="mt-2 inline-block text-sm text-accent hover:text-accent-lt">
                {healthcare.label}
              </Link>
            </div>
            <div>
              <h3>Self-storage portfolios</h3>
              <p className="mt-2 text-muted">
                Portfolio operators managing occupancy across many facilities, where a rented unit
                needs to trace back to the ad, the call, or the map-pack listing that drove it.
                Occupancy moves fast, and a blended report from last week is already out of date.
              </p>
              <Link href={selfStorage.path} className="mt-2 inline-block text-sm text-accent hover:text-accent-lt">
                {selfStorage.label}
              </Link>
            </div>
            <div>
              <h3>Professional services</h3>
              <p className="mt-2 text-muted">
                Firms that sell on trust and a long sales cycle, where the marketing that starts a
                relationship rarely closes it in the same channel. Attribution here has to span
                months of contact before a relationship actually closes.
              </p>
            </div>
            <div>
              <h3>Agency partners</h3>
              <p className="mt-2 text-muted">
                Agencies that want a measurement layer they can run behind their own name, without
                building the attribution infrastructure themselves. The reporting carries their
                brand; the measurement underneath is ours.
              </p>
            </div>
          </div>
          <p className="mt-8 text-muted">
            The pattern repeats the same way in every case: the outcome that actually matters is
            recorded in a system the ad platforms cannot see. That holds across all{" "}
            {industryCount}{" "}
            <Link href={industries.path} className="text-accent hover:text-accent-lt">
              industries we serve
            </Link>
            .
          </p>
        </Container>
      </Section>

      <Section surface="raised">
        <Container>
          <SectionHead heading="What you receive" />
          <DefinitionList
            items={[
              {
                term: "Attribution map",
                definition: "Every channel and location mapped to how it reports into the revenue system.",
              },
              {
                term: "Monthly performance report",
                definition: "Cost per booked outcome by channel and location, sourced from the revenue system itself.",
              },
              {
                term: "Call review record",
                definition: "A sample of scored calls, so quality is auditable.",
              },
              {
                term: "Location scorecards",
                definition: "Performance ranked site by site.",
              },
              {
                term: "Decision log",
                definition: "What changed each month and why, tied to the data that prompted it.",
              },
            ]}
          />
        </Container>
      </Section>

      <Section surface="base">
        <Container>
          <CTABand
            heading="Start with the measurement audit."
            body="Two weeks, fixed scope, useful whether or not we work together after."
            cta={{ label: "Book a call", href: contact.path }}
          />
        </Container>
      </Section>
    </div>
  );
}
