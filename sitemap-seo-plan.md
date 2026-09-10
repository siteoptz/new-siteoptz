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

Three stage hubs, 23 service pages, one cross-funnel pillar.

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
| Amazon Non-Brand      | Category and competitor targeting on Amazon            | Amazon Branded        |
| Amazon Branded        | Defending your own listings and brand terms            | Amazon Non-Brand      |
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

---

## 4. Standard service page anatomy

Every one of the 23 pages uses this structure. Deltas are noted per page in section 5.
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
- H1: Attribution built to the system where your revenue is recorded.
- Deltas: replace section 2 with the six-step chain and the marked break. Add a section on
  how accuracy is documented where matching is probabilistic. 6 FAQ entries. 1,600–2,000
  words. Links to all three stage hubs.

---

### Top of funnel — 10 pages

**`/services/top-of-funnel`** (hub)

- Primary: top of funnel marketing services
- Title (52): `Top of Funnel Marketing Services | SiteOptz`
- Meta (147): `Ten programs for reaching people who do not know you yet — and the measurement that shows which of them produced a customer, not just a click.`
- H1: Reaching people who do not know you yet.
- 700–900 words. Lists all ten children with 60-word summaries pulled from frontmatter.

**`/services/paid-social-advertising`**

- Primary: paid social advertising agency
- Secondary: enterprise paid social management, Meta ads management, prospecting campaigns
- Title (48): `Paid Social Advertising Agency | SiteOptz`
- Meta (149): `Prospecting campaigns on Meta, LinkedIn, and TikTok measured to booked outcomes, with creative testing that produces answers rather than opinions.`
- H1: Paid social measured past the platform's own report.
- Delta: section 5 must address view-through attribution directly.

**`/services/paid-search-ppc`**

- Primary: enterprise PPC management
- Secondary: non-brand paid search management, Google Ads management, Local Services Ads
- Title (46): `Enterprise PPC Management | SiteOptz`
- Meta (151): `Non-brand Google Ads and LSA managed against cost per booked outcome, with call scoring, search term hygiene, and budget set location by location.`
- H1: Non-brand paid search judged on booked outcomes.

**`/services/creative-ads-strategy`**

- Primary: ad creative strategy services
- Secondary: creative testing framework, ad concept development
- Title (44): `Ad Creative Strategy Services | SiteOptz`
- Meta (144): `Creative built as a set of testable hypotheses, with a testing structure that tells you which idea worked and why, not which ad spent the most.`
- H1: Creative as a testable hypothesis.

**`/services/campaign-launch-strategy`**

- Primary: marketing campaign launch strategy
- Secondary: go to market campaign planning, new market launch marketing
- Title (49): `Campaign Launch Strategy | SiteOptz`
- Meta (146): `Launch plans with measurement built in from day one — so the first ninety days produce a decision, not a report full of channel-level guesses.`
- H1: Launches that produce a decision, not a report.
- Delta: replace section 6 with a launch timeline showing what happens in weeks 1–12.

**`/services/seo`**

- Primary: multi-location SEO services
- Secondary: enterprise SEO agency, technical SEO consulting, non-brand organic growth
- Title (49): `Multi-Location SEO Services | SiteOptz`
- Meta (150): `Non-brand organic acquisition measured per location on a scan grid, so you see the radius each site actually covers instead of one national rank.`
- H1: Organic visibility measured per location.

**`/services/generative-engine-optimization`**

- Primary: generative engine optimization services
- Secondary: GEO agency, AI search visibility, ChatGPT recommendation optimization
- Title (56): `Generative Engine Optimization Services | SiteOptz`
- Meta (153): `We measure how often AI assistants recommend you, what they say, and which sources they cite — then work on the sources. Baseline scan available.`
- H1: What the assistant says when someone asks about you.
- Delta: add a "what this is not" section stating outright that no one can guarantee a
  model recommends you. Keep it. It is the strongest trust signal on the site. 6 FAQ
  entries, 1,400–1,700 words.

