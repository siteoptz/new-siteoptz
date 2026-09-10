# Instruction 0.4 — header, mega menu, footer, breadcrumbs

The hardest component work in Phase 0. A 23-item mega menu is where most agency sites
become unusable on keyboard and unreadable on mobile, and it is the navigation every one
of the 40 pages inherits.

---

## Before you paste

Nothing to prepare. One thing to expect: `content/` is still empty, so most links in the
header and footer will 404 in dev. That is correct at this stage — `lib/nav.ts` describes
the full route table, not what has been built. Do not let Claude "fix" it by trimming the
nav to built routes.

---

## The prompt — paste this exactly

```
Build components/layout: Header, MegaMenu, Footer, Breadcrumbs, SkipLink. Every link comes
from lib/nav.ts. There must be no hardcoded href anywhere in this commit, and no hardcoded
counts — read them from servicesByStage().

Header and Footer are server components. Only MegaMenu and the mobile drawer are client
components, and they should be as small an island as possible.

## SkipLink

First focusable element in the document. Visually hidden until focused, then visible at
top-left on navy with the standard focus ring. Targets #main, which the marketing layout
will render as the id on its <main>. With a 23-item menu, keyboard users must be able to
bypass it.

## Header

navy-900, sticky top, 76px tall, 1px bottom border rgba(255,255,255,0.14). No shadow, no
backdrop blur, no shrink-on-scroll behavior.

Left: wordmark "SiteOptz" in font-display 700 at var(--text-xl), with "Marketing
intelligence" beside it at var(--text-2xs) in #93A3BD. Links to /.

Right: Services, How it works, Industries, Point of view, Proof, then a primary Button to
/contact. Services and Industries open panels; the rest are plain links.

Nav links: var(--text-sm), #C3CDDF, 1.5px transparent bottom border. Hover white. The link
matching the current route section gets white text, a blue-300 bottom border, and
aria-current="page".

## MegaMenu

Opening "Services" reveals a full-width panel on navy-800, top-aligned under the header,
with a 1px bottom border. Four columns inside a Container:

- Column 1: "Top of funnel" — the 10 services from servicesByStage('tof')
- Column 2: "Middle of funnel" — the 5 from servicesByStage('mof')
- Column 3: "Bottom of funnel" — the 7 from servicesByStage('bof')
- Column 4: the attribution pillar, presented as a distinct item with its shortLabel and a
  one-line description, plus a link to the most recent proof entry beneath it

Column headers are links to their stage hubs, not dead labels. Items render shortLabel
only, one line each, var(--text-sm). No descriptions on individual services — at 22 items,
descriptions make the panel unreadable.

Column 4 must degrade: content/proof is empty right now, so when no proof entry exists,
render the attribution item alone with no empty slot and no placeholder text.

Industries opens a simpler single-column panel with the four industries and the hub link.

Behavior, all required:
- Opens on click and on Enter/Space. Not hover-only. Hover may open it on pointer devices,
  but hover must never be the only way in
- aria-expanded on the trigger, aria-controls pointing at the panel id
- Escape closes and returns focus to the trigger
- Tab moves through panel items in order; focus is trapped in the panel while open
- Clicking outside closes
- Opening one panel closes the other
- Route change closes it
- The panel animates height only, 140ms ease-out. Nothing else moves. Under
  prefers-reduced-motion it appears with no animation

## Mobile drawer, below 900px

The nav collapses to a trigger reading the word "Menu" — no hamburger icon, no icon
library. Opens a full-height drawer on navy-900 covering the viewport below the header.

Services expands to three collapsible stage headings, each disclosing its services. Body
scroll is locked while open. Escape and a "Close" control both dismiss it. Focus moves into
the drawer on open and returns to the trigger on close.

## Footer

navy-900, top border. Five columns: Top of funnel, Middle of funnel, Bottom of funnel,
Industries, Company. The three stage columns list every service in that stage — this footer
is the secondary navigation for a 40-route site and a real internal linking surface, so it
is large by design.

Company column: How it works, Point of view, Proof, About, Contact, and info@siteoptz.com.
Above the columns, the wordmark and one line of positioning. Below them, a bottom bar with
copyright, Privacy, Terms.

Collapses to two columns at 900px and one at 560px. No newsletter form.

## Breadcrumbs

Props: trail — an array of { name, path }. Renders hairline-separated text links plus the
BreadcrumbList JSON-LD from lib/schema.ts, built from the same array so the visible trail
and the structured data cannot diverge. Current page is plain text with aria-current, not a
link. Wrapped in a nav with aria-label="Breadcrumb".

## Verification before you finish

Add the marketing layout at app/(marketing)/layout.tsx composing SkipLink, Header, main
with id="main", and Footer, so these render somewhere real.

Then walk the keyboard path and report what happens at each step: Tab from page load
reaches SkipLink first; Tab to Services and press Enter; Tab through all 22 service items;
press Escape; confirm focus is back on the Services trigger. Do the same in the mobile
drawer at 375px.

Confirm build, typecheck, and lint are clean.

Commit: feat: header with mega menu, footer, breadcrumbs
```

---

## What to check before accepting

- [ ] `grep -r 'href="/' components/` returns nothing — every link resolves through nav
- [ ] Column counts read from `servicesByStage()`, not literals. Change a service's stage in
      `nav.ts` and confirm the menu moves it, then revert
- [ ] Panel opens with keyboard alone, no mouse
- [ ] Escape returns focus to the trigger, not to the body
- [ ] Tab from the last panel item does not escape into the page behind it
- [ ] Column 4 renders correctly with `content/proof` empty
- [ ] `'use client'` appears only in the menu and drawer files, not on Header or Footer
- [ ] Drawer locks body scroll and restores it on close, including after Escape
- [ ] Focus ring visible on the ghost/primary buttons in the header — the item deferred
      from 0.3
- [ ] No icon library was installed. `package.json` still lists exactly zod, gray-matter,
      next-mdx-remote

---

## Where this one goes wrong

**Hover-only opening.** It is the default reflex and it locks out keyboard users, touch
users, and anyone with a motor impairment. Click and Enter are the requirement; hover is
an optional addition.

**A whole-header client component.** Marking Header `'use client'` to get one panel working
ships the entire navigation as client JavaScript on every page. The panel is the island;
the header around it is not.

**Descriptions on all 22 services.** It will look better in a screenshot and be unusable in
practice — four columns of two-line items is a wall. Short labels only.

**Focus trap implemented by disabling Tab.** The trap must cycle within the panel, not
swallow the key. If Claude reaches for `inert` on the rest of the document, that is fine
and arguably better; if it prevents default on Tab, check the cycling carefully.

**An icon library appearing for the drawer.** The word "Menu" is the specification. This is
the third instruction where lucide-react is the likely uninvited guest.

---

## Next

Prompt 0.5 — content blocks, the last of Phase 0. Then the review gate at
`/kitchen-sink`, which is the real checkpoint: it is where you find out whether the system
reads as distinctive or as a generic SaaS kit, while it is still one commit to change
rather than twenty pages.
