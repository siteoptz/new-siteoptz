# SiteOptz.com — sitemap, keyword map, and page specs (v2)

Supersedes v1. 40 routes: 23 service pages, 3 funnel hubs, 1 services hub, 4 industry
pages plus hub, and the supporting layer.

**Before building:** validate every primary keyword below against your own volume and
difficulty data. These are chosen for commercial intent, buyer vocabulary, and
non-overlap — not from a volume export. Where a term is dead, swap it and update this
file in the same commit as the page.

---

## 1. URL architecture

Services live at `/services/<slug>` — flat, one level, keyword-clean. Funnel stages are
hubs at `/services/top-of-funnel` and so on, not URL segments.

Do not nest as `/services/top-of-funnel/paid-social`. Nesting buries every page a level
deeper, makes the URL carry a word nobody searches, and locks each page into a stage it
may need to move out of. The funnel is how the site is _navigated_ and how internal links
cluster; it is not how the URLs are built.

This replaces `/what-we-do` from v1. `/services` is the term buyers and search both use.
Change it now — it is a rename today and a redirect map later.

---

## 2. The funnel architecture, and why it works here

Three stage hubs, 21 service pages, one cross-funnel pillar.

`/services/marketing-attribution` is the pillar and sits outside the funnel, because it
is the thing that measures all three stages. Every service page links up to it. This is
the whole argument of the site expressed as site structure: other agencies sell you a
stage, we measure across all of them.

Each stage hub does three jobs: ranks for its own stage term, distributes link equity to
its children, and gives the mega menu a navigable shape.

---

## 3. Cannibalization boundaries — mandatory

Each page below must state its boundary in the first 150 words, in plain language, and
link to its counterpart. This is not optional copy — it is what keeps both pages
rankable.

| Page                  | Boundary it must state                                 | Counterpart           |
| --------------------- | ------------------------------------------------------ | --------------------- |
| Paid Search (PPC)     | Covers non-brand acquisition only                      | Branded Search (PPC)  |
| Branded Search (PPC)  | Covers defending and converting existing demand        | Paid Search (PPC)     |
| Paid Social           | Prospecting to people who do not know you              | Retargeting           |
| Retargeting           | Re-engaging people who already interacted              | Paid Social           |
| Social Media          | Organic presence and community, no paid spend          | Paid Social           |
| SEO                   | Non-brand organic acquisition and technical work       | Organic Capture, GEO  |
| GEO                   | Visibility inside AI assistant answers                 | AEO, SEO              |
| AEO                   | Featured snippets, People Also Ask, voice results      | GEO, SEO              |
| Organic Capture       | Branded and local capture: profiles, reviews, map pack | SEO                   |
| Creative Ads Strategy | Concepting and testing hypotheses for paid campaigns   | Creative Production   |
| Creative Production   | Producing the assets, at volume, to spec               | Creative Ads Strategy |
| Content Marketing     | Owned editorial and demand education                   | SEO                   |
| Partnerships          | Bilateral referral and co-marketing relationships      | Affiliate Marketing   |
| Affiliate Marketing   | A commission program paid on tracked performance       | Partnerships          |

---

## 4. Standard service page anatomy

Every one of the 21 pages uses this structure. Deltas are noted per page in section 5.
Do not invent new sections. If a page needs one, add it here first so all 23 stay
consistent.

1. **PageHero** — kicker (funnel stage), h1, lead paragraph, primary CTA
2. **Boundary statement** — 60–100 words, what this page covers and what it does not,
   linking to the counterpart page from the table above
3. **The problem** — 150–250 words on what goes wrong in this channel when it is measured
   badly. Written in operator vocabulary, not marketing vocabulary
4. **How the work differs** — DefinitionList, 5–7 rows, specific about method
5. **How it is measured** — how this channel reports into the attribution layer, what its
   conversion definition is, and what it cannot claim credit for. Links to the pillar
6. **What we need from you** — access, systems, and the one person on their side
7. **Who this is for** — 2–3 sentences naming the client profile, linking to one industry page
8. **FAQ** — 4–6 questions answering real objections, paired with FAQPage schema
9. **CrossLinks** — three sibling services, chosen for how they actually combine
10. **CTABand**

**Schema on every service page:** Service, FAQPage, BreadcrumbList.
**Word count floor:** 1,100. Ceiling 1,600, except the pillar.
**Internal links out:** the pillar, its stage hub, two siblings, one industry page, one
proof entry. Six minimum.

---

## 5. Page specs

Format per page: URL · primary keyword · secondary · title (chars) · meta (chars) · H1 ·
deltas from the standard anatomy.

### Pillar

**`/services/marketing-attribution`** — cross-funnel