**`/services/answer-engine-optimization`**

- Primary: answer engine optimization services
- Secondary: featured snippet optimization, People Also Ask optimization, voice search
- Title (52): `Answer Engine Optimization Services | SiteOptz`
- Meta (145): `Structuring content so search engines can lift a direct answer from it — snippets, People Also Ask, and voice results, measured as a channel.`
- H1: Being the answer, not the tenth result.

**`/services/programmatic-advertising`**

- Primary: programmatic advertising agency
- Secondary: DSP management, connected TV advertising, display retargeting
- Title (47): `Programmatic Advertising Agency | SiteOptz`
- Meta (150): `Display, CTV, and audio bought programmatically with inventory transparency and a conversion definition that survives a view-through window.`
- H1: Programmatic with the view-through window closed.
- Delta: section 5 must cover fraud, viewability, and why we discount view-through.

**`/services/influencer-marketing`**

- Primary: influencer marketing agency
- Secondary: creator partnerships, influencer attribution, UGC campaigns
- Title (44): `Influencer Marketing Agency | SiteOptz`
- Meta (148): `Creator partnerships with tracked attribution — codes, links, and matched-market tests instead of screenshots of impressions from a media kit.`
- H1: Creator partnerships you can actually attribute.

**`/services/amazon-non-brand-search`**

- Primary: Amazon PPC management agency
- Secondary: Amazon non-brand advertising, Sponsored Products management, ACoS optimization
- Title (48): `Amazon PPC Management Agency | SiteOptz`
- Meta (149): `Category and competitor targeting on Amazon managed to contribution margin rather than ACoS, with brand and non-brand reported separately.`
- H1: Amazon non-brand, reported separately from brand.

---

### Middle of funnel — 6 pages

**`/services/middle-of-funnel`** (hub)

- Primary: middle of funnel marketing services
- Title (55): `Middle of Funnel Marketing Services | SiteOptz`
- Meta (143): `Five programs for people who know you and have not decided yet — and the measurement that shows what actually moved them forward.`
- H1: The stage where most measurement gives up.
- 600–800 words.

**`/services/social-media`**

- Primary: organic social media management agency
- Secondary: B2B social media management, community management
- Title (52): `Organic Social Media Management | SiteOptz`
- Meta (141): `Owned social presence and community, run separately from paid, with reporting that does not take credit for what the ads produced.`
- H1: Organic social, reported honestly against paid.

**`/services/content-marketing`**

- Primary: B2B content marketing agency
- Secondary: demand education content, content strategy consulting, editorial operations
- Title (45): `B2B Content Marketing Agency | SiteOptz`
- Meta (147): `Editorial built for buyers in the middle of a decision, with assisted-conversion reporting that shows which pieces appeared in closed deals.`
- H1: Content measured by the deals it appeared in.

**`/services/affiliate-marketing`**

- Primary: affiliate marketing management agency
- Secondary: affiliate program management, partner network management
- Title (52): `Affiliate Marketing Management | SiteOptz`
- Meta (150): `Program management with last-click inflation removed — we identify which affiliates create demand and which are intercepting it at the checkout.`
- H1: Affiliates that create demand, separated from those intercepting it.
- Delta: section 5 must cover coupon and loyalty extension interception explicitly.

**`/services/branded-search-ppc`**

- Primary: branded search PPC management
- Secondary: brand term defense, competitor conquesting defense
- Title (47): `Branded Search PPC Management | SiteOptz`
- Meta (152): `Defending your brand terms without paying for clicks you would have earned free. We measure incrementality before recommending a brand budget.`
- H1: Paying for brand terms, only where it is incremental.
- Delta: add a section on incrementality testing method.

**`/services/amazon-branded-search`**

