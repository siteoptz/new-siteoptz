const STEPS = [
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
] as const;

const BREAK_AFTER_INDEX = 2;

/**
 * The one element on this site that has to be memorable — it is the
 * argument, not decoration. Pure HTML and CSS: no SVG, no illustration, no
 * canvas, no animation, no scroll effects.
 *
 * --color-signal is used exactly once here, on the break marker between
 * steps 3 and 4, and nowhere else on the site.
 */
export default function AttributionChain() {
  return (
    <ol className="list-none border border-[rgba(255,236,220,0.14)] bg-raised p-6">
      {STEPS.map((step, index) => (
        <li key={step.name} className="relative pb-8 pl-8 last:pb-0">
          {index < STEPS.length - 1 ? (
            <span
              aria-hidden="true"
              className="absolute left-[5px] top-3 h-full w-[1.5px] bg-accent/30"
            />
          ) : null}
          <span
            aria-hidden="true"
            className="absolute left-0 top-1 h-[11px] w-[11px] rounded-full bg-accent"
          />
          <p className="text-md text-white">{step.name}</p>
          <p className="mt-1 text-2xs text-muted">{step.source}</p>
          {index === BREAK_AFTER_INDEX ? (
            <div className="mt-4 border-l-2 border-signal bg-signal/10 py-3 pl-4">
              <p className="text-sm text-text">
                Most agency reporting stops above this line. Everything below it is where the
                money is decided.
              </p>
            </div>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