- Primary: marketing attribution consulting
- Secondary: closed-loop attribution, offline conversion tracking, CRM attribution, multi-touch attribution services
- Title (59): `Marketing Attribution Consulting for Operators | SiteOptz`
- Meta (152): `Attribution built to your revenue system, not the ad platform's. Call scoring, CRM and EMR matching, and cost per booked outcome by channel and location.`
- H1: Marketing attribution consulting, built to the system where your revenue is recorded.
- Deltas: replace section 2 with the six-step chain and the marked break. Add a section on
  how accuracy is documented where matching is probabilistic. 6 FAQ entries. 1,600–2,000
  words. Links to all three stage hubs.

---

### Top of funnel — 9 pages

**`/services/top-of-funnel`** (hub)

- Primary: top of funnel marketing services
- Title (52): `Top of Funnel Marketing Services | SiteOptz`
- Meta (147): `Nine programs for reaching people who do not know you yet — and the measurement that shows which of them produced a customer, not just a click.`
- H1: Top of funnel marketing services, reaching people who do not know you yet.
- 700–900 words. Lists all nine children with 60-word summaries pulled from frontmatter.

**`/services/paid-social-advertising`**

- Primary: paid social advertising agency
- Secondary: enterprise paid social management, Meta ads management, prospecting campaigns
- Title (48): `Paid Social Advertising Agency | SiteOptz`
- Meta (149): `Prospecting campaigns on Meta, LinkedIn, and TikTok measured to booked outcomes, with creative testing that produces answers rather than opinions.`
- H1: Paid social advertising agency, measured past the platform's own report.
- Delta: section 5 must address view-through attribution directly.

**`/services/paid-search-ppc`**

- Primary: enterprise PPC management
- Secondary: non-brand paid search management, Google Ads management, Local Services Ads
- Title (46): `Enterprise PPC Management | SiteOptz`
- Meta (151): `Non-brand Google Ads and LSA managed against cost per booked outcome, with call scoring, search term hygiene, and budget set location by location.`
- H1: Enterprise PPC management, judged on booked outcomes.

**`/services/creative-ads-strategy`**

- Primary: ad creative strategy services
- Secondary: creative testing framework, ad concept development
- Title (44): `Ad Creative Strategy Services | SiteOptz`
- Meta (144): `Creative built as a set of testable hypotheses, with a testing structure that tells you which idea worked and why, not which ad spent the most.`
- H1: Ad creative strategy services, built as a testable hypothesis.

**`/services/campaign-launch-strategy`**

- Primary: marketing campaign launch strategy
- Secondary: go to market campaign planning, new market launch marketing
- Title (45): `Marketing Campaign Launch Strategy | SiteOptz`
- Meta (146): `Launch plans with measurement built in from day one — so the first ninety days produce a decision, not a report full of channel-level guesses.`
- H1: Marketing campaign launch strategy, built to produce a decision.
- Delta: replace section 6 with a launch timeline showing what happens in weeks 1–12.

**`/services/seo`**

- Primary: multi-location SEO services
- Secondary: enterprise SEO agency, technical SEO consulting, non-brand organic growth
- Title (49): `Multi-Location SEO Services | SiteOptz`
- Meta (150): `Non-brand organic acquisition measured per location on a scan grid, so you see the radius each site actually covers instead of one national rank.`
- H1: Multi-location SEO services, measured per location.

**`/services/generative-engine-optimization`**

- Primary: generative engine optimization services
- Secondary: GEO agency, AI search visibility, ChatGPT recommendation optimization
- Title (56): `Generative Engine Optimization Services | SiteOptz`
- Meta (153): `We measure how often AI assistants recommend you, what they say, and which sources they cite — then work on the sources. Baseline scan available.`
- H1: Generative engine optimization services, measuring what the assistant says about you.
- Delta: add a "what this is not" section stating outright that no one can guarantee a
  model recommends you. Keep it. It is the strongest trust signal on the site. 6 FAQ
  entries, 1,400–1,700 words.

**`/services/answer-engine-optimization`**

- Primary: answer engine optimization services
- Secondary: featured snippet optimization, People Also Ask optimization, voice search
- Title (52): `Answer Engine Optimization Services | SiteOptz`
- Meta (145): `Structuring content so search engines can lift a direct answer from it — snippets, People Also Ask, and voice results, measured as a channel.`
- H1: Answer engine optimization services, aimed at being the answer shown.

**`/services/programmatic-advertising`**

- Primary: programmatic advertising agency
- Secondary: DSP management, connected TV advertising, display retargeting
- Title (47): `Programmatic Advertising Agency | SiteOptz`
- Meta (150): `Display, CTV, and audio bought programmatically with inventory transparency and a conversion definition that survives a view-through window.`
- H1: Programmatic advertising agency, with the view-through window closed.
- Delta: section 5 must cover fraud, viewability, and why we discount view-through.

