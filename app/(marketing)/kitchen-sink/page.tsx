import type { Metadata } from "next";
import BoundaryStatement from "@/components/blocks/BoundaryStatement";
import CrossLinks from "@/components/blocks/CrossLinks";
import CTABand from "@/components/blocks/CTABand";
import DefinitionList from "@/components/blocks/DefinitionList";
import FAQ from "@/components/blocks/FAQ";
import MetricTable from "@/components/blocks/MetricTable";
import PageHero from "@/components/blocks/PageHero";
import QuoteBlock from "@/components/blocks/QuoteBlock";
import RuleList from "@/components/blocks/RuleList";
import StageGrid from "@/components/blocks/StageGrid";
import StageSequence from "@/components/blocks/StageSequence";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionHead from "@/components/ui/SectionHead";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function KitchenSinkPage() {
  return (
    <div>
      <Section surface="navy">
        <Container>
          <PageHero
            kicker="Top of funnel"
            heading="Non-brand paid search judged on booked outcomes."
            lead="Call scoring, search term hygiene, and budget set location by location — measured to cost per booked outcome, not clicks."
            cta={{ label: "Book a call", href: "/contact" }}
          />
        </Container>
      </Section>

      <Section surface="paper-2">
        <Container>
          <SectionHead heading="BoundaryStatement" as="h2" />
          <BoundaryStatement slug="paid-search-ppc">
            <p>
              This page covers non-brand acquisition only — campaigns built to reach people who
              have not searched your brand name. Defending and converting demand from people who
              already know you is a separate discipline, with a separate budget and a separate
              measurement standard.
            </p>
          </BoundaryStatement>
        </Container>
      </Section>

      <Section surface="paper">
        <Container>
          <SectionHead heading="RuleList" as="h2" />
          <RuleList
            items={[
              {
                label: "Setup",
                heading: "Account structure",
                description: "Campaigns split by intent and location, not by product SKU.",
                href: "/services/paid-search-ppc",
              },
              {
                label: "Tracking",
                heading: "Call scoring",
                description: "Every inbound call scored for booking intent, not just answered.",
                href: "/services/marketing-attribution",
              },
              {
                label: "Budget",
                heading: "Location-level pacing",
                description:
                  "Spend set per location against its own booked-outcome cost, not a blended average.",
                href: "/services/marketing-operations",
              },
            ]}
          />
        </Container>
      </Section>

      <Section surface="paper-2">
        <Container>
          <SectionHead heading="StageGrid" as="h2" />
          <p className="mb-4 text-sm text-muted">
            Renders nothing below — content/services is empty in this commit, and StageGrid is
            specified to degrade to nothing rather than an empty container. This is the correct
            behavior, not a bug.
          </p>
          <StageGrid stage="tof" />
        </Container>
      </Section>

      <Section surface="paper">
        <Container>
          <SectionHead heading="DefinitionList" as="h2" />
          <DefinitionList
            items={[
              {
                term: "Access",
                definition: "Read access to the ad account and call tracking platform.",
              },
              {
                term: "Systems",
                definition:
                  "API or export access to the CRM or booking system used to confirm outcomes.",
              },
              {
                term: "Point of contact",
                definition: "One person on your side who can approve tracking changes within a week.",
              },
            ]}
          />
        </Container>
      </Section>

      <Section surface="navy">
        <Container>
          <SectionHead heading="StageSequence" as="h2" />
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
                title: "Attribution build",
                body: "Call scoring, CRM matching, and a cost-per-booked-outcome model, built to your systems.",
                when: "Weeks 3–6",
              },
              {
                number: "03",
                title: "Program launch",
                body: "Campaigns go live against the new measurement standard, not the platform's own report.",
                when: "Weeks 7–8",
              },
              {
                number: "04",
                title: "Ongoing reporting",
                body: "Monthly reporting against booked outcomes, with budget reallocated toward what is working.",
                when: "Ongoing",
              },
            ]}
          />
        </Container>
      </Section>

      <Section surface="paper">
        <Container>
          <SectionHead heading="MetricTable" as="h2" />
          <MetricTable
            caption="Cost per booked outcome by channel"
            columns={[
              { key: "channel", label: "Channel" },
              { key: "spend", label: "Spend", numeric: true },
              { key: "booked", label: "Booked outcomes", numeric: true },
              { key: "cpbo", label: "Cost per booked outcome", numeric: true },
            ]}
            rows={[
              { channel: "Paid search (non-brand)", spend: "—", booked: "—", cpbo: "—" },
              { channel: "Paid social", spend: "—", booked: "—", cpbo: "—" },
            ]}
            source="placeholder"
          />
        </Container>
      </Section>

      <Section surface="paper-2">
        <Container>
          <SectionHead heading="QuoteBlock" as="h2" />
          <QuoteBlock
            quote="We stopped guessing which channel closed the deal. Now we can see it."
            name="Placeholder attribution"
            role="Pending client approval"
            organization="Placeholder"
          />
        </Container>
      </Section>

      <Section surface="paper">
        <Container>
          <SectionHead heading="CrossLinks" as="h2" />
          <CrossLinks
            slugs={[
              "/services/seo",
              "/services/generative-engine-optimization",
              "/services/answer-engine-optimization",
            ]}
          />
        </Container>
      </Section>

      <Section surface="navy">
        <Container>
          <SectionHead heading="CTABand" as="h2" />
          <CTABand
            heading="Ready to see what your channels actually produce?"
            body="A measurement audit shows what is tracked today against what your revenue system records."
            cta={{ label: "Book a call", href: "/contact" }}
          />
        </Container>
      </Section>

      <Section surface="paper">
        <Container>
          <SectionHead heading="FAQ" as="h2" />
          <FAQ
            items={[
              {
                question: "What if our CRM has no API?",
                answer:
                  "We work with a scheduled export where an API is not available. Match quality is documented either way.",
              },
              {
                question: "How long until the data is trustworthy?",
                answer:
                  "Most accounts reach a reliable baseline within the first two reporting cycles, once call scoring and CRM matching are both live.",
              },
              {
                question: "Do you replace our current agency?",
                answer:
                  "Not necessarily. We can run the measurement layer underneath an existing agency's execution.",
              },
            ]}
          />
        </Container>
      </Section>
    </div>
  );
}
