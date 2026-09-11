import Link from "next/link";
import PageHero from "@/components/blocks/PageHero";
import Breadcrumbs, { type BreadcrumbItem } from "@/components/layout/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import Container from "@/components/ui/Container";
import Prose from "@/components/ui/Prose";
import Section from "@/components/ui/Section";
import { getPointOfViewEntries } from "@/lib/content";
import { getRoute, type RouteEntry } from "@/lib/nav";
import { buildCollectionPage } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

const PAGE_DESCRIPTION =
  "Written positions on attribution, AI search, and marketing measurement — for operators deciding where to put next quarter's budget.";

export const metadata = buildMetadata({
  title: "Point of View | SiteOptz",
  description: PAGE_DESCRIPTION,
  path: "/point-of-view",
});

function stripSiteSuffix(title: string): string {
  return title.replace(/\s*\|\s*SiteOptz\s*$/i, "");
}

/**
 * frontmatter dates are calendar dates ("2026-09-11"), not timestamps.
 * `new Date(iso)` parses that as UTC midnight, so formatting it in the
 * server's local timezone can display the day before — force UTC so the
 * displayed date always matches what's written in the MDX.
 */
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

function buildTrail(route: RouteEntry): BreadcrumbItem[] {
  const trail: BreadcrumbItem[] = [];
  let current: RouteEntry | null = route;
  while (current) {
    trail.unshift({ name: current.label, path: current.path });
    current = current.parent ? getRoute(current.parent) : null;
  }
  return trail;
}

export default async function PointOfViewHubPage() {
  const trail = buildTrail(getRoute("/point-of-view"));
  const entries = await getPointOfViewEntries();
  const sorted = [...entries].sort(
    (a, b) => new Date(b.frontmatter.publishedAt).getTime() - new Date(a.frontmatter.publishedAt).getTime()
  );

  const collectionSchema = buildCollectionPage({
    name: "Point of View",
    description: PAGE_DESCRIPTION,
    path: "/point-of-view",
  });

  return (
    <div>
      <JsonLd data={collectionSchema} />

      <Section surface="base">
        <Container>
          <Breadcrumbs trail={trail} />
          <PageHero
            kicker="Point of View"
            heading="Positions, argued."
            lead="Written positions on attribution, search, and marketing measurement, for operators deciding where next quarter's budget actually goes."
          />
        </Container>
      </Section>

      <Section surface="base">
        <Container>
          <Prose>
            <p>
              This section exists to argue specific positions on measurement questions that
              operators are actually weighing. Each article takes one stance — why a particular
              platform number cannot be trusted at face value, what{" "}
              <Link href="/how-it-works">our four-stage engagement process</Link> turns up before a
              single dollar moves, how to read a report most vendors present without context — and
              argues it directly enough that a reader could disagree with it outright, rather than
              skim past a hedge.
            </p>
            <p>
              That is a deliberate difference from <Link href="/services">our services</Link>. A
              service page describes what a program does and how it is measured. An article here
              takes a stance on a question an operator is actually facing before they have decided
              whether to work with anyone at all, written for that specific reader: someone
              deciding where next quarter&rsquo;s budget goes, whether or not they ever{" "}
              <Link href="/contact">book a call</Link>.
            </p>
            <p>
              Each piece is built the same way: a specific, falsifiable claim, argued from
              documented mechanisms rather than from a statistic nobody can actually source.
              Where a claim rests on how a platform or a system genuinely behaves — an
              attribution window, a modeling assumption, a default a vendor rarely explains — that
              mechanism gets named and described in enough detail to check independently. Where an
              argument would require a number no one here can trace to a named account, it gets
              made without one, even where a number would land more easily.
            </p>
            <p>
              New positions get added as they become worth arguing, on their own schedule rather
              than a fixed content calendar. Each one links back to the specific service pages its
              argument bears on, so a reader convinced by it has an immediate next step to take.
              Read one article and the next one referenced from it, and the underlying claim
              behind the whole site starts to hold together as an argument rather than a set of
              assertions taken on faith.
            </p>
          </Prose>
        </Container>
      </Section>

      <Section surface="raised">
        <Container>
          <div className="grid grid-cols-1 gap-px bg-rule">
            {sorted.map((entry) => (
              <Link
                key={entry.slug}
                href={`/point-of-view/${entry.slug}`}
                className="bg-paper p-6 hover:bg-paper-2 min-[900px]:flex min-[900px]:items-baseline min-[900px]:justify-between min-[900px]:gap-8"
              >
                <div>
                  <p className="font-display text-lg text-ink">{stripSiteSuffix(entry.frontmatter.title)}</p>
                  <p className="mt-1 text-muted">{entry.frontmatter.dek}</p>
                </div>
                <p className="mt-2 whitespace-nowrap text-sm text-muted min-[900px]:mt-0">
                  {formatDate(entry.frontmatter.publishedAt)}
                </p>
              </Link>
            ))}
          </div>
        </Container>
      </Section>
    </div>
  );
}
