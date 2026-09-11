import Button from "@/components/ui/Button";

export interface CTABandProps {
  heading: string;
  body: string;
  cta: { label: string; href: string };
}

/** The raised surface. Heading and body left, Button right, stacking below 900px. */
export default function CTABand({ heading, body, cta }: CTABandProps) {
  return (
    <div className="flex flex-col gap-6 bg-raised p-8 min-[900px]:flex-row min-[900px]:items-center min-[900px]:justify-between">
      <div>
        <h3 className="text-white">{heading}</h3>
        <p className="mt-2 text-muted">{body}</p>
      </div>
      <Button variant="primary" href={cta.href}>
        {cta.label}
      </Button>
    </div>
  );
}
