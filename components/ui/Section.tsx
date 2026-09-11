// Section is the only place vertical section rhythm is defined anywhere in
// this codebase. No page and no block may set its own section padding.

export type SectionSurface = "base" | "raised" | "reading";
export type SectionSize = "default" | "compact";

export interface SectionProps {
  children: React.ReactNode;
  surface: SectionSurface;
  size?: SectionSize;
}

const SURFACE_CLASSES: Record<SectionSurface, string> = {
  base: "surface-base bg-base text-text [&_:is(h1,h2,h3,h4)]:text-white",
  raised: "surface-raised bg-raised text-text [&_:is(h1,h2,h3,h4)]:text-white",
  reading: "surface-reading bg-reading text-reading-ink [&_:is(h1,h2,h3,h4)]:text-[#14100B]",
};

const PADDING_CLASSES: Record<SectionSize, string> = {
  default: "py-section min-[900px]:py-section-lg",
  compact:
    "py-[calc(var(--spacing-section)/2)] min-[900px]:py-[calc(var(--spacing-section-lg)/2)]",
};

/**
 * The surface-* class alongside the background utility is a plain CSS
 * selector hook, not a style of its own — globals.css uses it
 * (`.surface-base + .surface-base`) to add a hairline between two sections
 * of the same surface back to back, since base and raised sit much closer
 * together than the old paper/paper-2 pair did.
 */
export default function Section({ children, surface, size = "default" }: SectionProps) {
  return (
    <section className={`${SURFACE_CLASSES[surface]} ${PADDING_CLASSES[size]}`}>
      {children}
    </section>
  );
}
