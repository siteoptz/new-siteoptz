# Instruction 0.5 — content blocks

Eleven blocks. Every one of the 40 pages is assembled from these and nothing else. This is
the last commit of Phase 0, and it ends at the review gate that decides whether the design
system holds.

---

## Before you paste

Fold in the two corrections from 0.4 as one small commit first:

- `app/fonts.ts` — drop the weight array on Inter Tight so next/font serves the variable
  axis; wordmark to 700, headings stay 600. Update CLAUDE.md section 3 to match
- Move the three plain nav links into the existing menu island as one `HeaderNav`
  component, so active state covers every link without a third client component

`fix: variable display font and complete nav active state`

Then open the Vercel preview on your phone and check the drawer once.

---

## The prompt — paste this exactly

```
Build components/blocks — eleven components. These are the only layout patterns the site
uses. No page may invent a new one without adding it here first.

All are server components. None takes className. All links resolve through lib/nav.ts.
Blocks do not set their own section padding — they are composed inside Section.

## PageHero

Props: kicker (string), heading, lead, cta (optional { label, href }).
navy-900. Kicker in blue-300 at var(--text-sm), sentence case, on its own line above the
heading — this is a funnel stage name, not a decorative label, and it is the only place a
line of text sits above a heading anywhere on the site. h1 capped at 18ch, lead capped at
46ch in #B7C4DA.

## BoundaryStatement

Props: slug (the current page's slug), children (the boundary prose).
Renders the prose in a block with a 2px left border in --color-rule and left padding, on
paper-2. Calls counterpartsOf(slug) itself and renders the counterpart links beneath the
prose, using each destination's first anchorVariant. The author never writes these links by
hand.

Throws at build time if counterpartsOf returns empty for a page whose pageType is
'service'. Every service page has a boundary.

## RuleList

Props: items — array of { label, heading, description, href }.
Hairline-separated rows, 1px top and bottom borders only, no side borders, no radius, no
shadow, no hover background. Three columns: label (short, blue-600, font-display), heading,
then description with a link beneath it. Two columns below 900px with the description
spanning.

## StageGrid

Props: stage ('tof' | 'mof' | 'bof').
Calls servicesByStage() and renders each service as a hairline row: shortLabel, then its
frontmatter summary. Reads from content — never duplicates copy into the hub. Handles an
empty result by rendering nothing rather than an empty container.

## DefinitionList

Props: items — array of { term, definition }.
Two-column dt/dd rows separated by hairlines. Term in font-display at var(--text-md), left
column capped at 16rem. Single column below 900px with the term above.

## StageSequence

Props: stages — array of { number, title, body, when }.
The four-stage engagement process. This is the only component in the codebase permitted to
render numbered markers, because it is the only content that is genuinely a sequence. 1px
gaps over a navy-700 background so the cells read as a grid. Four across, two at 900px, one
at 560px. Numbers in blue-300 at var(--text-sm).

## MetricTable

Props: caption, columns, rows, source (string).
Bordered figure, caption above in a paper-2 bar, tabular-nums, numeric columns
right-aligned. The source string renders below the table naming the account the figures
came from.

When source === 'placeholder', render em dashes in every numeric cell and a visible marker
below the table. The prebuild content check already fails production on placeholder
content; this makes it visible in preview too.

## QuoteBlock

Props: quote, name, role, organization — all four required, no optional attribution.
Source Serif 4 at var(--text-xl), line-height 1.45, 2px blue-600 left rule, attribution
beneath at var(--text-sm) in muted.

## CrossLinks

Props: slugs — array of exactly three route paths.
A row of three links in a 1px grid, no radius. Each renders the destination's shortLabel
and a one-line description from nav.ts. Throws if given other than three.

## CTABand

Props: heading, body, cta { label, href }.
navy-800. Heading and body left, Button right, stacking below 900px.

## FAQ

Props: items — array of { question, answer }.
Native disclosure semantics: a button with aria-expanded controlling a region, not a div
with a click handler. Keyboard operable, one item open at a time is not required — allow
several. Height animates 140ms, disabled under prefers-reduced-motion.

The component also renders the FAQPage JSON-LD from lib/schema.ts built from the same items
array, so the visible answers and the structured data cannot diverge. This is a client
component for the disclosure state; keep the island small.

## /kitchen-sink

A route rendering every block above with representative sample content — not lorem ipsum,
but plausible copy for this business, so the system can be judged as it will actually look.
Include each block on both paper and navy where it supports both.

Add it to the noindex list and exclude it from sitemap.ts.

## Verification

Confirm build, typecheck, lint clean. Confirm the FAQ is keyboard operable and its emitted
JSON-LD matches its rendered items. Confirm MetricTable with source='placeholder' renders
the marker.

Commit: feat: content block components
```

---

## What to check before accepting

- [ ] `BoundaryStatement` generates its counterpart links from `nav.ts` — no href passed in
- [ ] `CrossLinks` throws on two or four slugs
- [ ] `MetricTable` at `source='placeholder'` shows the marker
- [ ] `FAQ`'s JSON-LD and its visible items are built from one array, not two
- [ ] `FAQ` uses a real button with `aria-expanded`, not a div
- [ ] `StageSequence` is the only block with numbered markers
- [ ] No block sets vertical section padding
- [ ] `/kitchen-sink` is noindexed and out of the sitemap
- [ ] Still exactly three dependencies

---

## The review gate — this is the actual checkpoint

Open `/kitchen-sink` on the preview and spend real time on it. Everything after this
commit is content; the system is fixed here.

Judge it against these, in order:

1. **Does it look like it was designed, or assembled?** If every block has the same border
   radius, the same grey border, and the same internal padding, it is a kit. The
   distinction between a hairline list, a bordered figure, and a navy grid should be
   legible at a glance.
2. **Would a CMO at a 40-location practice group take it seriously?** That is the actual
   test. Squint at it next to Tinuiti or Merkle. Not "is it clean" — is it *senior*.
3. **Count the prohibitions.** Eyebrow labels, single-word headline accents, arrows on
   buttons, hover lifts, gradient decoration, numbered markers outside StageSequence. Any
   hit is a system-level fix, not a page-level one.
4. **Is anything memorable?** Restraint everywhere and boldness nowhere produces a
   competent site nobody remembers. Right now the intended memorable element is the
   attribution chain in the home hero, which does not exist yet — so the honest question
   is whether the rest is quiet enough to let it land.
5. **Read the sample copy aloud.** If it sounds like an agency wrote it about itself, the
   voice rules are not landing and Phase 2 will produce 23 pages of it.

If two or more of these fail, fix the blocks now. A system change here is one commit. The
same change after Phase 3 is 23 pages of rework, and by then the pressure will be to leave
it.

---

## Next

Prompt 1.1 — the home page, and the first real content on the site. It introduces
`AttributionChain`, the one component that carries the argument rather than the layout, and
the only place `--color-signal` appears anywhere.
