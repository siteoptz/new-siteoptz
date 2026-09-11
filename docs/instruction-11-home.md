# Instruction 1.1 — the home page

First real content on the site, and the first page a prospect sees. It introduces
`AttributionChain`, the only component that carries the argument rather than the layout.

---

## Before you paste

1. **Connect Vercel.** Production branch `main`, preview branch `staging`. Push and
   confirm the preview builds and that `/robots.txt` on it disallows everything. Do not
   point DNS.
2. Decide whether the social profiles on siteoptz.ai — X, LinkedIn, Instagram, YouTube,
   Discord — are the ones this site should claim in its Organization schema, or whether
   `sameAs` stays empty for now. Claude will ask otherwise.
3. Note a gap you now own: the home page is `.tsx`, so `scripts/content-check.ts` does not
   scan it. Banned words and unsourced numbers here are caught by you, not the build.
   After the commit, run:
   ```
   grep -rniE 'fortune 500|proven|seamless|unlock|transform|game-changing|leverage|best-in-class|end-to-end|cutting-edge|world-class|synergy|empower' app/
   ```

---

## The prompt — paste this exactly

```
Build the home page at app/(marketing)/page.tsx per route 1 in docs/sitemap-seo-plan.md.
Use existing blocks for everything except AttributionChain, which is new.

Write all copy yourself against the voice rules in CLAUDE.md section 4. Plain, declarative,
specific. No banned words. No numbers that are not traceable — where a figure would go, use
a marked placeholder. 800-1,000 words total.

## Root layout additions, if not already present

Add Organization and WebSite JSON-LD to the root layout using lib/schema.ts. Organization
carries the name, url, logo, contact email info@siteoptz.com, and sameAs. Ask me for the
sameAs URLs before writing them — do not invent social profiles.

## AttributionChain — components/blocks/AttributionChain.tsx

The one element on this site that has to be memorable. It is not decoration; it is the
argument.

A vertical sequence of six steps, rendered as an ordered list with list-style none:

1. Budget committed — Google Ads, Meta, LSA, print, direct mail
2. Click or impression — platform-reported, ungrounded in revenue
3. Call, form, or chat — call tracking, form capture, session stitching
4. Qualified inquiry — call scored, spam and vendor calls removed
5. Booked appointment or signed agreement — CRM, EMR, or PMS record matched back to source
6. Revenue recorded — cost per booked outcome, by channel and location

Each step: a small dot marker, the step name at var(--text-md), and its source line beneath
at var(--text-2xs) in a dimmed blue-grey. A 1.5px connecting line runs between dots.

Between steps 3 and 4, a break marker: a 2px left border in --color-signal with a faint
tint behind it, reading that most agency reporting stops above this line and that everything
below it is where the money is decided. This is the only use of --color-signal anywhere on
the site — add a comment saying so.

Pure HTML and CSS. No SVG library, no illustration, no canvas, no animation, no scroll
effects. It sits inside a navy-800 panel with a 1px border. It must remain legible and
correctly ordered at 360px, where it becomes the full width of the column.

The break text is content, not decoration — it must be real text, readable by a screen
reader in sequence.

## Page sections, in order

1. Hero on navy-900, two columns. Left: h1 "Know which marketing spend produced revenue."
   plus a lead paragraph and two buttons — primary to /contact, ghost to
   /services/marketing-attribution. Right: AttributionChain. Single column below 900px with
   the chain below the text.

2. The problem, stated plainly. Section on paper. SectionHead plus three paragraphs in
   Prose. Cover: the three systems that never talk to each other (ad platforms, call and
   form capture, the system where a booked outcome is recorded); what goes wrong as a
   result — budget stays in channels producing volume not customers, channels producing
   fewer better inquiries look expensive and get cut, decisions get made on last week's
   loudest anecdote; and that we fix measurement first because every later decision depends
   on it.

3. What we do. Section on paper-2. RuleList with exactly three rows — the three funnel
   stages, each with its program count read from servicesByStage(), a one-sentence
   description, and a link to its hub. Not 23 links. Beneath the RuleList and visually
   distinct from it, the attribution pillar presented as the thing that measures all three
   stages rather than a fourth item. Make that relationship structural.

4. How an engagement runs. Section on navy. StageSequence with the four stages: measurement
   audit (weeks 1-2), build the layer (weeks 3-6), run the programs (week 7 onward),
   standing review (ongoing). Link to /how-it-works.

5. Who this is built for. Section on paper. Four audiences — multi-location healthcare,
   self-storage portfolios, professional services, agency partners — each two or three
   sentences, two linking to their industry pages.

6. What you receive. Section on paper-2, two columns. Left: a hairline list of deliverables
   — attribution map, monthly performance report, call review record, location scorecards,
   decision log — each with a one-line description. Right: MetricTable with
   source='placeholder', columns for channel, spend, qualified inquiries, booked, cost per
   booked, and five channel rows.

7. QuoteBlock on paper with clearly marked placeholder attribution.

8. CTABand: start with the measurement audit. Two weeks, fixed scope, useful whether or not
   we work together after.

## SEO

buildMetadata with the title, description, and H1 from route 1 of the SEO plan exactly.
Internal links required: all three stage hubs, the attribution pillar, /how-it-works, two
industry pages, /proof. No Breadcrumbs on home.

## Verification

Build, typecheck, lint clean. Confirm exactly one h1. Confirm heading levels are sequential
with no skips. Confirm AttributionChain reads in correct order in the DOM. Report the word
count.

Commit: feat: home page
```

---

## What to check before accepting

- [ ] Banned-word grep above returns nothing
- [ ] No number anywhere that is not a marked placeholder
- [ ] `--color-signal` appears exactly once in the codebase
- [ ] AttributionChain has no animation, no SVG, no illustration
- [ ] The break text reads as real content in the DOM, not a `::before`
- [ ] Section 3 shows three stages, not 23 services, with counts from `servicesByStage()`
- [ ] Exactly one `h1`, headings sequential
- [ ] All eight required internal links present and resolving to real routes in `nav.ts`
- [ ] Lighthouse on the preview: performance ≥90, accessibility 100, SEO 100
- [ ] At 360px: the chain is legible, the hero stacks, nothing overflows horizontally

---

## Where this one goes wrong

**AttributionChain becomes an illustration.** The pull is toward SVG, connectors, icons,
gradient fills, or a scroll-triggered reveal. All of it is banned and all of it would make
the page read as generated. It is a list with dots and a rule. Its power is that it says
something true, not that it looks clever.

**The break marker gets softened.** It is the sharpest claim on the page — that most agency
reporting stops before the part that matters. If the copy comes back hedged into
inoffensiveness, put the edge back. A prospect comparing three vendors needs one reason to
remember you.

**Section 3 lists everything.** Twenty-three links on the home page is a sitemap, not a
page. Three stages and the pillar.

**Placeholder numbers become real ones.** Watch for "typically", "most clients", or a
tidy-looking figure appearing in the deliverables copy. If a number is not from a named
account, it does not ship.

**Copy drifts into agency voice.** Read section 2 aloud. If it sounds like a company
describing itself rather than a description of the reader's situation, rewrite it. This
page sets the register for the 23 service pages that follow.

---

## Next

Prompt 2.1 — the attribution pillar and the service page template. It is the longest single
page on the site at 1,600-2,000 words, and the template it establishes gets used 22 more
times, so it is worth building slowly.
