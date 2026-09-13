export interface ExpandIndicatorProps {
  isExpanded: boolean;
}

/**
 * A plus that becomes a minus: two 1px bars in --color-accent. The vertical
 * bar rotates flat into the horizontal one on expand, 140ms — disabled
 * under prefers-reduced-motion by the sitewide rule in globals.css that
 * zeroes every transition-duration, not a rule of its own here.
 *
 * Not a chevron: CLAUDE.md's arrow prohibition covers decorative arrows
 * appended to link/button text, which can be mistaken for navigation. This
 * is a disclosure control's state indicator, not link decoration.
 *
 * `isExpanded` must be read from the same value the trigger's
 * aria-expanded is set from — never separate state that could drift.
 * Expects a `group` class on the trigger button so group-hover: brightens
 * both bars together.
 */
export default function ExpandIndicator({ isExpanded }: ExpandIndicatorProps) {
  const barClasses = "absolute left-1/2 top-1/2 bg-accent group-hover:bg-accent-lt";

  return (
    <span aria-hidden="true" className="relative inline-block h-3.5 w-3.5 shrink-0">
      <span className={`${barClasses} h-px w-3.5 -translate-x-1/2 -translate-y-1/2`} />
      <span
        className={`${barClasses} h-3.5 w-px -translate-x-1/2 -translate-y-1/2 transition-transform duration-[140ms] ease-out ${
          isExpanded ? "rotate-90" : "rotate-0"
        }`}
      />
    </span>
  );
}