**`/services/influencer-marketing`**

- Primary: influencer marketing agency
- Secondary: creator partnerships, influencer attribution, UGC campaigns
- Title (44): `Influencer Marketing Agency | SiteOptz`
- Meta (148): `Creator partnerships with tracked attribution — codes, links, and matched-market tests instead of screenshots of impressions from a media kit.`
- H1: Influencer marketing agency, for partnerships you can actually attribute.

---

### Middle of funnel — 5 pages

**`/services/middle-of-funnel`** (hub)

- Primary: middle of funnel marketing services
- Title (55): `Middle of Funnel Marketing Services | SiteOptz`
- Meta (143): `Four programs for people who know you and have not decided yet — and the measurement that shows what actually moved them forward.`
- H1: Middle of funnel marketing services, where most measurement gives up.
- 600–800 words.

**`/services/social-media`**

- Primary: organic social media management agency
- Secondary: B2B social media management, community management
- Title (49): `Organic Social Media Management Agency | SiteOptz`
- Meta (141): `Owned social presence and community, run separately from paid, with reporting that does not take credit for what the ads produced.`
- H1: Organic social media management agency, reported honestly against paid.

**`/services/content-marketing`**

- Primary: B2B content marketing agency
- Secondary: demand education content, content strategy consulting, editorial operations
- Title (45): `B2B Content Marketing Agency | SiteOptz`
- Meta (147): `Editorial built for buyers in the middle of a decision, with assisted-conversion reporting that shows which pieces appeared in closed deals.`
- H1: B2B content marketing agency, measured by the deals it appeared in.

**`/services/affiliate-marketing`**

- Primary: affiliate marketing management agency
- Secondary: affiliate program management, partner network management
- Title (48): `Affiliate Marketing Management Agency | SiteOptz`
- Meta (150): `Program management with last-click inflation removed — we identify which affiliates create demand and which are intercepting it at the checkout.`
- H1: Affiliate marketing management agency, demand creation kept separate from interception.
- Delta: section 5 must cover coupon and loyalty extension interception explicitly.

**`/services/branded-search-ppc`**

- Primary: branded search PPC management
- Secondary: brand term defense, competitor conquesting defense
- Title (47): `Branded Search PPC Management | SiteOptz`
- Meta (152): `Defending your brand terms without paying for clicks you would have earned free. We measure incrementality before recommending a brand budget.`
- H1: Branded search PPC management, paying for brand terms only where incremental.
- Delta: add a section on incrementality testing method.

---

### Bottom of funnel — 8 pages

**`/services/bottom-of-funnel`** (hub)

- Primary: bottom of funnel marketing services
- Title (55): `Bottom of Funnel Marketing Services | SiteOptz`
- Meta (146): `Seven programs for converting demand that already exists — where the difference between a good and bad month is usually operational, not creative.`
- H1: Bottom of funnel marketing services, converting the demand you already have.
- 700–900 words.

**`/services/conversion-rate-optimization`**

- Primary: conversion rate optimization agency
- Secondary: CRO consulting, landing page testing, form and intake optimization
- Title (51): `Conversion Rate Optimization Agency | SiteOptz`
- Meta (148): `Testing run to statistical significance on real traffic volumes, including the intake steps after the form — where most conversions are lost.`
- H1: Conversion rate optimization agency, testing long enough to mean something.
- Delta: section 4 must include a row on sample size discipline and one on post-form intake.

**`/services/email-marketing`**

- Primary: email marketing and lifecycle agency
- Secondary: lifecycle marketing, marketing automation management, nurture programs
- Title (47): `Email Marketing and Lifecycle Agency | SiteOptz`
- Meta (145): `Lifecycle programs measured on incremental revenue, not open rates — including what the sequence would have earned had it never been sent.`
- H1: Email marketing and lifecycle agency, measured on incremental revenue.

**`/services/organic-capture`**

- Primary: Google Business Profile management
- Secondary: local SEO map pack, review management, branded organic capture
- Title (52): `Google Business Profile Management | SiteOptz`
- Meta (150): `Capturing demand at the moment of decision: business profiles, reviews, map pack position, and branded queries, managed location by location.`
- H1: Google Business Profile management, capturing demand at the moment of decision.
- Delta: state clearly this is branded and local capture, distinct from the SEO page.

**`/services/retargeting`**

- Primary: retargeting advertising services
- Secondary: remarketing campaign management, audience segmentation retargeting
- Title (45): `Retargeting Advertising Services | SiteOptz`
- Meta (151): `Re-engagement campaigns with incrementality testing built in, so you know what the retargeting produced rather than what it took credit for.`
- H1: Retargeting advertising services, with the incrementality question answered.
- Delta: section 5 must state plainly that most retargeting reports overstate.

