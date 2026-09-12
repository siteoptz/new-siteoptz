export interface ProseProps {
  children: React.ReactNode;
  variant?: "sans" | "serif";
}

const LINK_CLASSES =
  "[&_a]:underline [&_a]:decoration-1 [&_a]:underline-offset-2 " +
  "[&_a]:transition-colors [&_a]:duration-[120ms]";

const STRUCTURE_CLASSES =
  "[&_p]:mb-[1.25em] [&_ul]:mb-[1.25em] [&_ol]:mb-[1.25em] " +
  "[&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-[1.25em] [&_ol]:pl-[1.25em] " +
  "[&_li]:mb-[0.4em] [&_strong]:font-semibold [&_em]:italic " +
  "[&_h2]:mt-[2em] [&_h2]:mb-[0.75em] [&_h3]:mt-[1.75em] [&_h3]:mb-[0.5em]";

const VARIANT_CLASSES: Record<NonNullable<ProseProps["variant"]>, string> = {
  // Dark long-form needs a taller line-height and a narrower measure than the old light
  // system did — this site has 21 pages of it, and 1.6/34rem read too dense on a dark
  // surface. The old system needed a separate, lighter link shade because the primary
  // link color failed contrast on a dark surface; accent clears 4.5:1 outright, so
  // there's one link color now.
  sans:
    "font-sans leading-[1.7] [&_p]:max-w-[36rem] [&_h2]:max-w-[36rem] [&_h3]:max-w-[36rem] " +
    "[&_a]:text-accent [&_a:hover]:text-accent-lt",
  // The reading surface only — light, so its own ink and its own link color.
  serif:
    "font-serif leading-[1.7] [&_p]:max-w-[var(--measure-serif)] " +
    "[&_h2]:max-w-[var(--measure-serif)] [&_h3]:max-w-[var(--measure-serif)] " +
    "[&_a]:text-reading-accent",
};

// services/industries MDX bodies may embed DefinitionList (dl), MetricTable (figure),
// QuoteBlock (blockquote), or AttributionChain (ol) alongside genuine prose. Without an
// explicit span, CSS grid auto-placement gives every direct child just one of twelve
// columns — a real bug independent of any column offset — so every direct child
// (prose tag or embedded component alike) gets an explicit full-span placement here.
const PLACEMENT_CLASSES = "grid grid-cols-1 min-[1100px]:grid-cols-12 min-[1100px]:[&>*]:col-span-12";

/**
 * Measure and vertical rhythm for long-form body copy, styling descendant
 * p/ul/ol/li/strong/em/a/h2/h3 for MDX output. Never styles h1 — the page's
 * one h1 lives in the hero, not in body copy.
 *
 * The sans variant's content spans the full container width — column placement is
 * Section's job (see its `width` prop) applied to prose-heavy sections, not Prose's.
 * The serif reading variant is left alone — the article template already places it
 * in its own TOC/body grid.
 */
export default function Prose({ children, variant = "sans" }: ProseProps) {
  const proseClasses = `${VARIANT_CLASSES[variant]} ${STRUCTURE_CLASSES} ${LINK_CLASSES}`;

  if (variant === "serif") {
    return <div className={proseClasses}>{children}</div>;
  }

  return <div className={`${PLACEMENT_CLASSES} ${proseClasses}`}>{children}</div>;
}