- Primary: Amazon brand defense advertising
- Secondary: Amazon branded search management, Sponsored Brands
- Title (50): `Amazon Brand Defense Advertising | SiteOptz`
- Meta (144): `Holding your own listings against competitor conquesting, with spend judged on defended revenue rather than blended account-level ACoS.`
- H1: Holding your own listings on Amazon.

---

### Bottom of funnel — 8 pages

**`/services/bottom-of-funnel`** (hub)

- Primary: bottom of funnel marketing services
- Title (55): `Bottom of Funnel Marketing Services | SiteOptz`
- Meta (146): `Seven programs for converting demand that already exists — where the difference between a good and bad month is usually operational, not creative.`
- H1: Converting the demand you already have.
- 700–900 words.

**`/services/conversion-rate-optimization`**

- Primary: conversion rate optimization agency
- Secondary: CRO consulting, landing page testing, form and intake optimization
- Title (51): `Conversion Rate Optimization Agency | SiteOptz`
- Meta (148): `Testing run to statistical significance on real traffic volumes, including the intake steps after the form — where most conversions are lost.`
- H1: Testing that runs long enough to mean something.
- Delta: section 4 must include a row on sample size discipline and one on post-form intake.

**`/services/email-marketing`**

- Primary: email marketing and lifecycle agency
- Secondary: lifecycle marketing, marketing automation management, nurture programs
- Title (49): `Email and Lifecycle Marketing | SiteOptz`
- Meta (145): `Lifecycle programs measured on incremental revenue, not open rates — including what the sequence would have earned had it never been sent.`
- H1: Lifecycle email measured on incremental revenue.

**`/services/organic-capture`**

- Primary: Google Business Profile management
- Secondary: local SEO map pack, review management, branded organic capture
- Title (52): `Google Business Profile Management | SiteOptz`
- Meta (150): `Capturing demand at the moment of decision: business profiles, reviews, map pack position, and branded queries, managed location by location.`
- H1: Capturing demand at the moment of decision.
- Delta: state clearly this is branded and local capture, distinct from the SEO page.

**`/services/retargeting`**

- Primary: retargeting advertising services
- Secondary: remarketing campaign management, audience segmentation retargeting
- Title (45): `Retargeting Advertising Services | SiteOptz`
- Meta (151): `Re-engagement campaigns with incrementality testing built in, so you know what the retargeting produced rather than what it took credit for.`
- H1: Retargeting, with the incrementality question answered.
- Delta: section 5 must state plainly that most retargeting reports overstate.

**`/services/partnerships`**

- Primary: strategic marketing partnerships
- Secondary: co-marketing programs, referral partner programs, channel partnerships
- Title (48): `Strategic Marketing Partnerships | SiteOptz`
- Meta (142): `Referral and co-marketing programs with tracked sources, agreed attribution rules, and reporting both sides of the partnership can see.`
- H1: Partnerships with the attribution agreed up front.

**`/services/creative-production`**

- Primary: creative production services
- Secondary: ad asset production, creative operations, high volume creative
- Title (44): `Creative Production Services | SiteOptz`
- Meta (143): `Producing the volume of assets modern paid media consumes, to spec, on a cadence the testing plan can actually keep pace with.`
- H1: Producing creative at the volume testing requires.

**`/services/marketing-operations`**

- Primary: marketing operations consulting
- Secondary: martech stack consolidation, marketing data governance, lead routing
- Title (48): `Marketing Operations Consulting | SiteOptz`
- Meta (149): `Stack consolidation, lead routing, data governance, and the plumbing that decides whether any of the other twenty-two programs can be measured.`
- H1: The plumbing everything else depends on.
- Delta: links to the pillar twice — this page and attribution are the closest pair.

---

### Supporting pages

Unchanged from v1 except where noted. Full specs in the archived v1 file.

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

## 7. The real risk on 23 service pages

23 pages at 1,100+ words is roughly 28,000 words of specific, non-overlapping copy. The
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
