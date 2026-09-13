import Link from "next/link";
import CTABand from "@/components/blocks/CTABand";
import PageHero from "@/components/blocks/PageHero";
import Breadcrumbs, { type BreadcrumbItem } from "@/components/layout/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import Container from "@/components/ui/Container";
import Prose from "@/components/ui/Prose";
import Section from "@/components/ui/Section";
import { getProofEntries } from "@/lib/content";
import { getRoute, type RouteEntry } from "@/lib/nav";
import { buildCollectionPage } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

const PAGE_DESCRIPTION =
  "Engagements described with the numbers we can evidence: what was measured, what changed, and what it cost. No composite case studies.";

export const metadata = buildMetadata({
  title: "Client Work and Results | SiteOptz",
  description: PAGE_DESCRIPTION,
  path: "/proof",
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

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default async function ProofHubPage() {
  const trail = buildTrail(getRoute("/proof"));
  const entries = await getProofEntries();
  const sorted = [...entries].sort(
    (a, b) => new Date(b.frontmatter.publishedAt).getTime() - new Date(a.frontmatter.publishedAt).getTime()
  );

  const collectionSchema = buildCollectionPage({
    name: "Client Work and Results",
    description: PAGE_DESCRIPTION,
    path: "/proof",
  });

  return (
    <div>
      <JsonLd data={collectionSchema} />

      <Section surface="base">
        <Container>
          <Breadcrumbs trail={trail} />
          <PageHero
            kicker="Proof"
            heading="Client work, with the numbers we can evidence."
            lead="Case studies from named client accounts, each approved in writing before it publishes - never a blended number across engagements."
          />
        </Container>
      </Section>

      <Section surface="base">
        <Container>
          <Prose>
            <p>
              Every case on this page is real, and every case is checkable. Before you read any of
              them, here is exactly how a number gets from a client&rsquo;s account onto this page - 
              and the two things we will not do to make that number look better than it is.
            </p>
            <p>
              Every figure on this page and on every case beneath it comes from one place: the
              system where the client&rsquo;s own business recorded the outcome - a CRM, an EMR, a
              property management system - tied back through the{" "}
              <Link href="/services/marketing-attribution">attribution layer</Link> built during{" "}
              <Link href="/how-it-works">the engagement itself</Link>. We do not report
              platform-claimed conversions, and we do not estimate what an outcome was probably
              worth. If a number cannot be pulled from a client&rsquo;s own record, it does not
              appear here.
            </p>
            <p>
              Before any case publishes, the named client sees the exact figures and the exact
              sentences describing them, and publication waits on their written approval. That
              approval is account-specific: it covers the numbers as written, not a general
              permission to reference the relationship. If a client asks us to hold a figure back,
              or to publish without a number at all, the case ships that way, or it does not ship.
            </p>
            <p>
              We do not publish composite or blended case studies. A result here is never an
              average across several accounts, several locations folded into one figure, or a mix
              of engagements presented as a single story, regardless of which of the{" "}
              <Link href="/industries">industries we work in</Link> it comes from. Every entry
              traces to one named client,
              doing one specific piece of work, over one stated period. Where the underlying work
              spanned multiple locations or channels, the entry says so explicitly rather than
              collapsing it into a cleaner-looking blended number.
            </p>
            <p>
              This is slower than most agencies&rsquo; approach to case studies, and it means some
              real work never gets published - a client who agrees the engagement went well is not
              always willing to put a written number behind it publicly, and we do not substitute a
              softer claim in its place. We would rather show fewer cases and stand behind every one
              of them than pad this page with the kind of case study any vendor can produce for
              free: a chart with no named source and no way to check it.
            </p>
            <p>
              If you are comparing us against other vendors making similar claims, ask each one the
              same three questions we hold ourselves to here: which account is this number from, can
              I see the client&rsquo;s written approval, and is this figure blended with anything
              else. A vendor unwilling to answer any of the three is telling you something about the
              rest of their reporting too - or{" "}
              <Link href="/contact">ask us those same questions directly</Link>.
            </p>
          </Prose>
        </Container>
      </Section>

      {sorted.length > 0 ? (
        <Section surface="raised">
          <Container>
            <div className="grid grid-cols-1 gap-px bg-rule">
              {sorted.map((entry) => (
                <Link
                  key={entry.slug}
                  href={`/proof/${entry.slug}`}
                  className="bg-base p-6 hover:brightness-110 min-[900px]:flex min-[900px]:items-baseline min-[900px]:justify-between min-[900px]:gap-8"
                >
                  <div>
                    <p className="font-display text-lg text-accent">{entry.frontmatter.title}</p>
                    <p className="mt-1 text-muted">{entry.frontmatter.description}</p>
                  </div>
                  <p className="mt-2 whitespace-nowrap text-sm text-muted min-[900px]:mt-0">
                    {formatDate(entry.frontmatter.publishedAt)}
                  </p>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      <Section surface="base">
        <Container>
          <CTABand
            heading="Ask what it would take to publish yours."
            body="If an engagement produced a number worth showing, we can walk through what sourcing and approval would look like before we start."
            cta={{ label: "Book a call", href: "/contact" }}
          />
        </Container>
      </Section>
    </div>
  );
}
