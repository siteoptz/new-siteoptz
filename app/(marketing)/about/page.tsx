import Link from "next/link";
import CTABand from "@/components/blocks/CTABand";
import PageHero from "@/components/blocks/PageHero";
import Breadcrumbs, { type BreadcrumbItem } from "@/components/layout/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import Container from "@/components/ui/Container";
import Prose from "@/components/ui/Prose";
import Section from "@/components/ui/Section";
import SectionHead from "@/components/ui/SectionHead";
import { getRoute, type RouteEntry } from "@/lib/nav";
import { buildAboutPage } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About SiteOptz | Marketing Intelligence",
  description:
    "A small senior team doing analyst work for operators. How we are structured, how we choose clients, and what we will not take on.",
  path: "/about",
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

export default function AboutPage() {
  const trail = buildTrail(getRoute("/about"));

  const aboutPageSchema = buildAboutPage({
    name: "About SiteOptz",
    description: metadata.description as string,
    path: "/about",
  });

  return (
    <div>
      <JsonLd data={aboutPageSchema} />

      <Section surface="base">
        <Container>
          <Breadcrumbs trail={trail} />
          <PageHero
            kicker="About"
            heading="A small team doing analyst work."
            lead="How the firm is structured, how we choose clients, and what we choose not to take on."
          />
        </Container>
      </Section>

      <Section surface="raised">
        <Container>
          <SectionHead heading="How we're structured, and why it stays small" />
          <Prose>
            <p>
              SiteOptz is structured as one senior team, not a layered account org chart. The same
              one or two people carry an account through{" "}
              <Link href="/how-it-works">our four-stage engagement process</Link>, from the first
              audit to the standing monthly review - there is no account manager sitting between
              the person who builds{" "}
              <Link href="/services/marketing-attribution">
                attribution built to your revenue system
              </Link>{" "}
              and the person who explains it to you on a call. That structure is a constraint we
              chose on purpose, not a size we haven&rsquo;t grown out of yet.
            </p>
            <p>
              Continuity is the actual payoff. The person explaining why a channel&rsquo;s budget
              moved this month is the same person who built the model measuring it, not someone
              briefed secondhand an hour before the call. Over a multi-year engagement, that
              difference shows up less in any single report and more in how fast a real problem
              gets noticed and named.
            </p>
            <p>
              It costs something, and we&rsquo;d rather say so directly than let a prospective client
              find out later. We take on a limited number of engagements at a time, and there is
              sometimes a wait before we can start one. We would rather tell you that on the first
              call than staff your account with someone junior just to keep the calendar full.
            </p>
          </Prose>
        </Container>
      </Section>

      <Section surface="base">
        <Container>
          <SectionHead heading="How we choose clients" />
          <Prose>
            <p>
              We work best with multi-location operators - {" "}
              <Link href="/industries/healthcare-marketing">
                marketing for multi-location healthcare groups
              </Link>
              , self-storage portfolios, professional services firms - where a single blended
              number hides which location or channel is actually producing revenue. That is also
              where a small team goes furthest: a handful of accounts we can go deep on, rather
              than a roster too large to know any of them well.
            </p>
            <p>
              Access is the first real signal. We ask, before the first working session, whether
              someone on your side can grant read access to the systems that record a booked
              outcome. How quickly that access shows up tends to predict how the rest of the
              engagement goes.
            </p>
            <p>
              A good first call usually surfaces one of two things: an operator who already
              suspects a blended, portfolio-wide number is hiding something, or one confident
              enough in the current numbers to want a second, independent read before moving more
              budget somewhere new. Either is a reasonable place to start.
            </p>
          </Prose>
        </Container>
      </Section>

      <Section surface="raised">
        <Container>
          <SectionHead heading="What we decline" />
          <Prose>
            <p>
              We decline single-location businesses more often than any other kind of prospect. The
              measurement layer we build earns its cost fastest at multi-location or multi-channel
              scale, and telling a single-location owner that before any spend serves them better
              than starting an engagement we don&rsquo;t expect to pay off.
            </p>
            <p>
              We decline work where nobody will grant access to the systems that record a booked
              outcome - a CRM, an EMR, a property management system. An attribution model built
              without that access is a guess wearing a dashboard, and we won&rsquo;t sell one.
            </p>
            <p>
              And we decline engagements built around reporting meant to flatter a budget decision
              already made, rather than inform the next one. That is a different service, and not
              one we offer.
            </p>
            <p>
              We also decline requests to commit to a specific percentage improvement before an
              audit has happened. That number doesn&rsquo;t exist yet, and promising one anyway is the
              same kind of unsourced claim this page won&rsquo;t make about our own work either. If any
              of this describes what you&rsquo;re looking for, say so when you{" "}
              <Link href="/contact">book a call</Link> and we&rsquo;ll point you somewhere more useful.
            </p>
          </Prose>
        </Container>
      </Section>

      <Section surface="base">
        <Container>
          <CTABand
            heading="Talk to the person who'd run your account."
            body="No queue, no handoff - book a working session and see if the timing lines up."
            cta={{ label: "Book a call", href: "/contact" }}
          />
        </Container>
      </Section>
    </div>
  );
}
