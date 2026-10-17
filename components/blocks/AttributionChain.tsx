export interface AttributionChainStep {
  name: string;
  source: string;
}

export interface AttributionChainProps {
  steps?: AttributionChainStep[];
  breakAfterIndex?: number;
  /** Rendered as a callout panel right after the break. Omit to let the chain's own
   * visual treatment carry the break with nothing else - see `gradient` below. */
  breakLabel?: string;
  /** Orange through the steps before the break, turning to #E24221 (the brand gradient's
   * other end, instruction 8) at the break and solid #E24221 after - instead of the plain
   * accent line and the signal-colored break panel. The dental landing page is the one
   * place this is used; everywhere else stays the original treatment. */
  gradient?: boolean;
  /** Numbered circles instead of plain dots - legitimate only where the steps are
   * genuinely a sequence, which this is. */
  numbered?: boolean;
}

const DEFAULT_STEPS: AttributionChainStep[] = [
  {
    name: "Budget committed",
    source: "Google Ads, Meta, LSA, print, direct mail",
  },
  {
    name: "Click or impression",
    source: "Platform-reported, ungrounded in revenue",
  },
  {
    name: "Call, form, or chat",
    source: "Call tracking, form capture, session stitching",
  },
  {
    name: "Qualified inquiry",
    source: "Call scored, spam and vendor calls removed",
  },
  {
    name: "Booked appointment or signed agreement",
    source: "CRM, EMR, or PMS record matched back to source",
  },
  {
    name: "Revenue recorded",
    source: "Cost per booked outcome, by channel and location",
  },
];

const DEFAULT_BREAK_AFTER_INDEX = 2;
const DEFAULT_BREAK_LABEL =
  "Most agency reporting stops above this line. Everything below it is where the money is decided.";

const GRADIENT_END = "#E24221";

/**
 * The one element on this site that has to be memorable — it is the
 * argument, not decoration. Pure HTML and CSS: no SVG, no illustration, no
 * canvas, no animation, no scroll effects.
 *
 * Default props reproduce the original, hardcoded attribution-pillar version exactly
 * (plain accent line, --color-signal break panel, undecorated dots) - content/services/
 * marketing-attribution.mdx renders this bare, <AttributionChain />, and must keep
 * getting that exact output. --color-signal is used exactly once, in that default path,
 * and nowhere else on the site. The gradient/numbered variant is the one exception to
 * "no image, no illustration" territory this site otherwise holds to - instruction 24
 * sanctions it explicitly, for the dental landing page only.
 */
export default function AttributionChain({
  steps = DEFAULT_STEPS,
  breakAfterIndex = DEFAULT_BREAK_AFTER_INDEX,
  breakLabel = DEFAULT_BREAK_LABEL,
  gradient = false,
  numbered = false,
}: AttributionChainProps) {
  // Numbered circles need to be big enough to hold a readable numeral - the plain 11px
  // dot the default treatment uses has no text in it. Line/indent offsets below are each
  // sized to that circle's own center so the connecting line and the text indent still
  // line up, in either mode.
  const circleSize = numbered ? 22 : 11;
  const lineLeft = numbered ? (circleSize - 1.5) / 2 : 5;
  // 12px, not circleSize (11px) - the original hardcoded line start, one pixel into the
  // dot's own 4-15px span rather than flush with its bottom edge. Keeping this as its own
  // constant rather than deriving it from circleSize preserves the default path exactly.
  const lineTop = numbered ? circleSize : 12;
  const indentClass = numbered ? "pl-10" : "pl-8";

  return (
    // style, not just the list-none class: when this renders inside Prose (the real
    // attribution page), Prose's own "[&_ol]:list-decimal" - correct for genuine numbered
    // lists in MDX body copy - is a descendant selector and beats a single-class utility
    // on specificity alone, regardless of source order. That was silently putting native
    // "1. 2. 3." markers in front of every step on the live attribution page; inline style
    // can't lose that fight.
    <ol
      className="list-none border border-[rgba(255,236,220,0.14)] bg-raised p-6"
      style={{ listStyleType: "none" }}
    >
      {steps.map((step, index) => {
        const pastBreak = index > breakAfterIndex;
        const isBreakSegment = gradient && index === breakAfterIndex;
        const dotBackground = gradient && pastBreak ? GRADIENT_END : "var(--color-accent)";
        const lineBackground = isBreakSegment
          ? `linear-gradient(to bottom, var(--color-accent), ${GRADIENT_END})`
          : dotBackground;

        return (
          <li key={step.name} className={`relative pb-8 last:pb-0 ${indentClass}`}>
            {index < steps.length - 1 ? (
              <span
                aria-hidden="true"
                className="absolute h-full w-[1.5px]"
                style={{
                  left: `${lineLeft}px`,
                  top: `${lineTop}px`,
                  background: gradient ? lineBackground : "color-mix(in srgb, var(--color-accent) 30%, transparent)",
                }}
              />
            ) : null}
            <span
              aria-hidden="true"
              className={
                numbered
                  ? "absolute left-0 top-0 flex items-center justify-center rounded-full text-2xs font-display font-semibold text-black"
                  : "absolute left-0 top-1 rounded-full"
              }
              style={{
                width: `${circleSize}px`,
                height: `${circleSize}px`,
                background: gradient ? dotBackground : "var(--color-accent)",
              }}
            >
              {numbered ? index + 1 : null}
            </span>
            <p className="text-md text-white">{step.name}</p>
            <p className="mt-1 text-2xs text-muted">{step.source}</p>
            {index === breakAfterIndex && breakLabel ? (
              <div className="mt-4 border-l-2 border-signal bg-signal/10 py-3 pl-4">
                <p className="text-sm text-text">{breakLabel}</p>
              </div>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
