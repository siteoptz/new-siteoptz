import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import AttributionChain from "@/components/blocks/AttributionChain";
import DefinitionList from "@/components/blocks/DefinitionList";
import DentalLpForm from "@/components/blocks/DentalLpForm";
import { industryServices } from "@/lib/nav";

// Paid-traffic landing page for dental.siteoptz.com. Own route group, noindex,
// excluded from the sitemap (never added to lib/nav.ts's ROUTES) - see
// docs/instruction-23-dental-landing-page.md and instruction-23a for why.
export const metadata = {
  title: "Dental marketing measured to accepted cases | SiteOptz",
  robots: { index: false, follow: false },
};

const AUDIT_ITEMS = [
  {
    term: "Lead production by channel",
    definition: "What your current ads are actually producing in leads, by channel.",
  },
  {
    term: "Booked-appointment rate",
    definition:
      "How many of those leads became booked appointments - and whether that's measurable at all in your current setup.",
  },
  {
    term: "Cost per lead, benchmarked",
    definition: "Your cost per lead against what we see across dental accounts.",
  },
  {
    term: "Where measurement breaks",
    definition:
      "Where the measurement breaks between the ad platform and your practice management software.",
  },
];

const CAPABILITY_COPY: Record<string, string> = {
  "Marketing Attribution":
    "Connects what you spent on each channel to which consultations actually turned into accepted cases, not just which turned into a lead.",
  SEO: "Builds organic visibility around the specific procedures that produce your highest-value cases, not generic rankings for terms like dentist near me.",
  "Organic Capture":
    "Keeps your Google Business Profile and review flow working for the locations and procedures that actually book, not just the ones that get searched.",
  "Paid Search (PPC)":
    "Runs the non-brand search spend that's gotten twice as expensive since 2019, judged on accepted cases rather than cost per lead.",
  "Conversion Rate Optimization":
    "Tests the path from ad click to booked consultation long enough to know which version actually changed behavior.",
  "Email Marketing":
    "Follows up the patients who got a treatment plan and haven't booked yet, instead of letting that gap close on its own.",
};

const ENGAGEMENTS = [
  { year: "2019", practice: "A periodontal practice", result: "$44.61 per lead at $3.86 per click" },
  {
    year: "2021",
    practice: "A multi-location dental group",
    result: "1,387 leads across paid search, social and organic",
  },
  {
    year: "2021",
    practice: "A cosmetic dentistry practice",
    result: "$42.70 blended across Google Ads and Yelp",
  },
  {
    year: "2025",
    practice: "A general and implant practice",
    result: "$125 per lead at $6.64 per click, position 2.0",
  },
];

const SPECIALTY_TAGS = "Implants · Crowns · Dentures · Oral surgery · Emergency · Cosmetic";

const ENGAGEMENTS_SOURCE = "anonymized client media and practice-management reports, four accounts, 2019-2025";

/**
 * ad -> click -> call -> consultation -> treatment plan -> ACCEPTED CASE. The break sits
 * after "Consultation" (index 3): everything up to and including it is what an ad
 * platform's own reporting can see; everything after is where the money is actually
 * decided, which is the whole argument this page makes.
 */
const CHAIN_STEPS = [
  { name: "Ad", source: "Google Ads, Meta, LSA" },
  { name: "Click", source: "Platform-reported, ungrounded in revenue" },
  { name: "Call", source: "Call tracking, form capture" },
  { name: "Consultation", source: "Booked and attended - the last event an ad platform can see" },
  { name: "Treatment plan", source: "Proposed in-practice, lives in your PMS" },
  { name: "Accepted case", source: "The event that actually funds the next quarter's spend" },
];
const CHAIN_BREAK_AFTER_INDEX = 3;