**`/services/partnerships`**

- Primary: strategic marketing partnerships
- Secondary: co-marketing programs, referral partner programs, channel partnerships
- Title (48): `Strategic Marketing Partnerships | SiteOptz`
- Meta (142): `Referral and co-marketing programs with tracked sources, agreed attribution rules, and reporting both sides of the partnership can see.`
- H1: Strategic marketing partnerships, with the attribution agreed up front.

**`/services/creative-production`**

- Primary: creative production services
- Secondary: ad asset production, creative operations, high volume creative
- Title (44): `Creative Production Services | SiteOptz`
- Meta (143): `Producing the volume of assets modern paid media consumes, to spec, on a cadence the testing plan can actually keep pace with.`
- H1: Creative production services, at the pace testing actually requires.

**`/services/marketing-operations`**

- Primary: marketing operations consulting
- Secondary: martech stack consolidation, marketing data governance, lead routing
- Title (48): `Marketing Operations Consulting | SiteOptz`
- Meta (149): `Stack consolidation, lead routing, data governance, and the plumbing that decides whether any of the other twenty programs can be measured.`
- H1: Marketing operations consulting, the plumbing everything else depends on.
- Delta: links to the pillar twice — this page and attribution are the closest pair.

---

### Supporting pages

Full specs for every page below are in section 8.

- `/` — home. **Delta:** the services section now shows three funnel stages with counts,
  not 23 links. Primary keyword unchanged.
- `/services` — hub. **Delta:** Primary keyword `marketing intelligence services`. Shows
  the three stages plus the pillar. 700–900 words.
- `/how-it-works` — unchanged
- `/industries` + 4 industry pages — unchanged specs, but each now links to the six
  services most relevant to that vertical (mapping below)
- `/proof` + `/proof/[slug]` — unchanged
- `/point-of-view` + `/point-of-view/[slug]` — unchanged
- `/about`, `/contact`, `/privacy`, `/terms` — unchanged

**Industry to service mapping** — each industry page links to exactly these six:

| Industry              | Services                                                                                                                    |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Healthcare            | attribution, paid-search-ppc, organic-capture, seo, conversion-rate-optimization, marketing-operations                      |
| Self-storage          | attribution, paid-search-ppc, organic-capture, seo, retargeting, marketing-operations                                       |
| Professional services | attribution, content-marketing, seo, email-marketing, branded-search-ppc, marketing-operations                              |
| Agency partners       | attribution, marketing-operations, seo, generative-engine-optimization, conversion-rate-optimization, creative-ads-strategy |

---

## 6. Internal linking map (v2)

Every service page links up to the pillar and to its stage hub.

| From          | Must link to                                                                                                    |
| ------------- | --------------------------------------------------------------------------------------------------------------- |
| `/`           | three stage hubs, the pillar, `/how-it-works`, two industries, `/proof`                                         |
| `/services`   | three stage hubs, the pillar                                                                                    |
| stage hub     | all its children, the pillar, one sibling hub                                                                   |
| service page  | the pillar, its stage hub, two siblings, its counterpart from the boundary table, one industry, one proof entry |
| industry page | the pillar, its six mapped services, one proof entry, `/contact`                                                |
| proof entry   | services used, industry page, `/contact`                                                                        |
| article       | the pillar, one service, one related article                                                                    |

Anchor text comes from the destination page's H1 vocabulary. Never the same anchor to the
same destination twice on one page. Pull destinations from `lib/nav.ts` — no hardcoded
hrefs anywhere in the codebase.

---

## 7. The real risk on 21 service pages

21 pages at 1,100+ words is roughly 26,000 words of specific, non-overlapping copy. The
failure mode is not effort, it is sameness. Twenty pages that share a skeleton and swap
the channel noun read as a doorway farm to a search engine and as filler to a CMO.

Three defenses, all enforced in the build:

1. **The boundary statement** in section 3 is what makes each page's territory explicit.
2. **Section 5 of the anatomy** — how this channel reports into attribution — is different
   on every page, because the measurement problem genuinely is different per channel. This
   is the section that makes the page ours rather than generic. Write it first, not last.
3. **Ship in waves.** Nine pages with real depth beat 23 thin ones. Build the pillar, the
   three hubs, and the highest-intent services first, get them indexed, then add the rest.
   Wave order is in the build prompts.

If a page cannot clear 1,100 words without padding, it is not a page. Fold it into a
section of its stage hub and note the decision here.

---

## 8. Supporting page specs

### `/` — Home

