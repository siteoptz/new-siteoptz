import Button from "@/components/ui/Button";

export interface PageHeroCta {
  label: string;
  href: string;
}

export interface PageHeroProps {
  kicker: string;
  heading: string;
  lead: string;
  cta?: PageHeroCta;
}

/**
 * Always composed inside a navy Section. The kicker is the only place a
 * line of text sits above a heading anywhere on the site — it names the
 * funnel stage, not a decorative eyebrow.
 */
export default function PageHero({ kicker, heading, lead, cta }: PageHeroProps) {
  return (
    <div>
      <p className="mb-3 text-sm text-blue-300">{kicker}</p>
      <h1 className="max-w-[18ch]">{heading}</h1>
      <p className="mt-4 max-w-[46ch] text-[#B7C4DA]">{lead}</p>
      {cta ? (
        <div className="mt-8">
          <Button variant="primary" href={cta.href}>
            {cta.label}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
