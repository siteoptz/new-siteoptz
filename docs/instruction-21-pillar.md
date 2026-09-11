# Instruction 2.1 — attribution pillar and service page template

The most consequential commit in the build. The template established here renders 23
service pages and 3 stage hubs, and the pillar is the page every other service page links
up to.

Build it slowly. A structural mistake here is 26 pages of rework.

---

## Two conflicts in the spec, resolved before you start

Both come from earlier instructions. Resolve them in this commit or they surface as
confusing build failures.

**1. The pillar has no counterpart.** `BoundaryStatement` was specified in 0.5 to throw
when `counterpartsOf()` returns empty for a page with `pageType: 'service'`. The
attribution pillar is a service page with `funnelStage: 'cross'` and no counterpart in the
boundary table, so it would throw. Amend the rule: throw only when `funnelStage !== 'cross'`.
The pillar renders no BoundaryStatement at all.

**2. `--color-signal` on two pages.** The home instruction said the attribution chain's
break marker is the only use of that token. The pillar spec also calls for the six-step
chain with the marked break. These are not in conflict once stated properly: the rule is
that `--color-signal` is defined and used in exactly one *component*, `AttributionChain`,
which appears on exactly two pages — the home hero and the pillar. Reuse the component.
Do not write a second treatment.

---

## The prompt — paste this exactly

```
Build the service page template and the attribution pillar. Read docs/sitemap-seo-plan.md
sections 4 and 5 first — section 4 is the anatomy every service page uses, section 5 has
the pillar's spec.

## 1. Amend lib/content.ts

Extend the services frontmatter schema with the fields the anatomy needs, so structure
lives in typed frontmatter and only prose lives in the MDX body:

- heroKicker (string — the funnel stage name in sentence case)
- lead (string, max 46ch worth of text — the hero lead paragraph)
- boundary (string, 60-100 words — the boundary statement prose; omit on hubs and on
  funnelStage 'cross')
- faq (array of { question, answer }, 4-6 entries; omit on hubs)
- crossLinks (array of exactly 3 route paths, validated against lib/nav.ts; omit on hubs)
- cta ({ heading, body })

Validation: fail the build if a 'service' page with funnelStage other than 'cross' is
missing boundary or counterpartSlugs, if faq has fewer than 4 or more than 6 entries, or if
crossLinks is not exactly 3 resolvable paths.

## 2. Amend BoundaryStatement

Change its throw condition to fire only when funnelStage !== 'cross'. Pages with
funnelStage 'cross' render no BoundaryStatement.

## 3. Amend scripts/content-check.ts

The 1,100-word floor must count prose in the frontmatter fields — boundary, lead, faq
answers, cta body — as well as the MDX body, since all of it is words on the page. Update
the counter and note the change in the script header.

## 4. app/(marketing)/services/[slug]/page.tsx

One dynamic route serving both hubs and service pages. generateStaticParams from the MDX
files. Set dynamicParams false — an unknown slug is a 404, not a runtime render.

generateMetadata via buildMetadata using frontmatter title, description, and the route path.

Branch on pageType:
- 'hub': PageHero, the MDX body, StageGrid for that funnelStage, CTABand
- 'service': the ten-section anatomy from SEO plan section 4, in this fixed order:
  1. Breadcrumbs
  2. PageHero from heroKicker, title, lead
  3. BoundaryStatement from frontmatter.boundary, unless funnelStage is 'cross'
  4-8. The MDX body, wrapped in Prose — this carries the problem, how the work differs,
       how it is measured, what we need from you, and who this is for
  9. FAQ from frontmatter.faq
  10. CrossLinks from frontmatter.crossLinks, then CTABand from frontmatter.cta

Pages do not choose their own order. The template owns it, so all 23 stay identical.

Make available to MDX: DefinitionList, MetricTable, QuoteBlock, AttributionChain, and a
link component that resolves through nav.ts. Nothing else — MDX must not be able to
introduce new layout.

JSON-LD: Service, FAQPage built from frontmatter.faq, and BreadcrumbList, all rendered by
the template rather than authored per page.

## 5. content/services/marketing-attribution.mdx

pageType 'service', funnelStage 'cross', no boundary, no counterpartSlugs.

Spec from section 5 of the SEO plan: title, description, and H1 exactly as given. 1,600-2,000
words. 6 FAQ entries.

Structure the body:

- Open with why platform-reported conversions mislead. Then render <AttributionChain /> —
  the same component from the home page, no second treatment — and explain what happens at
  the break.
- "What we build" as a DefinitionList with 6 rows: tracking architecture, call scoring,
  offline conversion import, identity matching, location-level reporting, decision log.
  Each definition is specific about mechanism, not benefit.
- "How it is measured" — the conversion definition, and what attribution can and cannot
  establish.
- "Where matching is probabilistic" — this section is the reason the page is credible.
  Explain honestly where deterministic matching fails, what we do instead, and how we
  document the accuracy of a probabilistic match rather than presenting an estimate as a
  measurement. Do not hedge this into vagueness.
- "What we need from you" — administrative access to ad accounts, call tracking, and
  analytics; read access or scheduled export from the system recording booked outcomes; one
  person who can answer how intake actually works rather than how it is supposed to.
- "Who this is for" — two or three sentences, linking to one industry page.

The 6 FAQ entries answer a skeptical CMO: what if our EMR has no API; how long until the
data is trustworthy; do you replace our current agency; what happens to historical data;
how is this different from GA4 attribution; who owns the tracking setup if we leave.

Write against the voice rules. No banned words, no unsourced numbers. Be specific about
mechanism throughout — this page's job is to be the most complete explanation of
attribution the reader finds while evaluating vendors.

Internal links: all three stage hubs, /how-it-works, one industry page, /proof. Anchor text
from each destination's anchorVariants in nav.ts.

## 6. Verification

Build, typecheck, lint clean. Report the word count including frontmatter prose. Confirm the
emitted FAQPage JSON-LD matches the six rendered questions. Confirm exactly one h1 and
sequential headings. Confirm dynamicParams false produces a 404 for an unknown slug. List
every internal link the page emits.

Commit: feat: attribution pillar and service page template
```