- Primary: marketing attribution consultancy
- Secondary: marketing measurement consulting, marketing intelligence consultancy
- Title (44): `Marketing Attribution Consultancy | SiteOptz`
- Meta (149): `We build the measurement layer that connects marketing spend to booked revenue, then run the search and AI programs on top of it. See how we work.`
- H1: Know which marketing spend produced revenue.
- Schema: Organization + WebSite, in the root layout only. No page-specific type.

### `/how-it-works`

- Primary: marketing attribution audit
- Secondary: marketing measurement audit, marketing agency onboarding process
- Title (38): `Marketing Attribution Audit | SiteOptz`
- Meta (144): `Four stages: measurement audit, build the layer, run the programs, standing review. The first two are fixed scope and useful on their own.`
- H1: How a marketing attribution audit runs, stage by stage.
- Sections: page hero · each of the four stages in full, with inputs, outputs, and duration
  · what the audit deliverable contains · what we need from your team · pricing model
  explained in structure, not numbers · what happens if we are not the right fit · CTA
- Schema: HowTo, BreadcrumbList
- Words: 1,100–1,400

### `/industries`

- Primary: marketing agency by industry
- Title (39): `Marketing Agency by Industry | SiteOptz`
- Meta (153): `Ten sectors, one shared problem: the outcome that matters is recorded in a system - an EMR, a core banking system, a case file - ad platforms cannot see.`
- H1: A marketing agency by industry, where measurement is the hard part.
- Sections: page hero · what the ten share, named system by system (EMR, core banking system,
  TMS, SIS, property management system, case management system) · ten entries with 100-word
  summaries · CTA
- Schema: CollectionPage, BreadcrumbList
- Words: 700–900

### `/industries/healthcare-marketing`

- Primary: multi-location healthcare marketing agency
- Secondary: multi-location healthcare marketing, multi-site healthcare marketing, healthcare
  systems marketing attribution, patient acquisition marketing. Revised 18 Sep 2026 from the
  first week's Search Console query data rather than from pre-launch keyword research — see
  Instruction 13.
- Title (52): `Multi-Location Healthcare Marketing Agency | SiteOptz`
- Meta (152): `Patient acquisition measured to the booked consultation in your EMR, across every location, with HIPAA-aware tracking and call handling review.`
- H1: A multi-location healthcare marketing agency, measured to the booked consultation.
- Sections: page hero · what makes healthcare attribution hard — EMR isolation, HIPAA
  constraints, call-driven intake, per-location capacity · how we handle PHI and tracking ·
  which of the six mapped services apply and how they combine · what a monthly review looks
  like for a clinic group · FAQ (5) · proof links · CTA
- Schema: Service, FAQPage, BreadcrumbList
- Words: 1,300–1,600

### `/industries/self-storage-marketing`

- Primary: self storage marketing agency
- Secondary: self storage PPC, self storage marketing company, storage facility marketing,
  occupancy marketing. Revised 18 Sep 2026 from the first week's Search Console query data
  rather than from pre-launch keyword research — see Instruction 13.
- Title (39): `Self-Storage Marketing Agency | SiteOptz`
- Meta (149): `Facility-level marketing for storage portfolios: spend allocated by occupancy and rate, map pack coverage per site, reporting the whole portfolio.`
- H1: A self storage marketing agency, run facility by facility.
- Sections: page hero · why portfolio-wide averages hide everything · occupancy and rate as
  inputs to budget · map pack coverage per facility · what the portfolio report shows ·
  FAQ (4) · CTA
- Schema: Service, FAQPage, BreadcrumbList
- Words: 1,100–1,400

### `/industries/professional-services-marketing`

- Primary: professional services marketing agency
- Secondary: B2B lead attribution, long sales cycle attribution
- Title (48): `Professional Services Marketing Agency | SiteOptz`
- Meta (146): `Long consideration cycles measured properly: inquiry to signed engagement, with the lag accounted for instead of averaged away in monthly reporting.`
- H1: Professional services marketing agency, built for a nine-month sales cycle.
- Sections: page hero · why monthly reporting misleads on long cycles · cohort-based
  reporting explained · what we track between inquiry and signature · which services apply ·
  FAQ (4) · CTA
- Schema: Service, FAQPage, BreadcrumbList
- Words: 1,000–1,300

### `/industries/agency-partners`

- Primary: white label marketing attribution for agencies
- Secondary: agency partnership marketing analytics, outsourced marketing measurement
- Title (57): `White Label Marketing Attribution for Agencies | SiteOptz`
- Meta (150): `We build and run the measurement layer underneath your creative and campaign work, under your brand or ours. Fixed scope, defined escalation paths.`
- H1: White label marketing attribution for agencies, built underneath your work.
- Sections: page hero · what we take on and what stays yours · white-label vs co-branded
  terms · how reporting is delivered to your clients · commercial structure · FAQ (4) · CTA
