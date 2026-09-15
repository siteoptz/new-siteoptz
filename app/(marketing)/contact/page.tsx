import Link from "next/link";
import PageHero from "@/components/blocks/PageHero";
import ContactForm from "@/components/blocks/ContactForm";
import Breadcrumbs, { type BreadcrumbItem } from "@/components/layout/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import Container from "@/components/ui/Container";
import Prose from "@/components/ui/Prose";
import Section from "@/components/ui/Section";
import { DIRECT_EMAIL } from "@/lib/contact-schema";
import { getRoute, type RouteEntry } from "@/lib/nav";
import { buildContactPage } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Marketing Attribution Consultation | SiteOptz",
  description:
    "Book a marketing attribution consultation: tell us what you are trying to measure, and we reply within one business day with a time or a referral.",
  path: "/contact",
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

export default function ContactPage() {
  const trail = buildTrail(getRoute("/contact"));

  const contactPageSchema = buildContactPage({
    name: "Contact SiteOptz",
    description: metadata.description as string,
    path: "/contact",
  });

  return (
    <div>
      <JsonLd data={contactPageSchema} />

      <Section surface="base">
        <Container>
          <Breadcrumbs trail={trail} />
          <PageHero
            kicker="Contact"
            heading="Book a working session."
            lead="Tell us what you're running today and the one thing you can't yet measure. A senior person reads it directly."
          />
        </Container>
      </Section>

      <Section surface="base">
        <Container>
          <Prose>
            <p>
              The form below books a marketing attribution consultation, and it&rsquo;s short - but
              the last field is the one that matters: describe the specific question you
              can&rsquo;t currently answer, not the department budget. Whoever
              would run the engagement reads every submission themselves - no intake queue - and
              you&rsquo;ll hear back within one business day with either a time to talk or a direct,
              honest referral elsewhere if what you&rsquo;ve described isn&rsquo;t something we do.
            </p>
            <p>
              We ask about location count and spend up front because the answer changes what&rsquo;s
              worth building first - a single clinic and a forty-location portfolio start from
              different places, even when the underlying question is the same. There&rsquo;s no wrong
              answer here; it just tells us where to begin.
            </p>
            <p>
              Want more context before booking? Read{" "}
              <Link href="/how-it-works">our four-stage engagement process</Link> for the stages in
              order, <Link href="/services/marketing-attribution">
                attribution built to your revenue system
              </Link>{" "}
              for the measurement layer itself, <Link href="/about">about SiteOptz</Link> for who
              reads what you send, and <Link href="/industries">industries we serve</Link> for the
              kinds of operators we build for most often.
            </p>
          </Prose>

          <div className="mt-10 max-w-[640px]">
            <ContactForm />
          </div>
        </Container>
      </Section>

      <Section surface="raised">
        <Container>
          <div className="grid grid-cols-1 gap-8 min-[700px]:grid-cols-2">
            <div>
              <h2 className="text-lg">Reach us for a marketing attribution consultation</h2>
              <p className="mt-2 text-muted">
                Prefer email? Write to{" "}
                <a href={`mailto:${DIRECT_EMAIL}`} className="text-accent underline">
                  {DIRECT_EMAIL}
                </a>{" "}
 - the same person who reads the form reads that inbox.
              </p>
            </div>
            <div>
              <h2 className="text-lg">Office</h2>
              <p className="mt-2 text-muted">
                9595 Six Pines Dr, Ste 8210
                <br />
                The Woodlands, TX 77380
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