export default function DentalLandingPage() {
  const capabilities = industryServices("dental-marketing");

  return (
    <div className="pb-24 min-[700px]:pb-0">
      {/* Section 1 - Hero. Restructured per instruction 24: the proof (the three figures)
          now lives in the hero itself rather than in a section below the fold, and the
          old standalone stat panel (formerly Section 2) is gone - its content moved up
          here, its specialty tags moved down to sit with the engagements. */}
      <Section surface="base">
        <Container>
          <h1 className="max-w-[16ch] text-3xl min-[900px]:text-5xl">
            Dental marketing measured to accepted cases, not phone calls.
          </h1>
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-6">
            <div>
              <p className="font-display text-4xl min-[900px]:text-5xl text-white">4</p>
              <p className="mt-1 text-md text-muted">practices</p>
            </div>
            <div>
              <p className="font-display text-4xl min-[900px]:text-5xl text-white">1,509</p>
              <p className="mt-1 text-md text-muted">leads</p>
            </div>
            <div>
              <p className="font-display text-4xl min-[900px]:text-5xl text-white">$33–$125</p>
              <p className="mt-1 text-md text-muted">per lead</p>
            </div>
          </div>
          <p className="mt-5 max-w-[40ch] text-md text-muted">
            Most dental ad reporting stops at the lead - the number that decides whether the
            spend worked is what happened after the consultation.
          </p>
          <div className="mt-10">
            <Button variant="primary" href="#audit-form">
              Get a free audit of your current spend
            </Button>
          </div>
        </Container>
      </Section>

      {/* Section 3 - What is in the audit */}
      <Section surface="base">
        <Container>
          <h2 className="text-xl min-[900px]:text-3xl">What&rsquo;s in the audit</h2>
          <div className="mt-6">
            <DefinitionList items={AUDIT_ITEMS} />
          </div>
          <p className="mt-6 text-md text-muted">
            The audit needs read-only access to your ad accounts, and it takes about a week.
          </p>
        </Container>
      </Section>

      {/* Section 4 - Why cost per lead is the wrong headline. The argument is a sequence,
          so it's a diagram (AttributionChain, reused with dental vocabulary) rather than a
          paragraph - the gradient marks the one real break in the chain and appears
          nowhere else on this page. */}
      <Section surface="raised">
        <Container>
          <h2 className="text-xl min-[900px]:text-3xl">Why cost per lead is the wrong headline</h2>
          <div className="mt-6 max-w-[40rem]">
            <AttributionChain
              steps={CHAIN_STEPS}
              breakAfterIndex={CHAIN_BREAK_AFTER_INDEX}
              breakLabel=""
              gradient
              numbered
            />
          </div>
          <p className="mt-6 max-w-[62ch] text-md text-muted">
            Cost per click in dental paid search more than doubled between 2019 and 2025 - we
            watched it go from $3.86 to $6.64 across our own accounts. A number that moves with
            the ad auction rather than with your business cannot tell you whether the spend
            worked.
          </p>
        </Container>
      </Section>

      {/* Section 5 - Capabilities */}
      <Section surface="base">
        <Container>
          <h2 className="text-xl min-[900px]:text-3xl">What an engagement includes</h2>
          <div className="mt-6">
            <DefinitionList
              items={capabilities.map((route) => ({
                term: route.label,
                definition: CAPABILITY_COPY[route.label] ?? route.description,
              }))}
            />
          </div>
        </Container>
      </Section>

      {/* Section 6 - The engagements, chronological. The year is the structural element -
          large, in the accent, set against the detail - rather than a table column, so the
          eye reads 2019/2021/2021/2025 as a spine with the figures hanging off it. Hairline
          rows, not four identical rounded cards: four engagements this different shouldn't
          share one shape. The specialty tags land here, as a quiet line beneath. */}
      <Section surface="raised">
        <Container>
          <h2 className="text-xl min-[900px]:text-3xl">The engagements</h2>
          <div className="mt-6">
            {ENGAGEMENTS.map((engagement) => (
              <div
                key={`${engagement.year}-${engagement.practice}`}
                className="flex gap-6 border-b border-rule py-6 first:border-t"
              >
                <p className="w-[4ch] shrink-0 font-display text-3xl text-accent">
                  {engagement.year}
                </p>
                <div>
                  <p className="text-white">{engagement.practice}</p>
                  <p className="mt-1 text-muted">{engagement.result}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted">{SPECIALTY_TAGS}</p>
          <p className="mt-2 text-2xs text-muted">Source: {ENGAGEMENTS_SOURCE}</p>
        </Container>
      </Section>

      {/* Section 7 - Booking, now a form rather than an embedded calendar widget - see
          instruction 23a. Consent is captured here, before the calendar is ever offered on
          the success state, so a booking made from that link is covered by a consent record
          the calendar itself cannot produce. */}
      <Section surface="base">
        <Container>
          <div id="audit-form">
            <h2 className="text-xl min-[900px]:text-3xl">Get a free audit of your current spend</h2>
            <p className="mt-4 max-w-[56ch] text-md text-muted">
              The audit needs read-only access to your ad accounts - that&rsquo;s the only thing
              we need from you to start.
            </p>
            <div className="mt-8 max-w-[40rem]">
              <DentalLpForm />
            </div>
          </div>
        </Container>
      </Section>

      {/* Section 8 - Sticky mobile CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[rgba(255,236,220,0.14)] bg-base p-3 min-[700px]:hidden">
        <Button variant="primary" href="#audit-form">
          Get your free audit
        </Button>
      </div>
    </div>
  );
}
