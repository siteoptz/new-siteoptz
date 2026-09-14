import Link from "next/link";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { getProofEntries } from "@/lib/content";
import { type FunnelStage, getRoute, industriesList, servicesByStage } from "@/lib/nav";
import HeaderNav, { type HeaderNavItem, type MegaMenuColumn } from "./HeaderNav";
import MobileDrawer from "./MobileDrawer";

function buildStageColumn(hubPath: string, stage: FunnelStage): MegaMenuColumn {
  const hub = getRoute(hubPath);
  return {
    heading: hub.label,
    headingHref: hub.path,
    items: servicesByStage(stage).map((route) => ({
      href: route.path,
      label: route.shortLabel,
    })),
  };
}

export default async function Header() {
  const home = getRoute("/");
  const servicesRoute = getRoute("/services");
  const howItWorks = getRoute("/how-it-works");
  const industriesRoute = getRoute("/industries");
  const pointOfView = getRoute("/point-of-view");
  const proof = getRoute("/proof");
  const contact = getRoute("/contact");
  const pillar = getRoute("/services/marketing-attribution");

  const stageColumns: MegaMenuColumn[] = [
    buildStageColumn("/services/top-of-funnel", "tof"),
    buildStageColumn("/services/middle-of-funnel", "mof"),
    buildStageColumn("/services/bottom-of-funnel", "bof"),
  ];

  const industriesColumn: MegaMenuColumn = {
    heading: industriesRoute.label,
    headingHref: industriesRoute.path,
    items: industriesList().map((route) => ({ href: route.path, label: route.label })),
  };

  const proofEntries = await getProofEntries();
  const mostRecentProof = proofEntries
    .slice()
    .sort((a, b) => b.frontmatter.updatedAt.localeCompare(a.frontmatter.updatedAt))
    .at(0);

  const attributionExtra = (
    <div>
      <Link
        href={pillar.path}
        className="mb-2 block text-sm font-medium text-white hover:text-accent-lt"
      >
        {pillar.shortLabel}
      </Link>
      <p className="mb-3 text-sm text-muted">Measures all three funnel stages, together.</p>
      {mostRecentProof ? (
        <Link
          href={`/proof/${mostRecentProof.slug}`}
          className="block text-sm text-muted hover:text-white"
        >
          Recent proof: {mostRecentProof.frontmatter.title}
        </Link>
      ) : null}
    </div>
  );

  const navItems: HeaderNavItem[] = [
    {
      type: "menu",
      id: "services",
      label: servicesRoute.label,
      basePath: servicesRoute.path,
      columns: stageColumns,
      extra: attributionExtra,
      layout: "grid",
    },
    { type: "link", path: howItWorks.path, label: howItWorks.label },
    {
      type: "menu",
      id: "industries",
      label: industriesRoute.label,
      basePath: industriesRoute.path,
      columns: [industriesColumn],
      layout: "single",
    },
    { type: "link", path: pointOfView.path, label: pointOfView.label },
    { type: "link", path: proof.path, label: proof.label },
  ];

  return (
    <header className="sticky top-0 z-50 h-[76px] border-b border-[rgba(255,236,220,0.14)] bg-base">
      <Container>
        <div className="flex h-[76px] items-center justify-between">
          <Link href={home.path} className="flex items-baseline gap-3">
            {/* Decorative — the wordmark span below carries the link's accessible name.
                Plain img, not next/image: next/image refuses to optimize SVG sources
                without images.dangerouslyAllowSVG in next.config.ts, which is a wider
                security-relevant change than this brand-mark lockup calls for. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icon.svg" alt="" width={35} height={28} className="h-[28px] w-auto shrink-0" />
            <span className="font-display text-xl font-bold text-white">SiteOptz</span>
            <span
              aria-hidden="true"
              className="hidden text-2xs text-muted min-[480px]:inline"
            >
              Marketing intelligence
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-8 min-[900px]:flex">
            <HeaderNav items={navItems} />
            <Button variant="primary" href={contact.path}>
              {contact.label}
            </Button>
          </nav>

          <MobileDrawer
            stageColumns={stageColumns}
            industriesColumn={industriesColumn}
            links={[howItWorks, pointOfView, proof].map((route) => ({
              href: route.path,
              label: route.label,
            }))}
            contact={{ href: contact.path, label: contact.label }}
          />
        </div>
      </Container>
    </header>
  );
}
