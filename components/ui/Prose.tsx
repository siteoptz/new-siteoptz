export interface ProseProps {
  children: React.ReactNode;
  variant?: "sans" | "serif";
}

const LINK_CLASSES =
  "[&_a]:text-blue-600 [&_a]:underline [&_a]:decoration-1 [&_a]:decoration-blue-300 " +
  "[&_a]:underline-offset-2 [&_a]:transition-colors [&_a]:duration-[120ms] " +
  "[&_a:hover]:decoration-blue-600 [.is-navy_&_a]:text-blue-300";

const STRUCTURE_CLASSES =
  "[&_p]:mb-[1.25em] [&_ul]:mb-[1.25em] [&_ol]:mb-[1.25em] " +
  "[&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-[1.25em] [&_ol]:pl-[1.25em] " +
  "[&_li]:mb-[0.4em] [&_strong]:font-semibold [&_em]:italic " +
  "[&_h2]:mt-[2em] [&_h2]:mb-[0.75em] [&_h3]:mt-[1.75em] [&_h3]:mb-[0.5em]";

const VARIANT_CLASSES: Record<NonNullable<ProseProps["variant"]>, string> = {
  sans:
    "font-sans [&_p]:max-w-[var(--measure-sans)] [&_h2]:max-w-[var(--measure-sans)] " +
    "[&_h3]:max-w-[var(--measure-sans)]",
  serif:
    "font-serif leading-[1.7] [&_p]:max-w-[var(--measure-serif)] " +
    "[&_h2]:max-w-[var(--measure-serif)] [&_h3]:max-w-[var(--measure-serif)]",
};

/**
 * Measure and vertical rhythm for long-form body copy, styling descendant
 * p/ul/ol/li/strong/em/a/h2/h3 for MDX output. Never styles h1 — the page's
 * one h1 lives in the hero, not in body copy.
 */
export default function Prose({ children, variant = "sans" }: ProseProps) {
  return (
    <div className={`${VARIANT_CLASSES[variant]} ${STRUCTURE_CLASSES} ${LINK_CLASSES}`}>
      {children}
    </div>
  );
}