- Schema: Service, FAQPage, BreadcrumbList
- Words: 900–1,200

### `/industries/finance-banking`

- Primary: financial services marketing agency
- Secondary: bank marketing attribution, credit union marketing, wealth management lead tracking
- Title (46): `Financial Services Marketing Agency | SiteOptz`
- Meta (136): `Marketing measured to the funded account, tracked through core banking systems and compliance review, with PII kept out of ad platforms.`
- H1: A financial services marketing agency, measured to the funded account.
- Sections: page hero · what makes bank and credit union attribution hard — closed core
  banking systems, the application-to-funded lag, branch/digital overlap, compliance review,
  PII constraints · how we handle compliance and PII · which of the six mapped services apply
  and how they combine · what a monthly review looks like · FAQ (5) · proof links · CTA
- Schema: Service, FAQPage, BreadcrumbList
- Words: 1,200–1,500

### `/industries/manufacturing`

- Primary: manufacturing marketing agency
- Secondary: industrial B2B marketing, distributor lead attribution, RFQ tracking
- Title (41): `Manufacturing Marketing Agency | SiteOptz`
- Meta (134): `RFQ and spec-request attribution for industrial B2B, built to survive a distributor channel that hides who the end buyer actually was.`
- H1: A manufacturing marketing agency, built for a channel that hides the buyer.
- Sections: page hero · what makes industrial B2B attribution hard — the distributor channel
  breaking the chain, buying-committee structure, quarter-long sales cycles, CRM hygiene ·
  how we handle distributor-channel visibility · which of the six mapped services apply and
  how they combine · what a monthly review looks like · FAQ (5) · proof links · CTA
- Schema: Service, FAQPage, BreadcrumbList
- Words: 1,100–1,400

### `/industries/transportation-logistics`

- Primary: logistics marketing agency
- Secondary: freight marketing attribution, carrier lead generation, 3PL marketing
- Title (37): `Logistics Marketing Agency | SiteOptz`
- Meta (146): `Freight and 3PL marketing measured to the booked load in your TMS, not the quote request - with lane-level reporting instead of national averages.`
- H1: A logistics marketing agency, measured to the booked load.
- Sections: page hero · what makes freight and 3PL attribution hard — quote volume as a poor
  revenue proxy, lane-level and regional demand variance, TMS export limits, carrier vs.
  shipper acquisition · how we separate real inquiries from price shopping · which of the six
  mapped services apply and how they combine · what a monthly review looks like · FAQ (4) ·
  proof links · CTA
- Schema: Service, FAQPage, BreadcrumbList
- Words: 1,100–1,400

### `/industries/energy-utilities`

- Primary: energy marketing agency
- Secondary: utility marketing attribution, solar lead generation, energy services marketing
- Title (48): `Energy Marketing Agency for Utilities | SiteOptz`
- Meta (146): `Solar and energy services marketing measured past the signature, through permitting and interconnection, with territory as a qualification filter.`
- H1: An energy marketing agency, built for a long, permit-bound sales cycle.
- Sections: page hero · what makes energy and utilities attribution hard — the signed-to-
  installed lag, service territory as a qualification filter, incentive and tariff changes,
  lead resellers · how we qualify by territory · which of the six mapped services apply and
  how they combine · what a monthly review looks like · FAQ (5) · proof links · CTA
- Schema: Service, FAQPage, BreadcrumbList
- Words: 1,200–1,500

### `/industries/education`

- Primary: education marketing agency
- Secondary: enrollment marketing attribution, higher education lead tracking, student
  recruitment marketing
- Title (37): `Education Marketing Agency | SiteOptz`
- Meta (143): `Enrollment marketing measured through inquiry, application, and acceptance to the SIS record of enrolled, with FERPA-aware tracking throughout.`
- H1: An education marketing agency, measured to actual enrollment.
- Sections: page hero · what makes enrollment attribution hard — SIS isolation, the inquiry-
  to-enrollment lag crossing a term boundary, extreme seasonality, FERPA, programme-level
  demand variance · how we handle FERPA in tracking · which of the six mapped services apply
  and how they combine · what a monthly review looks like · FAQ (5) · proof links · CTA
- Schema: Service, FAQPage, BreadcrumbList
- Words: 1,200–1,500

### `/industries/legal`

- Primary: law firm marketing agency
- Secondary: legal marketing attribution, attorney lead tracking, case intake measurement
- Title (36): `Law Firm Marketing Agency | SiteOptz`
- Meta (150): `Legal marketing measured to the signed case by practice area, with intake call review built in - since intake decides more outcomes than campaigns do.`
- H1: A law firm marketing agency, measured to the signed case.
- Sections: page hero · what makes legal attribution hard — case-value variance by orders of
  magnitude, intake as the real conversion point, bar advertising rules, referral vs.
  marketing-sourced blending · how we review intake · which of the six mapped services apply
  and how they combine · what a monthly review looks like · FAQ (5) · proof links · CTA