---

## What to check before accepting

- [ ] The template owns section order — the MDX file cannot reorder the anatomy
- [ ] `dynamicParams` is false; `/services/not-a-real-page` returns 404
- [ ] Only the five approved components are available inside MDX
- [ ] `AttributionChain` is imported, not reimplemented — grep for `--color-signal` and
      confirm it still appears in exactly one file
- [ ] `BoundaryStatement` does not render on the pillar, and still throws for a normal
      service page missing its boundary. Test both
- [ ] FAQ JSON-LD questions match the rendered ones exactly, count and text
- [ ] Word count clears 1,600 without padding. If it lands at 1,450 of real substance,
      tell me before adding words
- [ ] The probabilistic-matching section is specific and unhedged — read it yourself
- [ ] Lighthouse on the preview: performance ≥90, accessibility 100, SEO 100

---

## Where this one goes wrong

**The template gets flexible.** Optional sections, an `order` field in frontmatter, a
`sections` array the MDX controls. Every one of those is reasonable in isolation and each
makes the 23 pages diverge. The rigidity is the feature — it is what keeps them consistent
when they are written weeks apart.

**The probabilistic-matching section gets softened.** It is the most credible thing on the
site, because every competitor claims certainty they do not have. The reflex will be to
make it reassuring. Reassuring is what everyone else writes. Specific is what wins the
evaluation.

**Benefit language in the DefinitionList.** "Tracking architecture — gives you confidence
in your data" is worthless. "Tracking architecture — a single event taxonomy across GA4,
GTM, and the ad platforms, so a conversion means the same thing in every system" is the
standard. Check all six rows.

**The FAQ answers get short.** Four-sentence answers to real objections, not one-liners. A
CMO reading the EMR-with-no-API answer needs to know what actually happens next.

**Padding to 1,600.** Same trap as the home page. If the page is honestly 1,450 words of
substance, tell me and we reconsider the floor — do not pad. The floor exists to prevent
thin pages, not to license filler.

---

## Next

Prompt 3.x, Wave 1 — six service pages run one at a time: `paid-search-ppc`, `seo`,
`conversion-rate-optimization`, `paid-social-advertising`,
`generative-engine-optimization`, `marketing-operations`. The repeatable prompt is in
`docs/build-prompts.md`. Before the second one, read the first and confirm the template
did not have to bend to accommodate it.
