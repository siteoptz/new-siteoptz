import Link from "next/link";
import Container from "@/components/ui/Container";
import { getRoute } from "@/lib/nav";

const LEGAL_ENTITY = "Vortex Demand, LLC, doing business as SiteOptz";

/**
 * The (lp) route group's only footer. Deliberately not the full site Footer —
 * a landing page sending paid traffic is not the place to offer an exit into
 * services, industries, or the rest of the site. Privacy, Terms, and the
 * legal entity line are the only things a visitor giving us a phone number
 * needs to find from here.
 */
export default function LandingFooter() {
  const privacy = getRoute("/privacy");
  const terms = getRoute("/terms");

  return (
    <footer className="border-t border-[rgba(255,236,220,0.14)] bg-base text-muted">
      <Container>
        <div className="flex flex-col gap-3 py-6 text-2xs min-[560px]:flex-row min-[560px]:items-center min-[560px]:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {LEGAL_ENTITY}. All rights reserved.
          </p>
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