- Schema: Service, FAQPage, BreadcrumbList
- Words: 1,100–1,400

### `/proof` and `/proof/[slug]`

- Primary (hub): marketing attribution case studies
- Title (45): `Marketing Attribution Case Studies | SiteOptz`
- Meta (143): `Engagements described with the numbers we can evidence: what was measured, what changed, and what it cost. No composite case studies.`
- H1 (hub): Client work, with the numbers we can evidence.
- Hub sections: page hero · how figures are sourced and approved · filterable list by
  industry and service · CTA
- Detail sections: situation · what was unmeasurable · what we built · what changed
  (MetricTable, sourced) · timeline · client quote · services used (CrossLinks)
- Schema: CollectionPage on hub; Article + BreadcrumbList on detail
- Words: hub 400–600; each case 800–1,200
- Blocker: written client approval required for every named figure

### `/point-of-view` and `/point-of-view/[slug]`

- Primary (hub): marketing measurement insights
- Title (41): `Marketing Measurement Insights | SiteOptz`
- Meta (139): `Written positions on attribution, AI search, and marketing measurement — for operators deciding where to put next quarter's budget.`
- H1 (hub): Positions, argued.
- Hub structure (as of Instruction 12): intro copy above, unchanged, followed by articles
  grouped by theme rather than listed flat by date. Each article declares one theme —
  attribution, healthcare, paid-media, search-visibility, measurement-practice — and one
  section renders per theme that actually has an article, most recent first within it. A
  theme with no articles yet renders no section at all, not an empty one. Sections are
  ordered by article count descending, so the fullest cluster leads; themes tied on count
  keep attribution, measurement-practice, paid-media, search-visibility, healthcare as the
  tie-break order. CTABand below the grouped sections. At four articles this produces two
  sections (healthcare, then paid-media) — expected, not a bug to fix.
- Detail template: Source Serif 4 body, 38rem measure, sticky table of contents on desktop,
  byline, published and updated dates, related articles
- Schema: CollectionPage on hub; Article + BreadcrumbList + Person on detail
- Words: hub 300–500 (the theme grouping is structure, not additional prose); articles
  1,200–2,500
- First five articles: why platform-reported conversions overstate paid search · what a
  measurement audit actually finds · how to read a map pack scan · what GEO can and cannot
  do today · the case against blended cost per lead

### `/about`

- Primary: marketing attribution consultancy about
- Title (39): `About SiteOptz | Marketing Intelligence`
- Meta (141): `A small senior team doing analyst work for operators. Who does the work, how we are structured, and what we will not take on.`
- H1: A small team doing analyst work.
- Sections: page hero · how the firm is structured and why it stays small · who does the
  work, with real names, roles, photos · how we choose clients · what we decline · CTA
- Schema: AboutPage, Organization, BreadcrumbList
- Words: 700–1,000

### `/contact`

- Primary: marketing attribution consultation
- Title (45): `Marketing Attribution Consultation | SiteOptz`
- Meta (138): `Tell us what you are trying to measure. We reply within one business day with either a session time or a referral elsewhere.`
- H1: Book a working session.
- Sections: short intro · form · what happens after you submit, in specific steps · direct
  email and phone · office location
- Form fields: name, company, role, number of locations, monthly spend band, current stack,
  what you are trying to measure
- Schema: ContactPage, Organization, BreadcrumbList
- Words: 300–450

### `/privacy` and `/terms`

- Indexable, not noindexed — they are trust signals for enterprise buyers
- Real content covering analytics and call tracking, form data handling and retention,
  client data handling, and cookie use. No generator boilerplate
- Schema: WebPage, BreadcrumbList

---

## 9. Rejected SEMrush recommendations (September 2026 audit)

924 recommendations came back from the September 2026 SEMrush audit. 138 were backlinks,
excluded per standing instruction. Of the remaining 786, about 105 were real and worth
acting on — the primary-keyword gaps in meta descriptions, titles, and H1s fixed in the
four commits before this one. The rest were reviewed and rejected. Recorded here so none
of them gets re-litigated at the next audit.

1. **`AggregateRating` schema, 89 pages.** The site has no reviews. Marking up ratings that
   do not exist is a direct violation of Google's structured data policy — self-serving
   review markup with no genuine reviews behind it is ineligible for rich results, and
   fabricating one risks a manual action, not just a lost rich-result eligibility. Revisit
   only if genuine, verifiable client reviews exist and the markup describes them
   accurately.
