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
  title: "Terms of Service | SiteOptz",
  description:
    "The terms governing use of this website. Client engagements are governed separately by the signed statement of work, which controls where the two conflict.",
  path: "/terms",
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

export default function TermsPage() {
  const trail = buildTrail(getRoute("/terms"));

  const webPageSchema = buildWebPage({
    name: "Terms of Service",
    description: metadata.description as string,
    path: "/terms",
  });

  return (
    <div>
      <JsonLd data={webPageSchema} />

      <Section surface="base">
        <Container>
          <Breadcrumbs trail={trail} />
          <PageHero
            kicker="Terms"
            heading="Terms of service."
            lead="What governs this website, and what governs a client engagement — they are not the same document."
          />
        </Container>
      </Section>

      <Section surface="base">
        <Container>
          <Prose>
            <p>
              These terms govern use of this website only. If you are a client, your engagement is
              governed by the statement of work you signed, and where this page and that statement
              of work conflict, the statement of work controls. Nothing on this page modifies,
              replaces, or adds to a signed statement of work.
            </p>

            <h2>Using this site</h2>
            <p>
              You may browse this site, read what&rsquo;s published on it, and submit the contact
              form to reach us. You may not attempt to disrupt the site, scrape it beyond what a
              search engine or a person browsing normally would do, or use anything on it to
              build a competing product or service without our written permission.
            </p>

            <h2>Ownership</h2>
            <p>
              The text, frameworks, and visual design on this site are ours.{" "}
              <Link href="/how-it-works">Our four-stage engagement process</Link> and the methods
              described under{" "}
              <Link href="/services/marketing-attribution">
                attribution built to your revenue system
              </Link>{" "}
              remain our intellectual property whether or not you become a client — reading about
              a method here does not grant a license to use it.
            </p>

            <h2>Links to other sites</h2>
            <p>
              This site may link to pages we don&rsquo;t control, including client sites and
              industry sources. We aren&rsquo;t responsible for the content or practices of a site we
              link to, and a link isn&rsquo;t an endorsement of everything on it.
            </p>
          </Prose>
        </Container>
      </Section>

      <Section surface="raised">
        <Container>
          <Prose>
            <h2>Not advice, and not a relationship</h2>
            <p>
              Nothing on this site is legal, medical, financial, or compliance advice, and reading
              it doesn&rsquo;t create a client relationship between you and{" "}
              {LEGAL_ENTITY}. A client relationship exists only once a statement of work is
              signed.
            </p>

            <h2>No warranty on results</h2>
            <p>
              Case studies, figures, and descriptions of past work published on this site describe
              what happened in a specific, named engagement. We make no warranty that a similar
              result will be reproduced in any other engagement, including yours.
            </p>

            <h2>Limitation of liability</h2>
            <p>
              To the extent permitted by law, {LEGAL_ENTITY} is not liable for indirect,
              incidental, or consequential damages arising from your use of this website. This
              section does not limit liability arising under a signed statement of work — that
              document sets its own terms.
            </p>
          </Prose>
        </Container>
      </Section>

      <Section surface="base">
        <Container>
          <Prose>
            <h2>Governing law</h2>
            <p>
              These terms are governed by the laws of the State of Texas, without regard to its
              conflict-of-law rules. Any dispute arising from this website is subject to the
              exclusive venue of the state and federal courts of Montgomery County, Texas.
            </p>

            <h2>Changes to these terms</h2>
            <p>
              We update these terms when how the site works or what it says changes. This version
              was last updated {formatDate(LAST_UPDATED)}.
            </p>

            <h2>Contact</h2>
            <p>
              {LEGAL_ENTITY}
              <br />
              {REGISTERED_ADDRESS}
              <br />
              <a href={`mailto:${DIRECT_EMAIL}`} className="text-blue-600 underline">
                {DIRECT_EMAIL}
              </a>
            </p>
            <p>
              For how we handle data collected through this site, see our{" "}
              <Link href="/privacy">privacy policy</Link>. To start a conversation about an
              engagement, <Link href="/contact">book a call</Link>.
            </p>
          </Prose>
        </Container>
      </Section>
    </div>
  );
}
