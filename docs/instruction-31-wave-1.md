# Instruction 3.1 — Wave 1: six service pages

Six pages, run one at a time, each its own commit and preview. This is the first time the
template gets exercised by content it was not designed around, and the first time sameness
becomes a real risk.

Assumes 2.1 landed. If it did not, stop and run that first.

---

## Correction: the boundary rule is wrong as written

0.5 said every service page has a boundary and BoundaryStatement throws when
`counterpartsOf()` is empty. 2.1 patched that with an exemption for `funnelStage: 'cross'`.
Both are wrong, and Wave 1 exposes it.

The boundary table in SEO plan section 3 has 14 entries. There are 22 service pages besides
the pillar. So **eight service pages legitimately have no counterpart** —
`campaign-launch-strategy`, `programmatic-advertising`, `influencer-marketing`,
`affiliate-marketing`, `email-marketing`, `partnerships`, `marketing-operations`, and
`conversion-rate-optimization`. Two of those are in this wave.

Replace both rules with one that is data-driven:

> `BoundaryStatement` renders only when `counterpartsOf(slug)` returns entries. The Zod
> schema requires `boundary` and `counterpartSlugs` **if and only if** the slug appears in
> the boundary table. The `'cross'` exemption becomes unnecessary and should be removed.

Add this as a small commit before the first page:

`fix: make boundary statement requirement data-driven`

That is the third spec collision in three phases, all the same shape — a rule stated as
universal that was only ever true of a subset. The data-driven form prevents the remaining
ones.

---

## Wave 1, in order

Run these one at a time. Do not batch.

1. `paid-search-ppc`
2. `seo`
3. `conversion-rate-optimization`
4. `paid-social-advertising`
5. `generative-engine-optimization`
6. `marketing-operations`

---

## The prompt — paste once per page, substituting the slug and the page notes

```
Build content/services/<SLUG>.mdx using the existing service template. Do not modify the
template. If this page seems to need a structural change, stop and tell me — that is a
decision about all 23 pages, not this one.

Follow its spec in section 5 of docs/sitemap-seo-plan.md exactly: primary and secondary
keywords, title, meta description, H1, funnelStage, FAQ count, word count, and any deltas
listed. Use the anatomy in section 4.

Write section 5 of the anatomy first — how this channel reports into the attribution layer,
what its conversion definition is, and what it cannot claim credit for. That section is what
makes this page ours rather than generic. Write everything else to be consistent with it.

<PASTE THE PAGE NOTES BLOCK HERE>

Before writing, read every service page already in content/services. Vary sentence rhythm,
opening structure, and example choice from all of them. Do not reuse a sentence. Do not
describe this channel with a verb already used for another channel. Do not open two pages
the same way.

Voice rules from CLAUDE.md section 4. No banned words. No number that is not traceable to a
named account — use a marked placeholder instead.

Every internal link required by the linking map in section 6: the pillar, its stage hub, two
siblings, its counterpart if it has one, one industry page, one proof entry. Anchor text
from each destination's anchorVariants.

Verify: build, typecheck, lint clean. Report word count including frontmatter prose. Confirm
FAQ JSON-LD matches rendered questions. List every internal link emitted.

Commit: content: <SLUG> service page
```

---

## Page notes — paste the matching block into the prompt

### 1. paid-search-ppc

> Boundary: non-brand acquisition only. Brand terms are a different page with different
> economics.
> The measurement problem here: last-click over-credits brand campaigns, platform
> conversion counts include unqualified and duplicate calls, and Local Services Ads reports
> in its own currency that reconciles with nothing. Budget allocation is per location, not
> per campaign, because capacity differs by site.
> Cross-links: branded-search-ppc, conversion-rate-optimization, seo.
> FAQ angles: what happens to calls that were never qualified; can LSA and Google Ads run
> together without double counting; do you bid on competitor terms; how quickly can budget
> move between locations; who owns the account if we leave.

### 2. seo

> Boundary: non-brand organic acquisition and technical work. Branded and local capture is
> organic-capture; AI assistant visibility is GEO. Two counterparts.
> The measurement problem here: organic cannot be switched off for a holdout, so
> incrementality is inferred rather than tested, and a single national rank number tells a
> multi-location operator nothing. Grid scanning per location is what replaces it.
> Be honest about timelines — profile and technical work moves in weeks, authority work
> does not.
> Cross-links: organic-capture, generative-engine-optimization, content-marketing.
> FAQ angles: how long before anything moves; do you guarantee rankings; what happens to our
> duplicate location pages; who writes the content; what happens if we stop.

### 3. conversion-rate-optimization