2. **Word count increases, 41 pages.** Service pages run 1,100–1,600 words against a
   build-enforced floor. SEMrush is comparing against competitors who pad. Section 7 above
   already states the position directly: if a page cannot clear 1,100 words without
   padding, it is not a page. This does not change because a competitor's page is longer.
3. **Embedded video, 2 pages.** CLAUDE.md section 3 prohibits stock media, and no original
   video exists for either page. Adding placeholder or stock video to satisfy a recommendation
   rather than to serve a reader is exactly the behavior that prohibition exists to prevent.
4. **Secondary-keyword placement in H1 and title, 281 instances.** Each page targets one
   primary keyword and three or four secondaries. SEMrush flags the H1 and title for every
   keyword they do not contain. A page has one H1 and one title; satisfying every secondary
   as well would require four of each, which is invalid HTML and would destroy the heading
   hierarchy. These flags are structurally unsatisfiable — ignore them at every future audit,
   not just this one.
5. **Bounce rate and time-on-page, 8 instances.** The site had a handful of organic clicks
   in the quarter before launch. This is noise until there is enough traffic to measure
   anything real. Revisit once organic traffic is established.

**Related-terms recommendations (commit 4).** Of the roughly 115 related-terms instances
SEMrush flagged as present on competitor pages and absent from ours, about 80% were
reviewed and skipped rather than added — as inaccurate to what the page actually does, too
generic to improve any specific sentence, or in direct conflict with the page's own stated
positioning. Examples: `account based attribution` on `/industries/professional-services-marketing`
(the page describes cohort tracking, not ABM); `demand generation` on `/services/content-marketing`
(the page explicitly argues demand education, not demand generation); `time decay` across
several industry pages (misrepresents the weighting mechanism actually described); `real time`
on multiple service pages (the described cadence is monthly or scheduled, not real-time);
`click attribution` on `/industries/finance-banking` (inaccurate to the described mechanism).
A few candidate terms were flatly wrong for the business — `los angeles` on
`/services/creative-production` (the company is in The Woodlands, TX), `coca cola` on
`/services/influencer-marketing` (not a client, would be a fabricated claim), and `metal
organic framework mof` on `/services/organic-capture` (a chemistry term, a false-positive
collision with "Google Map pack"). The lesson generalizes: a related-terms tool measures
term co-occurrence on competitor pages, not whether a term is true of this business — treat
every suggestion as a hypothesis to check against the page's actual content, not an
instruction to insert.

**Healthcare analytics recommendations (Instruction 11).** From the September 2026 SEMrush
healthcare analytics keyword research, the following were deliberately excluded, totalling
roughly 630 monthly searches. Every term containing "market" — `healthcare analytics
market`, `healthcare data analytics market`, `big data analytics in healthcare market`,
`healthcare predictive analytics market`, `healthcare payer analytics market`, and the rest.
These are market-research queries: a searcher typing one wants an industry report on market
size and growth rate, not a consultancy. `healthcare payer analytics`, `clinical data
analytics`, and `healthcare operational analytics` were excluded for a different reason —
these are health IT and clinical informatics terms, and the buyer behind them is a CIO, not
a CMO. Terms reported at 0 volume and 0 difficulty were excluded because that combination
indicates insufficient data rather than an easy win.

A 0% difficulty score from SEMrush generally means the tool had too little data to calculate
one, not that the term is easy to rank for. Treat it as a data gap at every future audit, not
as an opportunity signal.

---

## Outstanding asset and infrastructure gaps

Tracked here so they do not surface at launch.

1. **Logo file.** Organization schema currently points at `/favicon.ico`. Google's
   structured data guidance expects a real raster logo. Add `/public/logo.png` at 512×512
   minimum, plus an SVG wordmark for the header if the text wordmark is ever replaced.
2. **OG images.** `opengraph-image.tsx` per route segment via `next/og` was in the Phase 0
   technical checklist but was not included in prompt 0.2, so it does not exist. Without it,
   every shared link renders a blank card. Build it as a standalone commit before Phase 4 —
   it is one file using the type tokens, and it covers all 38 routes.
3. **Favicon set.** Real favicon, apple-touch-icon, and `theme-color` matching `--color-navy-900`.
4. **Home page client quote.** The QuoteBlock previously on the home page was removed rather
   than shipped with a placeholder attribution — it had no real name, role, or organization
   behind it. Needs one approved client quote, with that client's actual name, role, and
   organization, before it returns.
5. **`/about` team roster.** The "Who does the work" section was removed rather than shipped
   with placeholder rows — the page's argument about staying small holds without a roster; it
   does not hold with an empty one. Needs real team members' names and roles, with photos
   optional, before it returns.
