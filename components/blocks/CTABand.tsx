import Button from "@/components/ui/Button";

export interface CTABandProps {
  heading: string;
  body: string;
  cta: { label: string; href: string };
}

/** navy-800. Heading and body left, Button right, stacking below 900px. */
export default function CTABand({ heading, body, cta }: CTABandProps) {
  return (
    <div className="flex flex-col gap-6 bg-navy-800 p-8 min-[900px]:flex-row min-[900px]:items-center min-[900px]:justify-between">
      <div>
        <h3 className="text-white">{heading}</h3>
        <p className="mt-2 text-[#C3CDDF]">{body}</p>
      </div>
      <Button variant="primary" href={cta.href}>
        {cta.label}
      </Button>
    </div>
  );
}