> No counterpart — no BoundaryStatement on this page.
> The measurement problem here: most multi-location operators do not have the traffic volume
> to reach significance on the tests they are sold, and the largest conversion losses happen
> after the form is submitted — in intake, routing, and callback time — where no testing tool
> looks. Sample size discipline and post-form intake are both required rows in the
> DefinitionList.
> Cross-links: paid-search-ppc, marketing-operations, paid-social-advertising.
> FAQ angles: do we have enough traffic to test; how long does one test run; what happens
> when a test is inconclusive; do you change our site or hand us specifications.

### 4. paid-social-advertising

> Boundary: prospecting to people who do not know you. Re-engagement is retargeting.
> The measurement problem here: view-through attribution. The platform counts an impression
> nobody noticed as a conversion it caused, which is why its reported numbers exceed ours.
> Say that plainly and explain what we do instead — geo holdouts and matched-market tests.
> Creative volume is a dependency, not a nice-to-have.
> Cross-links: retargeting, creative-ads-strategy, programmatic-advertising.
> FAQ angles: why does Meta report more conversions than your report; what spend is needed
> for a holdout test; how many creatives per month; which platforms for a clinic group
> versus a storage portfolio.

### 5. generative-engine-optimization

> Boundary: visibility inside AI assistant answers. Snippets and People Also Ask are AEO;
> conventional organic is SEO. Two counterparts.
> Deltas from the spec: 6 FAQ entries, 1,400-1,700 words, and the "what this is not" section
> stating outright that no one can guarantee a model recommends you. Keep that section
> sharp. It is the strongest trust signal on the site and the easiest thing to soften into
> nothing.
> The measurement problem here: there is no rank position, only an answer that varies by
> phrasing, location, and model. A baseline is a fixed question set run repeatedly and
> recorded.
> Cross-links: answer-engine-optimization, seo, content-marketing.
> FAQ angles: can you guarantee we get recommended; how often do answers change; does this
> replace SEO; which assistants do you monitor; what if the model says something wrong about
> us; how is traffic from assistants tracked.

### 6. marketing-operations

> No counterpart — no BoundaryStatement.
> Delta from the spec: link to the pillar twice. This page and attribution are the closest
> pair on the site.
> The measurement problem here: this page is the precondition for every other page. Lead
> routing, deduplication, field mapping, and stack consolidation determine whether any of the
> other 22 programs can be measured at all. Frame it as plumbing, without apology.
> Cross-links: marketing-attribution, conversion-rate-optimization, email-marketing.
> FAQ angles: can you work inside our existing stack or do we have to replace it; what
> happens to historical data during a migration; who maintains this after handover; how do
> you handle duplicate leads across locations.

---

## After page two: build the duplication check

The audit at 6.3 has a duplicate-phrase check. Waiting until then means finding the
sameness after 23 pages are written. Move it forward — one small commit after the second
page exists:

```
Add scripts/dup-check.ts. For every pair of files in content/services, report the longest
shared phrase over eight words, with both file names and the phrase. Add an npm script
"dup" that runs it. Do not wire it into the build — it is a review tool, not a gate.
```

Run `npm run dup` after every page from then on. Anything over twelve words gets rewritten
before the commit, not at the audit.

---

## What to check on every page

- [ ] `npm run dup` reports nothing over twelve words
- [ ] Section 5 of the anatomy is genuinely specific to this channel — not the previous
      page's paragraph with a noun swapped
- [ ] The boundary statement names its counterpart and says something real about the split
- [ ] FAQ answers are four sentences, not one
- [ ] No banned words, no unsourced numbers
- [ ] Word count clears the floor **without padding**. Short and substantive beats long and
      filled. If it lands at 1,000, tell me
- [ ] Six internal links minimum, all resolving in `nav.ts`
- [ ] Lighthouse on the preview: performance ≥90, accessibility 100, SEO 100

---

## Expect this, and do not let Claude fix it

The boundary link on `paid-search-ppc` points at `branded-search-ppc`, which is Wave 2 and
does not exist yet. It will 404 in preview. That is correct — `nav.ts` is the full route
table, and `sitemap.ts` already filters to content-backed routes, so nothing broken reaches
search engines. Do not let it trim the boundary, remove the link, or "temporarily" point
elsewhere.

---

## Next

Wave 1 ends with three stage hubs unbuilt — hubs come after their children are populated,
so `top-of-funnel` and `bottom-of-funnel` wait for Waves 2 and 3. After page six, the
honest checkpoint is whether pages one through six read as six distinct pages or one page
written six times. That question is easier to answer now than after Wave 3.
