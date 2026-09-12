import Link from "next/link";
import PageHero from "@/components/blocks/PageHero";
import Breadcrumbs, { type BreadcrumbItem } from "@/components/layout/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import Container from "@/components/ui/Container";
import Prose from "@/components/ui/Prose";
import Section from "@/components/ui/Section";
import { DIRECT_EMAIL } from "@/lib/contact-schema";
import { formatDate } from "@/lib/format";
import { getRoute, type RouteEntry } from "@/lib/nav";
import { buildWebPage } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

const LAST_UPDATED = "2026-09-11";
const LEGAL_ENTITY = "Vortex Demand, LLC, doing business as SiteOptz";
const REGISTERED_ADDRESS = "9595 Six Pines Dr., Ste 8210, The Woodlands, TX 77380";

export const metadata = buildMetadata({
  title: "Privacy Policy | SiteOptz",
  description:
    "What this website collects, how call recording and cookies work, how long data is kept, and how client data is handled under signed BAAs.",
  path: "/privacy",
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

export default function PrivacyPage() {
  const trail = buildTrail(getRoute("/privacy"));

  const webPageSchema = buildWebPage({
    name: "Privacy Policy",
    description: metadata.description as string,
    path: "/privacy",
  });

  return (
    <div>
      <JsonLd data={webPageSchema} />

      <Section surface="base">
        <Container>
          <Breadcrumbs trail={trail} />
          <PageHero
            kicker="Privacy"
            heading="Privacy policy."
            lead="What this website collects, how it's used, and how data from a client engagement is handled separately."
          />
        </Container>
      </Section>

      <Section surface="base" width="narrow">
        <Container>
          <Prose>
            <h2>What this covers</h2>
            <p>
              This policy covers two different things, and they are governed differently. The
              first is this website: the form you can fill out, the analytics that run while you
              browse, and the calls placed to a tracked number. The second is the data we handle
              on a client&rsquo;s behalf once an engagement starts — a client&rsquo;s CRM records, ad
              accounts, or call logs. That second category belongs to the client, is governed by
              the signed statement of work described in our{" "}
              <Link href="/terms">terms of service</Link>, and is covered separately in the{" "}
              &ldquo;Client data&rdquo; section below.
            </p>

            <h2>What we collect on this site</h2>
            <p>
              If you submit the contact form: your name, work email, company, role, number of
              locations, marketing spend band, current stack, and what you told us you&rsquo;re
              trying to measure.
            </p>
            <p>
              Through analytics — Google Analytics 4 and Google Tag Manager: pages viewed,
              referring source, approximate location from IP address, and device and browser
              type.
            </p>
            <p>
              Through call tracking — CallRail, when a tracked number shown on this site is
              called: the calling number, call duration, and the session that led to the call.
            </p>
          </Prose>
        </Container>
      </Section>

      <Section surface="raised" width="narrow">
        <Container>
          <Prose>
            <h2>Call recording</h2>
            <p>
              Calls to numbers displayed on this site may be recorded. We record for quality
              review and to attribute a call to the campaign and page that produced it. Recordings
              are accessible only to the people working on the account the call relates to, and
              CallRail is the processor that stores them on our behalf. A recording tied to a
              non-converting inquiry is deleted after 30 days, on the same schedule as the rest of
              that inquiry&rsquo;s record; a recording tied to a client or opportunity record is kept
              for as long as that record is kept, described below.
            </p>

            <h2>Cookies</h2>
            <p>
              This site sets two kinds of cookies, and no others. Analytics cookies, set by GA4
              and Google Tag Manager, so we can see aggregate traffic and behavior. First-party
              cookies set by CallRail, which connect a call back to the session that produced it,
              so we can tell which page and campaign led to it. Neither is an advertising cookie —
              this site does not run retargeting pixels, and we do not sell or share this data
              with advertisers. You can refuse both through your browser&rsquo;s cookie controls;
              refusing them does not affect your ability to browse the site or submit the contact
              form.
            </p>
          </Prose>
        </Container>
      </Section>

      <Section surface="base" width="narrow">
        <Container>
          <Prose>
            <h2>Retention</h2>
            <p>
              A contact form submission that does not turn into a client or an active opportunity
              is deleted after 30 days. Once a submission becomes a client or opportunity record,
              we keep it for the life of the relationship plus 10 years. Analytics data is kept
              according to Google&rsquo;s retention setting for this property, not a period we set
              ourselves. Call recordings follow the same rule as the record they belong to,
              described above.
            </p>

            <h2>Who processes data on our behalf</h2>
            <p>
              <strong>Google</strong> — analytics (GA4) and tag management (Google Tag Manager)
              for this site.
              <br />
              <strong>CallRail</strong> — call tracking, call recording, and the cookie that
              attributes a call to a session.
              <br />
              <strong>GoHighLevel</strong> — receives contact form submissions and stores them as
              leads.
              <br />
              <strong>Vercel</strong> — hosts this website.
            </p>
            <p>We do not use a processor beyond the four listed here.</p>
          </Prose>
        </Container>
      </Section>

      <Section surface="raised" width="narrow">
        <Container>
          <Prose>
            <h2>Client data</h2>
            <p>
              When an engagement gives us access to a client&rsquo;s systems — a CRM, an EMR, a call
              tracking platform, an ad account — that access is granted by the client, scoped to
              what the engagement requires, and used only for that engagement. It is handled by
              the same senior team described on our <Link href="/about">about SiteOptz</Link> page,
              not a rotating pool of contractors.
            </p>
            <p>
              Where a client is a covered entity, we sign a Business Associate Agreement before
              any work touching protected health information begins. Our team has completed
              HIPAA training, and we operate under written policies and safeguards governing how
              that data is stored, handled, and who can access it. We make no certification claim
              beyond this — no HIPAA certification exists, and no government body issues one.
            </p>
            <p>
              We work to keep patient and customer identifiers out of the advertising platforms
              and analytics tools we configure, using de-identified or hashed values wherever a
              platform requires an identifier at all. Client data is never used to train any model,
              and it is never shared between clients — what we learn on one engagement stays with
              that engagement.
            </p>
          </Prose>
        </Container>
      </Section>

      <Section surface="base" width="narrow">
        <Container>
          <Prose>
            <h2>Your choices</h2>
            <p>
              To request access to, a correction of, or deletion of the information we hold about
              you, email{" "}
              <a href={`mailto:${DIRECT_EMAIL}`} className="text-accent underline">
                {DIRECT_EMAIL}
              </a>
              . We respond within one business day, the same commitment we make for every
              inquiry through this site.
            </p>

            <h2>Changes to this policy</h2>
            <p>
              We update this policy when what we collect or how we handle it changes. This
              version was last updated {formatDate(LAST_UPDATED)}.
            </p>

            <h2>How to reach us</h2>
            <p>
              {LEGAL_ENTITY}
              <br />
              {REGISTERED_ADDRESS}
              <br />
              <a href={`mailto:${DIRECT_EMAIL}`} className="text-accent underline">
                {DIRECT_EMAIL}
              </a>
            </p>
            <p>
              Questions about a specific engagement are best asked directly — see{" "}
              <Link href="/how-it-works">our four-stage engagement process</Link> for how one
              runs, or <Link href="/contact">book a call</Link> to talk to someone about it.
            </p>
          </Prose>
        </Container>
      </Section>
    </div>
  );
}
