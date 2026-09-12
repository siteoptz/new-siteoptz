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
 *
 * Top and bottom margin match, so a SectionHead reads as introducing what
 * follows rather than attached to whatever precedes it — when it follows a
 * Prose paragraph, that paragraph's own (smaller) bottom margin collapses
 * into this one rather than adding to it, so the gap above ends up equal to
 * the gap below regardless of what came before.
 */
export default function SectionHead({ heading, lead, as = "h2" }: SectionHeadProps) {
  const Heading = as;

  return (
    <div className="my-[2.75rem] grid grid-cols-1 items-baseline gap-x-12 gap-y-3 min-[900px]:grid-cols-[16ch_1fr]">
      <Heading>{heading}</Heading>
      {/* Same size as body prose (no explicit text-size — both inherit body's 17px) —
          only text-muted now marks it as the lead, not a larger step. */}
      {lead ? <p className="max-w-[var(--measure-sans)] text-muted">{lead}</p> : null}
    </div>
  );
}
