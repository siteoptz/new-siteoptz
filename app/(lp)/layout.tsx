import LandingFooter from "@/components/layout/LandingFooter";
import SkipLink from "@/components/layout/SkipLink";

/**
 * The (lp) route group's own layout — deliberately not the marketing layout.
 * No Header, no mega menu: a paid-traffic landing page with site navigation
 * on it leaks the visitor back out to the main site, which is the opposite
 * of what paid traffic is for.
 */
export default function LandingPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SkipLink />
      <main id="main">{children}</main>
      <LandingFooter />
    </>
  );
}
