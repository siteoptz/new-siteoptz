import Container from "@/components/ui/Container";

/**
 * The (lp) route group's only header. Not <Header />: no nav, no mega menu, no phone
 * number, no secondary CTA - every one of those is a way to leave a page we're paying to
 * put a visitor on, before the form. The logo is deliberately not a link, for the same
 * reason - on the main site it goes home; here that would be the single highest-value
 * exit on the page, sitting in the most-clicked position any page has.
 */
export default function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 h-[76px] bg-base">
      <Container>
        <div className="flex h-[76px] items-center">
          <span className="flex items-baseline gap-3">
            {/* Decorative — the wordmark span carries the lockup's meaning. Plain img, not
                next/image: see Header.tsx/Footer.tsx for why. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icon.svg" alt="" width={35} height={28} className="h-[28px] w-auto shrink-0" />
            <span className="font-display text-xl font-bold text-white">SiteOptz</span>
          </span>
        </div>
      </Container>
    </header>
  );
}
