import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import DefinitionList from "@/components/blocks/DefinitionList";
import MetricTable from "@/components/blocks/MetricTable";
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

export default function DentalLandingPage() {
  const capabilities = industryServices("dental-marketing");

  return (
    <div className="pb-24 min-[700px]:pb-0">
      {/* Section 1 - Hero */}
      <Section surface="base">
        <Container>
          <h1 className="max-w-[20ch]">
            Dental marketing measured to accepted cases, not phone calls.
          </h1>
          <p className="mt-4 max-w-[52ch] text-muted">
            Most dental ad reporting stops at the lead. The number that actually decides whether
            the spend was worth it is what happened after the consultation, not the call that
            came in before it.
          </p>
          <div className="mt-8">
            <Button variant="primary" href="#audit-form">
              Get a free audit of your current spend
            </Button>
          </div>
        </Container>
      </Section>

      {/* Section 2 - The proof panel, high */}
      <Section surface="raised">
        <Container>
          <p className="text-sm text-accent">Dental, 2019–2025</p>
          <div className="mt-4 grid grid-cols-1 gap-6 min-[560px]:grid-cols-3">
            <div>
              <p className="font-display text-2xl text-white">4</p>
              <p className="text-muted">dental practices</p>
            </div>
            <div>
              <p className="font-display text-2xl text-white">1,509</p>
              <p className="text-muted">leads generated</p>
            </div>
            <div>
              <p className="font-display text-2xl text-white">$33–$125</p>
              <p className="text-muted">per lead, depending on channel and market</p>
            </div>
          </div>
          <p className="mt-6 text-sm text-muted">
            Implants · Crowns · Dentures · Oral surgery · Emergency · Cosmetic
          </p>
        </Container>
      </Section>

      {/* Section 3 - What is in the audit */}
      <Section surface="base">
        <Container>
          <h2>What&rsquo;s in the audit</h2>
          <div className="mt-6">
            <DefinitionList items={AUDIT_ITEMS} />
          </div>
          <p className="mt-6 text-muted">
            The audit needs read-only access to your ad accounts, and it takes about a week.
          </p>
        </Container>
      </Section>

      {/* Section 4 - Why cost per lead is the wrong headline */}
      <Section surface="raised">
        <Container>
          <h2>Why cost per lead is the wrong headline</h2>
          <p className="mt-4 max-w-[62ch] text-muted">
            Cost per click in dental paid search more than doubled between 2019 and 2025 - we
            watched it go from $3.86 to $6.64 across our own accounts. Cost per lead followed. A
            number that moves with the ad auction rather than with your business cannot tell you
            whether the spend worked. What can is cost per accepted case, and that lives in your
            practice management software, not in the ad platform.
          </p>
        </Container>
      </Section>

      {/* Section 5 - Capabilities */}
      <Section surface="base">
        <Container>
          <h2>What an engagement includes</h2>
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

      {/* Section 6 - The engagements, chronological */}
      <Section surface="raised">
        <Container>
          <h2>The engagements</h2>
          <div className="mt-6">
            <MetricTable
              caption="Dental engagements, 2019–2025"
              columns={[
                { key: "year", label: "Year" },
                { key: "practice", label: "Practice" },
                { key: "result", label: "Result" },
              ]}
              rows={ENGAGEMENTS}
              source="anonymized client media and practice-management reports, four accounts, 2019-2025"
            />
          </div>
        </Container>
      </Section>

      {/* Section 7 lands here in a later commit - anchor target reserved now so the
          hero and sticky CTAs above have somewhere real to scroll to. */}
      <div id="audit-form" />

      {/* Section 8 - Sticky mobile CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[rgba(255,236,220,0.14)] bg-base p-3 min-[700px]:hidden">
        <Button variant="primary" href="#audit-form">
          Get your free audit
        </Button>
      </div>
    </div>
  );
}
