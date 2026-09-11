import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import { getRoute } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Page not found | SiteOptz",
  robots: { index: false, follow: false },
};

const LINKS = [
  getRoute("/services/top-of-funnel"),
  getRoute("/services/middle-of-funnel"),
  getRoute("/services/bottom-of-funnel"),
  getRoute("/services/marketing-attribution"),
  getRoute("/contact"),
];

export default function NotFound() {
  return (
    <Section surface="navy">
      <Container>
        <p className="mb-3 text-sm text-blue-300">Page not found</p>
        <h1 className="max-w-[18ch]">This page doesn&rsquo;t exist.</h1>
        <p className="mt-4 max-w-[46ch] text-[#B7C4DA]">
          The link is broken, or the page moved. Here&rsquo;s where the site actually is.
        </p>
        <ul className="mt-8 flex flex-col gap-3">
          {LINKS.map((route) => (
            <li key={route.path}>
              <Link
                href={route.path}
                className="font-display text-lg text-white hover:text-blue-300"
              >
                {route.label}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
