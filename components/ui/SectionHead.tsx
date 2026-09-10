export interface SectionHeadProps {
  heading: string;
  lead?: string;
  as?: "h2" | "h3";
}

/**
 * Two-column asymmetric grid at and above 900px: heading capped at 16ch on
 * the left, lead capped at the sans measure on the right, baselines aligned.
 * Single column below 900px. No eyebrow, kicker, icon, or centered variant —
 * do not add one later.
 */
export default function SectionHead({ heading, lead, as = "h2" }: SectionHeadProps) {
  const Heading = as;

  return (
    <div className="mb-[2.75rem] grid grid-cols-1 items-baseline gap-x-12 gap-y-3 min-[900px]:grid-cols-[16ch_1fr]">
      <Heading>{heading}</Heading>
      {lead ? <p className="max-w-[var(--measure-sans)] text-lg">{lead}</p> : null}
    </div>
  );
}
