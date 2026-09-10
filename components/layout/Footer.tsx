import Link from "next/link";
import Container from "@/components/ui/Container";
import Rule from "@/components/ui/Rule";
import { type FunnelStage, getRoute, servicesByStage } from "@/lib/nav";

const POSITIONING_LINE =
  "We build the measurement layer that connects what you spend to what your business books, then run the acquisition programs on top of it.";

function buildStageColumn(hubPath: string, stage: FunnelStage) {
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

export default function Footer() {
  const home = getRoute("/");
  const industriesRoute = getRoute("/industries");
  const howItWorks = getRoute("/how-it-works");
  const pointOfView = getRoute("/point-of-view");
  const proof = getRoute("/proof");
  const about = getRoute("/about");
  const contact = getRoute("/contact");
  const privacy = getRoute("/privacy");
  const terms = getRoute("/terms");

  const stageColumns = [
    buildStageColumn("/services/top-of-funnel", "tof"),
    buildStageColumn("/services/middle-of-funnel", "mof"),
    buildStageColumn("/services/bottom-of-funnel", "bof"),
  ];

  const industryRoutes = [
    getRoute("/industries/healthcare-marketing"),
    getRoute("/industries/self-storage-marketing"),
    getRoute("/industries/professional-services-marketing"),
    getRoute("/industries/agency-partners"),
  ];

  const companyRoutes = [howItWorks, pointOfView, proof, about, contact];

  return (
    <footer className="border-t border-[rgba(255,255,255,0.14)] bg-navy-900 text-[#C3CDDF]">
      <Container>
        <div className="py-12">
          <Link href={home.path} className="font-display text-lg font-semibold text-white">
            SiteOptz
          </Link>
          <p className="mt-3 max-w-[var(--measure-sans)] text-sm">{POSITIONING_LINE}</p>
        </div>

        <Rule tone="dark" />

        <div className="grid grid-cols-1 gap-8 py-12 min-[560px]:grid-cols-2 min-[900px]:grid-cols-5">
          {stageColumns.map((column) => (
            <div key={column.headingHref}>
              <Link
                href={column.headingHref}
                className="mb-3 block text-sm font-medium text-white hover:text-blue-300"
              >
                {column.heading}
              </Link>
              <ul>
                {column.items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="block py-1 text-sm hover:text-white">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <Link
              href={industriesRoute.path}
              className="mb-3 block text-sm font-medium text-white hover:text-blue-300"
            >
              {industriesRoute.label}
            </Link>
            <ul>
              {industryRoutes.map((route) => (
                <li key={route.path}>
                  <Link href={route.path} className="block py-1 text-sm hover:text-white">
                    {route.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-3 text-sm font-medium text-white">Company</p>
            <ul>
              {companyRoutes.map((route) => (
                <li key={route.path}>
                  <Link href={route.path} className="block py-1 text-sm hover:text-white">
                    {route.label}
                  </Link>
                </li>
              ))}
              <li>
                <a href="mailto:info@siteoptz.com" className="block py-1 text-sm hover:text-white">
                  info@siteoptz.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Rule tone="dark" />

        <div className="flex flex-col gap-3 py-6 text-2xs min-[560px]:flex-row min-[560px]:items-center min-[560px]:justify-between">
          <p>&copy; {new Date().getFullYear()} SiteOptz. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href={privacy.path} className="hover:text-white">
              {privacy.label}
            </Link>
            <Link href={terms.path} className="hover:text-white">
              {terms.label}
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
