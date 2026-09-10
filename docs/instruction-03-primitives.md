# Instruction 0.3 — layout primitives

Six components, no pages. Short prompt, high consequence: these define the spacing,
measure, and interaction vocabulary that all 40 pages inherit. Every decision made loosely
here gets repeated 40 times.

---

## Before you paste

Apply the Node fix from instruction 0.2's follow-up first, as its own commit:

- remove `--experimental-strip-types` from the prebuild script
- `"engines": { "node": ">=22.18" }` in package.json, and a `.nvmrc` reading `22`
- `"erasableSyntaxOnly": true` in tsconfig.json
- confirm Vercel Node.js Version is 22.x
- confirm `next.config` is `.ts` or `.mjs`, not a `.js` file using `module.exports`

`chore: pin Node 22.18+ and drop the type-stripping flag`

---

## The prompt — paste this exactly

```
Build components/ui — six primitives. No pages, no content, no blocks in this commit.

Every component is a server component. None takes a className prop for arbitrary
overrides; variants are named props with fixed behavior. If a page later needs something
these do not do, the answer is to extend the primitive here, not to escape it inline.

## Container

Props: children, as (defaults to 'div').
Applies max-width var(--container-site) and horizontal padding var(--spacing-gutter),
centered. Nothing else. No vertical spacing ever.

## Section

Props: children, surface ('paper' | 'paper-2' | 'navy'), size ('default' | 'compact').
Renders a <section> with the surface background and its matching foreground color:
- paper: bg paper, text ink
- paper-2: bg paper-2, text ink
- navy: bg navy-900, text at #DCE4F2, headings at #FFFFFF

Vertical padding: var(--spacing-section) below 900px, var(--spacing-section-lg) at and
above. 'compact' halves both.

Section is the only place vertical section rhythm is defined anywhere in this codebase. No
page and no block may set its own section padding. Add a comment stating this at the top of
the file.

Section does not render a Container — pages compose Section > Container explicitly, since
some blocks need full-bleed children.

## SectionHead

Props: heading (string), lead (string, optional), as ('h2' | 'h3', default 'h2').
Two-column asymmetric grid: heading in a narrower left column capped at 16ch, lead in a
wider right column capped at var(--measure-sans), baseline-aligned at the bottom. Single
column below 900px. Bottom margin of 2.75rem.

No eyebrow prop, no kicker prop, no icon prop, no centered variant. Do not add one later.

## Prose

Props: children, variant ('sans' | 'serif', default 'sans').
Sets measure and vertical rhythm for long-form body copy: paragraphs capped at
var(--measure-sans), or var(--measure-serif) with font-serif and line-height 1.7 in the
serif variant. Styles descendant p, ul, ol, li, strong, em, a, h2, h3 for MDX output.

Links inside Prose: blue-600, 1px underline offset 2px in a lighter blue, full blue on
hover. On navy surfaces they inherit blue-300 — handle this with a CSS selector on the
navy surface class, not a prop.

## Rule

Props: tone ('light' | 'dark', default 'light').
A 1px horizontal rule at var(--color-rule), or rgba(255,255,255,0.14) on dark. No margin of
its own — spacing belongs to whatever composes it.

## Button

Props: children, href (optional), variant ('primary' | 'ghost' | 'line'), type, disabled.
Renders next/link when href is internal, an <a> when external (with rel="noopener"), a
<button> otherwise.

- primary: bg blue-600, white text, border blue-600; hover bg blue-700
- ghost: transparent, text #DCE4F2, border rgba(255,255,255,0.3); hover bg
  rgba(255,255,255,0.07). For navy surfaces only
- line: transparent, text blue-600, border #C7D3E8; hover bg paper-2, border blue-600

All variants: 3px radius, 0.68rem/1.15rem padding, font-sans 500 at var(--text-sm), no
box-shadow, no transform on hover, no transition on anything but background and
border-color at 120ms.

Never append an arrow, chevron, or any glyph to button text. The label is the whole label.

Focus: the global :focus-visible ring from globals.css must remain visible on every
variant, including ghost on navy. Verify contrast on that combination specifically.

## Verification before you finish

Build a temporary route at /primitives rendering: all three Section surfaces stacked so the
rhythm is visible, a SectionHead with and without a lead, Prose in both variants, both Rule
tones, and all three Button variants in default, hover, focus, and disabled states.
Screenshot it or describe what renders. Delete the route before committing.

Confirm npm run build, typecheck, and lint are clean.

Commit: feat: layout and UI primitives
```

---

## What to check before accepting

- [ ] `Section` is the only file in the repo containing section-level vertical padding —
      grep for `py-`, `padding-block`, and `margin-block` outside it
- [ ] No component accepts a `className` passthrough
- [ ] `SectionHead` has no eyebrow, kicker, or centered variant
- [ ] `Button` renders `next/link` for internal hrefs, not a bare anchor — internal
      navigation must not full-page reload
- [ ] No arrow or chevron in any button
- [ ] Focus ring visible on ghost-on-navy at AA contrast. Tab to it and look
- [ ] No `transition: all` anywhere
- [ ] `/primitives` deleted, not just unlinked

---

## Where this one goes wrong

**A `className` escape hatch.** It looks harmless and it is how the design system dies.
Once one page passes `className="mt-12"`, spacing stops being systematic and the next
twenty pages each invent their own. If Claude added it "for flexibility," remove it now
while there are zero call sites.

**`Section` rendering a `Container` internally.** Convenient for most pages, wrong for the
full-bleed blocks coming in 0.5 — the mega-menu-width footer, the stage grid, the
attribution chain. Composing them explicitly costs one line per page and keeps both cases
possible.

**Transitions on everything.** `transition: all` plus a hover transform is the card-lift
pattern the brief bans, arriving through the primitive rather than the block. Background
and border-color only.

**Prose styling `h1`.** Only one `h1` per page and it lives in the hero, never inside body
copy. If Prose styles `h1`, an MDX file will eventually use one.

---

## Next

Prompt 0.4 — header, mega menu, footer. One correction to the version in
`docs/build-prompts.md` before you run it: the mega menu column counts there read
"Top of funnel (10), Middle of funnel (6), Bottom of funnel (8)," which counted the stage
hubs alongside their children. The columns list services only, so the correct counts are
**10 / 5 / 7**, plus attribution shown separately in the fourth column. Your `lib/nav.ts`
stage counts already match this, so pull the numbers from `servicesByStage()` rather than
hardcoding them and the discrepancy cannot recur.
