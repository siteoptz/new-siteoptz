// Section is the only place vertical section rhythm is defined anywhere in
// this codebase. No page and no block may set its own section padding.

export type SectionSurface = "paper" | "paper-2" | "navy";
export type SectionSize = "default" | "compact";

export interface SectionProps {
  children: React.ReactNode;
  surface: SectionSurface;
  size?: SectionSize;
}

const SURFACE_CLASSES: Record<SectionSurface, string> = {
  paper: "bg-paper text-ink",
  "paper-2": "bg-paper-2 text-ink",
  navy: "is-navy bg-navy-900 text-[#DCE4F2] [&_:is(h1,h2,h3,h4)]:text-white",
};

const PADDING_CLASSES: Record<SectionSize, string> = {
  default: "py-section min-[900px]:py-section-lg",
  compact:
    "py-[calc(var(--spacing-section)/2)] min-[900px]:py-[calc(var(--spacing-section-lg)/2)]",
};

/**
 * `is-navy` on the navy surface is a plain CSS selector hook — components
 * like Prose reference it (e.g. `[.is-navy_&]:text-blue-300`) to change
 * appearance on dark surfaces without taking a prop.
 */
export default function Section({ children, surface, size = "default" }: SectionProps) {
  return (
    <section className={`${SURFACE_CLASSES[surface]} ${PADDING_CLASSES[size]}`}>
      {children}
    </section>
  );
}
