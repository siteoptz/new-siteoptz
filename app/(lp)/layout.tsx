import LandingFooter from "@/components/layout/LandingFooter";
import LandingHeader from "@/components/layout/LandingHeader";
import SkipLink from "@/components/layout/SkipLink";

/**
 * The (lp) route group's own layout — deliberately not the marketing layout.
 * LandingHeader is a logo-only lockup, not <Header />: no nav, no mega menu. A paid-traffic
 * landing page with site navigation on it leaks the visitor back out to the main site,
 * which is the opposite of what paid traffic is for - see instruction 24.
 */
export default function LandingPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SkipLink />
      <LandingHeader />
      <main id="main">{children}</main>
      <LandingFooter />
    </>
  );
}
