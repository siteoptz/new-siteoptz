import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";

// Paid-traffic landing page for dental.siteoptz.com. Own route group, noindex,
// excluded from the sitemap (never added to lib/nav.ts's ROUTES) - see
// docs/instruction-23-dental-landing-page.md and instruction-23a for why.
export const metadata = {
  title: "Dental marketing measured to accepted cases | SiteOptz",
  robots: { index: false, follow: false },
};

export default function DentalLandingPage() {
  return (
    <Section surface="base">
      <Container>
        <h1>Dental marketing measured to accepted cases, not phone calls.</h1>
      </Container>
    </Section>
  );
}
