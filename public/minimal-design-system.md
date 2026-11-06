---
name: minimal
description: Minimal design system — the house style for every product, UI, Figma mock, and product spec, on every surface. Use whenever designing or building any user interface, component, screen, or flow — web, desktop app, phone, tablet, foldable, touch laptop, watch, TV, widget, or OS surface; when making something responsive or adapting a layout across screen sizes; when deciding what to show versus hide (progressive disclosure, overflow menus, grouping, information density); when writing a product spec, PRD, or design prompt; when creating or editing Figma designs; or when reviewing existing UI for craft. Covers monochrome light/dark tokens, button and control states, motion, layout, cross-surface adaptation, and the design principles all projects must satisfy.
---

# Minimal

## Public-use scope and product identity

This is reusable design guidance, not a portfolio template. Preserve the user's
product name, logo, domain, content, metadata, and existing brand requirements.
Do not add Alex Woo, AJWOO, Minimal branding, author biographies, portfolio
content, source-repository links, credits, analytics, or promotional copy to
what the user is building unless explicitly requested. Author names and URLs
in this package identify the source only; they are not product requirements.
Example text and links demonstrate components and must be replaced with the
user's real content. Do not add a "Built with" badge or attribution footer.
Retain any required third-party license notices in distributed source/assets;
this is separate from adding visible branding to the product.

## Start here when applying the system

Source repository: https://github.com/ajungy/minimal-design-system

Confirm a recoverable checkpoint without overwriting existing work. Preserve
platform conventions and accessibility. Ask before changing dependencies,
authentication, payments, stored data, or publishing. Test affected flows,
disclose unverified behavior, and explain how to undo only your changes.


When the user asks to apply Minimal to a product, implement the changes on the
requested scope. For a whole project, audit shared components first and apply
changes across screens in reviewable batches.
Use the project's framework and working components.

No AJWOO account, paid service, Figma access, or prior skill installation is
required to use these instructions in an existing code project. If no project
is available, ask the user which project or screen to build before editing.
Installing this as a reusable skill is optional; reading and applying this
file is sufficient for the current task. If you already have this complete
file, use it directly instead of fetching it again.

If a web reader rejects Markdown or truncates the response, download the raw
file with the coding tool's permitted network tools and read it locally in
sections. Do not treat a search snippet as the complete skill. Before editing,
confirm the token, reference, and example files are present, either as local
files or under the bundled-file headings. If they are missing, ask for the
complete download rather than guessing their contents.

1. Read the screen and identify its primary user action. Inspect the current
   markup, styling, and shared components. Capture a baseline screenshot when
   a browser is available.
2. Read `reference/token-usage.md`, `reference/components.md`, and
   `reference/motion.md`. For a working starting point, inspect
   `examples/components.html` and `examples/components.css`. These examples
   provide a responsive content layout, primary and secondary actions, a
   labeled input, keyboard focus, and semantic theme colors.
3. Connect the included tokens to the actual application. Importing a token
   file alone does not change components with hard-coded styles. Replace
   conflicting colors, type styles, spacing, and control treatments within
   the requested scope. Preserve working behavior, meaningful brand assets,
   content, and accessibility semantics.
4. Apply a coherent visual pass. Establish a readable page title and body
   hierarchy, one primary action, consistent control sizes, semantic surfaces,
   and spacing that makes related content feel grouped. Use the exact values
   in the tokens and references. Make choices based on the screen's purpose.
   If it already follows the system, explain that and address actual gaps.
5. Run the app and inspect the resulting screen on mobile and desktop.
   Check text wrapping, overflow, keyboard focus, control states, and supported
   themes. Fix issues you observe. Report which checks were performed and
   which were unavailable. Show before/after screenshots when possible.

For a single-file download, the referenced documents and example source appear
under “Bundled file” headings. Read them there. Extract only the files needed
for imports into the target project. For the ZIP, retain the folder structure.
The HTML/CSS example works without React or Tailwind. Adapt its markup to the
project's framework and connect its controls to the product's existing logic.

## Suggested prompt

Open the target project in your coding tool, then paste this prompt to load the
complete skill from the website. If fetching is unavailable, attach the
self-contained SKILL.md download instead. You can replace
“this project” with a specific route or component.

<!-- recommended-prompt:start -->

Read SKILL.md and its references, tokens, and examples from https://github.com/ajungy/minimal-design-system. Apply the system across this project in reviewable batches, using its existing framework and native accessibility conventions. Confirm a recovery point without overwriting existing work. Preserve content and functionality; test affected flows and explain how to undo your changes. Ask before changing dependencies, authentication, payments, stored data, or publishing. If files are unavailable, ask me for the complete skill; do not invent missing resources. If no project is open, ask which project to update. Keep the user’s own product identity. Do not add Alex Woo, AJWOO, Minimal branding, source links, credits, or demo content to the product unless requested.

<!-- recommended-prompt:end -->

## Using this download

This is the self-contained edition. All supporting files appear in the appendices below. Treat those appendices as the referenced documents. For imports, first save the token appendices at their indicated paths. The complete folder is also available at https://www.ajwoo.com/minimal-design-system.zip.
For code setup, token mappings, theme switching, and spacing values, start with
[reference/token-usage.md](reference/token-usage.md).

To install as an AI skill, place the `minimal` folder in your tool's skills
directory, such as `.agents/skills/minimal/` or `.claude/skills/minimal/`.
You can also give the folder to your coding assistant directly.
The ZIP includes the reusable base system. Individual websites may customize it.

For a single-file workflow, use the self-contained download at
https://www.ajwoo.com/minimal-design-system.md. It includes every supporting
file as an appendix. Read those appendices directly and create the token files
at their indicated paths before importing them into a project.


The single house style. Every project — code, Figma, spec — inherits from this file.

The name is the brief: if an element can't justify itself, it isn't in the
design. Rename it if you want a different word on the tin; nothing else changes.

**The system in one line:** brightest white or very dark gray, black-and-white
actions, one line weight, one radius language, color only when it means
something, motion only where a human is touching the thing.

---

## 0. The rule above all rules

**Good design solves the job to be done.** Before any token, layout, or
animation, answer in one sentence: *what is the user trying to finish, and what
is the shortest honest path to done?* If a decision doesn't shorten that path or
make it clearer, it is decoration — cut it.

When craft and the job conflict, the job wins. When two solutions serve the job
equally, take the quieter one.

---

## 1. Principles

These are checkable, and **ordered by importance — most important first.**
Each one can be failed by a specific screen. Where two used to overlap, they've
been merged into one.

**1. Solve the job to be done.** Before any token, layout, or animation, answer
in one sentence: what is the user trying to finish, and what is the shortest
honest path to done? If a decision doesn't shorten that path or make it
clearer, it is decoration — cut it. When craft and the job conflict, the job
wins. This is the rule above all the others in this file; everything below is
in service of it.

**2. Achieve the goal — with ease, simplicity, and honesty.** A screen almost
always carries more than one kind of goal, and they're rarely the same thing:
the **user's goal** (the task they came to finish), the **business goal**
(conversion, retention, revenue), the **organization's goal** (policy,
compliance, brand consistency), and sometimes a **personal goal** (a
stakeholder's preference, a team convention). Name each one that's in play on
a given screen, then rank them explicitly — don't let them default to whatever
order they were requested in. The user's goal is the default top priority,
because Principle 1 already says the job to be done comes first, and a product
that doesn't help the user finish their task won't stay around to serve the
other goals either. When a lower-ranked goal — an upsell, a policy notice, a
data request — would compete with the top one for attention, it steps back:
smaller, quieter, later, never the reverse. A screen where five goals fight for
the same visual weight serves none of them.

**3. One hierarchy, one emphasis.** Exactly one thing is the most important
thing, and it carries the only strong emphasis on the screen — the largest
type, the highest contrast, or the only motion, not all three at once.
Everything else steps down in a visible order and nothing else competes with
it. If a stranger can't name the most important element in two seconds, or if
two elements are both shouting for attention, this principle has failed.

**4. Clear start, clear end.** Every experience has one unmistakable starting
point that puts the user on a legible path toward a clear endpoint — completing
the job to be done. A landing page or home screen is a clear start: from it,
the user can see and reach their primary goal, and any secondary goals,
without guessing where to look. The end matters just as much — an order
confirmed, a message sent, a file saved — and should be just as unambiguous,
so the user always knows whether they finished. Home stays reachable from
anywhere, in the same place on every screen (top-left), as the fallback clear
start whenever a specific path gets lost.

**5. Be honest.** Show what's actually happening, accurately — informative,
warning, problem, or success, whichever it genuinely is. Never soften a failure
into something that reads as neutral, and never dress up an ordinary result as
a triumph. Clear, accurate information is what lets a user make the right
judgment and take the right next action; honesty here is a usability
requirement, not a tone preference.

**6. Respect the gaze.** Western reading is left→right, top→bottom. Titles and
identity go top-left. Global and account actions go top-right. Within a form or
card, the label precedes the value; the confirming action sits at the end of the
reading path (bottom-right or the far right of a row). Never make the eye
backtrack to find the next step.

**7. Everything comprehensible.** Plain words over clever ones. A label is a
verb phrase describing the outcome ("Save changes", not "Submit"). Icon-only
controls require a tooltip *and* an accessible name. No jargon the user didn't
bring.

**8. Nothing invisible.** No element that does something may be indistinguishable
from an element that does nothing. Every interactive thing has a visible
affordance at rest — not only on hover. Hover-only reveals are forbidden on
anything a user must find; they may only *enhance* something already discoverable.

**9. Color carries meaning, never mood.** Green = succeeded. Amber = needs
attention, not yet broken. Red = failed, destructive, or genuinely urgent.
Nothing else is colored. A red thing must always be a real problem, or red stops
working.

**10. Space is your friend.** Group with distance first: things placed close
together read as related, things placed apart read as unrelated — this is the
default tool, because it costs nothing and never goes stale. Two other tools
exist alongside it, both used deliberately, never by default:

A **line** — a hairline divider — earns its place when the separation is
genuinely purposeful and worth stating outright: a table's rows, a dense
settings list, the boundary between a form and its footer. Used with real
intent, a divider is a legitimate, permanent part of this system; used to
decorate a gap that spacing already communicates, it's noise. The test doesn't
change: if the groups are still readable with the line hidden, the line wasn't
doing the separating — remove it.

A **solid box** — a card or panel with a rounded corner and a filled
background, not an outline — earns its place when several elements genuinely
belong to one object: a record, a message, a product, a settings section with
its own name. Show that boundary with a fill difference, or — over dynamic
background content — a subtle blur; reach for an outlined box only when you
deliberately want the grouping itself to draw the eye. A box wrapped around a
cluster of otherwise-independent controls "to be safe" is the same mistake as
a decorative divider: increase the gap around the cluster instead.

Used well, spacing gives an interface breathing room: it lets the eye rest on
the one thing that matters, makes hierarchy and grouping legible without
spending a single pixel of ink, and keeps a screen from overwhelming the user
with information they didn't ask for. When in doubt, reach for space before a
line or a box.

Spacing is also a language, and like any language it only works if it's spoken
consistently. A user learns, without ever being told, that this app groups
things 8px apart and separates them 32px apart — and once they've learned that,
every gap on every screen is either confirming what they already know or
quietly contradicting it. Use the same spacing scale for the same kind of
relationship everywhere in the product, not a slightly different rhythm per
screen. And every gap should have a legible reason for its size — not "this
felt about right," but "these two things are unrelated" or "this group is
denser because it's a data table." If you can't say in one sentence why a gap
is the size it is, it's probably an accident, and accidents are what erode the
language over time.

**11. Nothing moves.** A control occupies the same position and the same box in
every state — default, hover, press, disabled, loading, error. Loading does not
shrink a button. An error message does not shove the submit button down; reserve
its space. Users should learn where a thing is once, forever. The only permitted
transform is `scale(0.98)` on press, which changes nothing about layout.

**12. Immediate feedback.** Visual response to input within 100ms, always. Under
1s, no spinner — just do it. 1–3s, indeterminate spinner in place. Over 3s,
determinate progress with real numbers. Never fake a progress bar.

**13. Reversible by default.** Prefer undo over confirm. Destructive actions get
either a 5-second undo toast or an explicit confirmation — never both, never
neither. Provide a back affordance on any multi-step flow. Autosave drafts;
losing user input is the most expensive failure in the system.

**14. No dead ends.** Every state has a way forward and a way back. A
persistent header or footer with a route home counts as a way back, and so does
a clear home screen (Principle 4) — a dead end is only truly dead if there's no
path out of it anywhere on the screen. Empty states name the thing that's
missing and offer the action that fills it. Errors say what happened, why, and
the one thing to do next.

**15. Guard the irreversible.** Actions that cannot be undone (delete forever,
send, publish, pay) must look unmistakably dangerous — the Danger color family,
never a neutral button style — and carry a clear tooltip or adjacent text
stating the actual consequence, not just the action's name. It must never be
the default-focused control, and it must require a deliberate second act —
typing the name, holding to confirm, or a dialog whose confirm button is not
pre-focused. Rapid double-click must never fire it twice.

**16. Motion has a job.** Animate to explain a relationship (where this came
from, where it went), to confirm a touch, or to hold attention during a wait.
Never to decorate. Nothing on the page moves unless the user caused it or is
waiting on it.

**17. No shouting.** Never set text to all caps as a styling choice. Capitals-
as-emphasis is a typographic trick from an era of fewer weights and sizes —
this system has both, so use weight, size, or color instead. The exception is
capitalization that's inherent to the text itself rather than applied for
effect: proper nouns, acronyms, and file names — `SKILL.md`, LOL, API — are
spelled the way they're spelled, sitting inside otherwise sentence-case copy.
That isn't shouting; it's just correct.

**18. Maximize your use of space — where precision rewards it.** Some elements
get more *usable*, not just more comfortable, the more room they're given: a
slider or color picker is easier to control with a longer track; an image,
video, or canvas preview is easier to judge and work with at the largest
reasonable size. For these, don't cap the size to match a neighboring label or
shrink it "to be tidy" — let it take the maximum row length, column length, or
canvas area available. This sits in productive tension with Principle 10: use
generous space to separate and group, and use maximum space for the handful of
elements whose job is control or presentation of the primary content.

**19. Remove the step.** Every screen, field, click, and confirmation must earn
itself. Default to sensible defaults. Ask for nothing you can infer. Prefer one
long obvious page to four short mysterious ones.

**20. Understandable without a tutorial.** If a flow needs an onboarding overlay
to make sense, redesign the flow. Coach marks are an admission of failure.

**21. Same everywhere.** Shape, color, layout, line weight, and type are
identical across every project. A user who learns one product knows the next.

**22. Adapt, never redesign.** The same product on a watch, a phone, a desktop,
and a TV is recognisably one product. Surfaces differ in how much is visible and
how it's reached — never in what things mean or what they're called. Design
against input modality, viewing distance, canvas size, and attention budget, not
against a list of devices. Detect capability, never device.

**23. Spend the attention budget deliberately.** Every element taxes every other
element. Assign each one a tier: always visible, one interaction away, in a
dedicated place, or deleted. Hide *content*, never the affordance that reveals
it — a "More" button is always visible; what's inside it is not. Cost,
consequence, permissions, current state, and anything required are never
disclosed, and nothing is ever hidden because it's unflattering.

**24. Nothing is lost when the surface changes.** Rotating, folding, resizing,
switching from trackpad to touch, or moving between windows must preserve scroll
position, selection, input, playback, and focus. This is Principle 13 applied to
hardware, and it's the most commonly broken rule in this file.

**25. The window is exactly as big as its content.** Don't reserve space "in
case" content grows, and don't center a small amount of content inside a large
canvas. If a view has less content than the window, shrink the window —
especially for widgets, panels, and utility surfaces, which should hug their
content on every edge. Leftover whitespace at the bottom or right edge of a
window is not calm, it's unfinished sizing.

---

## 2. Tokens

Load `tokens/tokens.css`. Set `data-theme="light" | "dark"` on `<html>`, or omit
it to follow the OS. Use the Tailwind preset at `tokens/tailwind.preset.js`.
Import `tokens/tokens.json` with a compatible token importer and map Light/Dark modes.
See `reference/token-usage.md` for setup.

**Never write a hex value in a component.** If a color you need doesn't exist as
a semantic token, the design is wrong or the system needs a considered addition.

### Surfaces

| | Light | Dark |
|---|---|---|
| Page | `#FFFFFF` — the brightest white | `#0E0E10` — very dark gray, never pure black |
| Raised (cards, grouping boxes) | `#FFFFFF` + `e1` shadow, no border | `#18181B` + hairline |
| Sunken (wells) | `#F7F7F8` | `#09090B` |
| Control (inputs, selects, search) | `#F7F7F8`, no border at rest | `#09090B`–ish, no border at rest |
| Overlay (menus, modals) | `#FFFFFF` + `e2`/`e3` shadow | `#1C1C20` + hairline |

Light mode expresses depth with **shadow**. Dark mode expresses depth with
**surface lightness plus a hairline** — shadows barely read on dark, so a raised
thing gets lighter, and it's the one place a border is genuinely doing a job a
fill can't: without it, a raised surface at nearly the same lightness as the
page behind it would be unreadable in the one theme where shadow can't help.
This is the model for every border exception in the system — a line earns its
place only where fill and shadow together can't carry the boundary alone.

**Grouping boxes use this same language.** A card or panel that groups several
elements together (Principle 10) is a Raised surface: shown by its fill and
shadow in light mode, by its lightness and hairline in dark — never by an
outline layered on top for emphasis. Reserve an actual outlined box for the
rare moment the grouping itself should draw the eye, not as the default way a
card reads as a card.

**Materials.** The system is opaque, with exactly one exception:
`--surface-chrome`, a 72% translucent surface over a 24px background blur, used
only for OS-level chrome — sidebars, toolbars, sheets. 72% is the floor at which
text on top still clears 4.5:1 over arbitrary scrolling content; don't lower it.
This is also the answer whenever a grouping box sits over dynamic background
content instead of the flat page: reach for `--surface-chrome`'s blur rather
than a border to separate it. Everything else stays opaque, because contrast
should never be a function of what happens to be underneath.

### Type

**Plus Jakarta Sans** (SIL Open Font License), falling back to the system stack.
Weights 400 / 500 / 600 only; there is no bold in the UI.

Tracking tightens as size increases — that negative letter-spacing is most of
what makes a ramp read as high-craft. But the values here are ~35% less negative
than an Inter or SF ramp would use: Plus Jakarta is wider and rounder with a
large x-height, and the tighter numbers make it look cramped rather than crafted.
**If you ever swap the typeface, retune the tracking.** Sizes transfer between
faces; tracking does not.

`display 48/52 −0.020` · `h1 32/38 −0.014` · `h2 24/30 −0.012` ·
`h3 20/26 −0.009` · `title 17/24 −0.006` · `body-lg 17/26 −0.006` ·
`body 15/22 −0.004` · `label 14/20 −0.002` · `caption 13/18 0` ·
`micro 11/14 +0.020`

In Figma the weight strings are `Regular` / `Medium` / `SemiBold` — note
`SemiBold` has no space, unlike Inter's `Semi Bold`. Loading the wrong string
throws on first write.

Body copy caps at ~72 characters per line. Never center more than two lines of text.

**No orphans.** Never leave a single word — or worse, a single letter — alone
on the last line of a paragraph, heading, button label, or table cell. Adjust
the container width, the line length, or the copy itself rather than shipping
a dangling word; it reads as sloppy even when nobody can say exactly why.
The same care applies to headings and card titles that wrap: a two-word
heading breaking 1-word/1-word should almost always break 2/0 instead — check
the wrap at your actual breakpoints, not just the widest one.

**One typographic system, applied consistently.** Every screen draws from the
same ten named steps (display through micro) and only those steps — never a
bracket value, never a size invented for one screen. The same discipline
applies to weight (only 400/500/600 exist), color (text always comes from
`--text-primary/secondary/tertiary/disabled`, never a one-off gray), and
typeface (Plus Jakarta Sans everywhere, no per-feature substitutions).
Consistency here isn't a style preference — it's what lets a user's eye parse
"this is a heading" or "this is secondary text" instantly, without rereading.

**Never all caps.** Sentence case everywhere — headings, labels, buttons, nav
items, table headers. Use `text-label` weight (500) or `text-caption` size to
signal "this is a category/meta label," not capitals. See Principle 17.

### Space, radius, line

4px base scale. **8px grid for layout** — every gap, pad, and offset is a
multiple of 4, and preferably of 8.

Radius: `4` chips, badges, checkboxes, small indicators · **`8` all
controls** — buttons, inputs, selects, menu items · `16` cards, popovers,
modals, and sheets · `9999` pills and avatars. Three steps, each double the
last — chosen because every one of them divides cleanly by the 4px grid. `10`,
the old default, didn't, and it was the one number in the system that never
quite felt settled. A child's radius sits one step down this scale from its
parent's — a 16px card holds children at 8, an 8px control at 4 — which the
doubling makes automatic instead of a calculation.

**One line weight: 1px.** Every border, divider, and outline in every project.
Two weights make a system look assembled by committee.

**Controls are filled, not outlined.** A control's edge is defined by a
visible difference in fill against its background — `--surface-control` sits
a clear, deliberate step off `--surface-page` — not by a line around it. That
fill difference has to clear the same ≥3:1 boundary contrast a border used to
carry; it's a different technique for the same accessibility requirement, not
a relaxation of it. Reserve `--border-control` for the short list of cases
where fill alone genuinely can't do the job: an unchecked checkbox or radio
(too small for fill contrast to read reliably) and a control that has to sit
directly on a surface sharing its own fill. Secondary buttons keep their
border by design — it's their entire affordance, since they carry no fill at
rest. Full exception list and the reasoning behind each one is in
`reference/components.md`.

Three border strengths remain for the cases that do call for a line:
`--border-subtle` dividers, used sparingly (Principle 10) · `--border-default`
the rare card-on-card edge · `--border-strong` a hovered control that already
has a border. `--border-control` is the function-only exception above, not a
default.

### Motion

`fast 120ms` hover/press · `base 180ms` most things · `slow 260ms` modals
arriving · `slower 400ms` route changes.

Easings: `standard cubic-bezier(0.2,0,0,1)` default · `entrance
cubic-bezier(0.16,1,0.3,1)` for things arriving · `exit cubic-bezier(0.4,0,1,1)`
for things leaving. Things leave faster than they arrive.

**Only these properties may animate:** `opacity`, `transform`,
`background-color`, `border-color`, `color`, `box-shadow`, `filter`. Animating
width, height, top, left, margin, or padding is banned — it costs frames and it
moves neighbors.

Always honor `prefers-reduced-motion` (already handled in `tokens.css`).

---

## 3. Buttons — the load-bearing component

Get these right and the rest of the system follows.

| Variant | Light | Dark | When |
|---|---|---|---|
| **Primary** | solid `#0E0E10`, white text | solid `#FFFFFF`, near-black text | The one action this screen exists for. Max one per view. |
| **Secondary** | transparent + 1px border, black text | transparent + 1px border, near-white text | Real alternatives. Cancel, Back, secondary paths. |
| **Tertiary** | text only, **no border ever**; shape appears on hover | same | Low-stakes, repeated, or in-table actions. |
| **Danger** | solid `#B42318` | solid `#D93A3F` | The irreversible act itself, in a confirmation. |
| **Danger Secondary** | red text + red 1px border | red text + red border | A destructive option among others — a row action, a settings entry. |
| **Danger Tertiary** | red text only, no border | same | A destructive item inside a menu or toolbar. |

The danger family carries the same three-level hierarchy as the neutral one, for
the same reason: solid red is a shout, and most destructive actions don't need
one. Reserve the solid for the moment of commitment — the confirm button in the
dialog. Everything leading up to it uses outline or text.

Three levels of red does **not** mean three chances to delete something. There is
still exactly one destructive action per view, and it is still guarded.

**The hover/press law:** hover moves the fill one step *toward the mid-gray*
(black lightens, white dims) — it reads as lifting toward you. Press returns the
fill to its default and applies `scale(0.98)` over 90ms — it reads as pushing
down. Same physical metaphor in both themes, so muscle memory transfers.

Sizes: `sm 32px` · `md 40px` (default) · `lg 48px`. Radius always 10.
Touch targets 44×44 minimum — pad the hit area, don't grow the box.

Every button implements: **default · hover · focus-visible · press · disabled ·
loading · processing · success**. Full state tables, sizing, spinner spec, and
the width-locking technique in `reference/components.md`.

**Tertiary carries no border at all** — not even a transparent one. Primary,
secondary and danger keep a 1px border (transparent when unused) so they share
identical outer dimensions; tertiary is deliberately weightless. Its entire
affordance is typography: the label sits one weight step above body text, at
semibold. That reads as actionable the way a link does, without borrowing a box
it doesn't have. The 10px shape fades in on hover — the same radius as every
other control, so the ghost button is revealed as *the same object* the others
are.

Two non-negotiables:

- **The box never resizes.** Loading swaps the label for a spinner *inside the
  same box* — lock the width, don't let the label collapse.
- **Disabled is never silent.** A disabled control must be accompanied by the
  reason it's disabled. Prefer an enabled button that explains the problem on
  click over a dead one that explains nothing.

---

## 4. Layout

- Containers: `720` reading/forms · `1200` app shell · `1400` dashboards & tables.
- Page padding: 16 mobile / 24 tablet / 32 desktop. Gutters 24.
- Vertical rhythm: 8 within a group, 16 between related groups, 32 between
  sections, 64 between major regions. Section spacing should be visibly larger
  than the spacing inside a section — that gap *is* the grouping.
- **Top-left**: identity + home. **Top-right**: global actions, search, account.
  Same on every screen of every product.
- Forms: single column. Labels above fields. Related fields grouped with 16;
  groups separated by 32. Commit action bottom-right of the form, destructive
  action pushed to the far left with ≥24px of separation.
- Density: prefer whitespace over borders, and grouping over dividers. If a
  screen feels busy, the fix is almost always fewer elements, not smaller ones.

### Grouping: space first, then lines and boxes with intent

Default tool for grouping is the gap. Step the gap in discrete jumps — 8
inside a group, 16 between related groups, 32 between sections — so the size
of a gap is always legible as a statement about the relationship, not a random
value that happened to fit.

A hairline divider is not banned — it's a tool for when the separation is
genuinely purposeful and worth stating outright: a table's rows, a dense
settings list, the line between a form and its footer actions. Use it there
without hesitation. What it isn't for is decorating a gap that's already
visibly a gap — a divider between two sections already 32px apart adds a line
without adding information. Before placing one, name the reason in a sentence;
if you can't, it's decoration.

A solid box — a card or panel, rounded corner, filled background — is the
other purposeful grouping tool, and the one to reach for when several elements
are genuinely one object: a record, a message, an item in a list, a named
settings section. Show the box's edge with a fill difference against its
background (or a subtle blur if it sits over dynamic content — see Materials
in §2), not an outline; save an outlined box for the rare moment you want the
grouping itself to be the thing that draws the eye. A toolbar of five buttons
doesn't need a panel behind it — the gap before and after it already says
"these five belong together, and nothing else does." Before adding a box, ask
whether a fill difference and the surrounding gap would do the same job. It
usually does; when it doesn't, that's exactly when a box or a line is earning
its place rather than decorating one.

### Alignment and consistency within one page

Every control on the same page shares a grid: pick one column width for
dropdowns, selects, and text inputs that appear near each other and hold it,
even if one field's content is shorter. Don't let a select shrink-to-fit its
current value while its neighbor is full width — a page where every dropdown
in a form or toolbar is a different width reads as unfinished. Align left
edges of labels, left edges of fields, and right edges of trailing actions
across every row; a field that's 4px off the column above it is a visible
defect, not a rounding error.

### Sliders and other room-hungry controls

Give sliders the full width of their row or container rather than a fixed
short track — more length means finer control and an easier target, and it
costs nothing on a canvas class that has the room (`expanded` and up).
Compact/mobile canvases may still need a shorter track; scale it down there,
not on desktop by default. The same applies to any control whose usability
scales with its physical size — segmented controls, horizontal steppers.

### Window and canvas sizing

Size the window, panel, or widget to its content, not the reverse. A widget
or utility window with 200px of content in a 400px canvas is a sizing bug —
shrink the canvas so the content's own bottom and trailing edges *are* the
window's edges, at the standard page padding. This applies most to widgets,
popovers, panels, and any surface the user can resize or that renders at an
intrinsic size (OS widgets, browser extension popups, floating panels) — grow
or shrink the container with its content rather than reserving fixed space
"just in case." App shells with a fixed viewport (a full browser window, a
phone screen) are the exception: there, unused vertical space at the bottom
of a short page should be filled by pushing footer/secondary content down or
by centering the content block — not left as dead air, and not solved by
inflating element sizes to reach the bottom.

Screen-level patterns (app shell, empty states, loading, error, confirmation
dialogs) are specified in `reference/components.md`.

---

## 5. Surfaces

One system, adapted — never redesigned. Full rules in `reference/surfaces.md`.

**Design against four axes, not a device list:** input modality (pointer · touch
· both · directional · rotary), viewing distance (30cm wrist → 3m TV), canvas
class, and attention budget. Every device — including ones that don't exist yet —
is a point in that space.

**Canvas classes.** `micro` <320 · `compact` 320–599 · `medium` 600–839 ·
`expanded` 840–1199 · `large` 1200–1599 · `xlarge` ≥1600. A class change should
*add or rearrange* content, never merely stretch it. If a breakpoint only changes
padding, it didn't need to exist.

**Targets by modality.** Pointer 32px · **touch 44×44** · directional (TV) 56px.
`tokens.css` raises `--control-h-*` automatically under
`@media (any-pointer: coarse)` — so a touch laptop with a mouse attached still
gets touch-sized targets. Grow the *hit area*, never the visible box.

**Hover is an enhancement, never a channel.** Roughly half of sessions have no
hover at all. Nothing may be discoverable only on hover, only by gesture, or only
in a tooltip. In Tailwind always write `can-hover:hover:` — a bare `hover:`
latches after a tap on touch and leaves the control looking permanently hovered.

**Type follows viewing distance.** Set `data-surface="tv"` or `"watch"` on the
root and only sizes change — weights, tracking, color, and radius are untouched,
so every surface still reads as the same family. Floors: 13 on the wrist, 12 at a
desk, 18 at three metres.

**Two documented exceptions to "nothing moves":** on TV, the focused element
scales to `1.06` because focus *is* the cursor and must be legible at three
metres. And a user-requested disclosure may animate its own height — but the
trigger must stay exactly where it was.

**What changes mid-session is what breaks.** Fold, rotate, resize, detach,
switch from trackpad to touch — each must preserve scroll, selection, input,
playback, and focus.

---

## 6. How much to show

Full rules in `reference/disclosure.md`.

Every element spends from one fixed budget: the user's attention. Assign each
one a tier — **always visible** (5–7 max, one of them the primary action) ·
**one interaction away** (behind a visible, labeled control) · **in a dedicated
place** (settings, admin — a place with a name) · **deleted**.

**The cardinal rule: disclosure hides content, never the affordance that reveals
it.** The "More" button is always visible; what's inside it is not. The moment
the entry point disappears, you've stopped doing disclosure and started violating
Principle 8.

**Never disclosed, at any density:** cost, consequence, what data is collected,
what permission is granted, current state (saved/failed/offline), anything
required, and anything that failed. And never hide something *because* it's
unflattering — disclosure manages complexity, not accountability.

**Density budget** — simultaneously visible interactive elements: micro 1 ·
compact ≤5 · medium ≤9 · desktop ≤15 · TV ≤5 per row. Exceed one and you owe a
disclosure decision. The primary-action count is `1` at every size: more canvas
buys more content, never a second emphasis.

**Grouping:** by user intent, never by your architecture. ≤7 per group, one level
of nesting, most-used first, destructive last and separated. Every group gets a
noun phrase naming its outcome — never "Other" or "Misc", which is a confession
that the domain isn't understood yet. Never reorder by recency; a menu's value is
that it's the same tomorrow.

---

## 7. Accessibility — the floor, not a feature

- Body text ≥ 4.5:1. Large text and UI boundaries ≥ 3:1. Verify, don't estimate.
- Never color alone. Every status color pairs with an icon or a word.
- Focus is always visible: 2px ring, 2px offset, `--focus-ring`. Never `outline: none`.
- Full keyboard operation. Logical tab order. Escape closes. Enter commits.
  Focus traps in modals; focus returns to the trigger on close.
- Every icon-only control has an accessible name.
- Respect `prefers-reduced-motion` and `prefers-color-scheme`.
- Touch targets ≥44×44; directional-navigation targets ≥56px.
- Every element reachable by keyboard, and — where directional navigation
  applies — by up/down/left/right, with no traps and no unreachable corners.

---

## 8. Using this system

**In code (React + Tailwind).** Import `tokens/tokens.css` at the app entry, add
the preset to `tailwind.config.js`, put `data-theme` on `<html>` (plus
`data-surface` for TV, watch, or widget). Then build only from semantic classes:
`bg-page`, `text-fg-secondary`, `border-line`, `rounded-control`, `h-control-md`,
`p-page`. If you type a bracket value like `text-[15px]`, you've left the system.

Capability variants come with the preset: `can-hover:` · `touch:` · `fine:` ·
`tv:` · `watch:` · `widget:` · `folded-h:` · `reduced-motion:`. Branch on those,
never on a device check.

**In Figma.** Use a compatible token importer for `tokens/tokens.json` — `semantic` becomes a
collection with Light and Dark modes, so a frame flips themes by switching mode.
Build component sets whose variants are the *states* above, and bind every fill,
stroke, and radius to a variable. Never a raw hex on a layer.

**Figma components.** When the Minimal library is available in your Figma
workspace, use its component instances and semantic variables. A public Figma
file may need to be duplicated into your workspace before you can use its
components. Library publishing depends on your Figma plan and workspace.
If the library is unavailable, follow the included component, icon, and token
references to build the needed components. Use the Figma tools available in
your environment.

**In specs and prompts.** Don't restate visual rules — reference this system and
spend the words on the job to be done. Use `reference/spec-template.md`. A spec
that says "primary button" is shorter *and* more precise than three sentences
describing black rounded rectangles, because the token behind it is already
settled.

**Before shipping.** Run `reference/checklist.md`. It's the principles above
turned into pass/fail questions.

---

## 9. Design crit — run this after every implementation

Building the screen is not the last step. After implementing any UI against
this system — a new screen, a meaningful edit to an existing one — run a crit
pass before calling it done. Full checklist in `reference/design-crit.md`;
short form:

1. **Re-read the screen cold**, as if seeing it for the first time. Name the
   one thing it's for. If you can't in one sentence, Principle 1 failed.
2. **Walk every principle in §1 against this specific screen**, not in the
   abstract — "does *this* button move," "is there all caps *anywhere on this
   screen*," "are these two dropdowns the same width." A principle that isn't
   checked against the actual pixels doesn't catch anything.
3. **Look for anything that can be deleted.** A container that isn't holding
   one object, a divider next to a gap that already reads as separate, a label
   restating what the field already shows, a second visual weight competing
   with the primary action. Removing something and confirming nothing broke is
   the single highest-value move in a crit.
4. **Look for anything that can be enlarged or simplified instead of added.**
   Could this slider take the full row? Could two steps become one field? Could
   the empty space at the bottom of the window instead be the window's edge?
5. **Act on what you find.** A crit that produces a list but no edits was a
   waste of a pass — fix what's found, then confirm the fix didn't introduce a
   new violation elsewhere (a wider dropdown that now collides with its
   neighbor, for instance).
6. **Re-run once.** If the second pass finds nothing, stop — a system this
   constrained converges fast, and hunting for a fourth or fifth issue past
   that point is usually second-guessing, not craft.

This applies to every surface, not just Figma: a generated React screen, a
spec document, a component built in code — all get the same cold read before
they're considered finished.

---

## 10. Changing the system

Add a token only when a real product need has no expression in the current set,
and add it as a *semantic* token, never a one-off primitive. Adding a color
requires deleting one or justifying why the system needed more color. Adding a
line weight or a radius value is almost always a mistake — the constraint is the
product.

**A new surface is not a new system.** When something genuinely new arrives —
another form factor, another input — place it on the four axes and it should
already be covered. If it isn't, extend an axis. Never fork the system.

---

## Reference files

- `reference/components.md` — every component, every state, with values.
- `reference/motion.md` — the interaction contract. Hover, press, focus and
  timing for every interactive element. **Read before building any control.**
- `reference/design-crit.md` — the post-implementation review pass. Run this
  after building any screen, before calling it done.
- `reference/icons-and-illustrations.md` — the 221-icon set, the 31 line-art
  illustrations, the three line weights, and when icon-only is allowed.
- `reference/sizing.md` — small/medium/large across every family, and which type
  step to use where.
- `reference/taxonomy.md` — which component to reach for when platforms disagree
  on the name. Read this before building a new one.
- `reference/surfaces.md` — how the system adapts across every screen and input.
- `reference/disclosure.md` — how much to show, and where the rest lives.
- `reference/checklist.md` — the pre-ship design review.
- `reference/spec-template.md` — scaffold for product specs and build prompts.
- `LICENSE-AND-ASSETS.md` — provenance and licensing. Everything is free for
  commercial use and redistribution; the icon set is original work.
- `tokens/tokens.css` · `tokens/tokens.json` · `tokens/tailwind.preset.js`


---

# Bundled reference and token files

## Bundled file: LICENSE-AND-ASSETS.md

````markdown
# Minimal — Licensing & Asset Provenance

Everything in this system is free for commercial use, free to modify, and free to
redistribute. Nothing here requires payment, attribution in your UI, or a licence
review before you ship.

This file exists so that if someone ever asks, you can answer in one page.

---

## Summary

| Asset | Source | Licence | Commercial use | Redistribute | Cost |
|---|---|---|---|---|---|
| **Design tokens** | this system | yours | yes | yes | £0 |
| **Icon set** | **drawn from scratch here** | yours | yes | yes | £0 |
| **Component designs** | this system | yours | yes | yes | £0 |
| **Plus Jakarta Sans** | Tokotype | **SIL OFL 1.1** | yes | yes | £0 |
| **Inter** (fallback) | Rasmus Andersson | SIL OFL 1.1 | yes | yes | £0 |
| **System stack** (fallback) | OS-provided | n/a — never embedded | yes | n/a | £0 |

---

## Typeface — Plus Jakarta Sans

Licensed under the **SIL Open Font License 1.1**, the most permissive font
licence in common use. Under OFL you may:

- use it in commercial products, unlimited seats, unlimited pageviews
- embed it in apps, websites, PDFs and binaries
- modify it and redistribute the modification
- bundle it inside a product you sell

The only OFL conditions, none of which affect normal use:

1. You may not sell the font **by itself**. Selling a product that includes it is
   fine.
2. If you modify and redistribute the font files, the derivative must also be OFL
   and must not use the reserved name "Plus Jakarta Sans".
3. Include the OFL text alongside the font files when you redistribute them.

Practically: ship `PlusJakartaSans-*.woff2` plus its `OFL.txt` in your assets
folder and you are done. No attribution in your UI is required.

Get the files from Google Fonts or the Tokotype GitHub repository. **Self-host
them** — don't hotlink the Google Fonts CDN, which adds a third-party request and
a GDPR question you don't need.

```
/public/fonts/
  PlusJakartaSans-Regular.woff2      (400)
  PlusJakartaSans-Medium.woff2       (500)
  PlusJakartaSans-SemiBold.woff2     (600)
  OFL.txt
```

Only three weights. The system has no bold in the UI, so don't ship one.

```css
@font-face {
  font-family: "Plus Jakarta Sans";
  src: url("/fonts/PlusJakartaSans-Regular.woff2") format("woff2");
  font-weight: 400; font-style: normal; font-display: swap;
}
/* repeat for 500 and 600 */
```

`font-display: swap` matters: it renders fallback text immediately rather than
holding a blank screen, which is the same 100ms principle as everything else here.

---

## Icons

**The icon set in this system was drawn from scratch.** It is not a fork, not a
subset, and not derived from any existing library — so there is no third-party
licence attached to it at all. It is yours outright.

That was a deliberate choice over importing an existing set. Even permissive icon
libraries (Lucide is ISC, Phosphor and Heroicons are MIT, Material Symbols is
Apache 2.0 — all genuinely fine) carry an attribution or notice obligation
somewhere in the chain, and every one of them is drawn to its own optical rules.
Drawing our own removes the obligation entirely *and* guarantees the icons match
the system's single 1.5px line weight.

**Scale caveat, stated honestly.** Drawing our own was the right call at ~220
icons. It is *not* the right call at 1,000+. Hand-drawing at that volume produces
a long tail of subtly-wrong shapes, and the legal benefit over an MIT/ISC library
is marginal — those licences already permit commercial use, modification,
redistribution, and shipping inside a product you sell. Their only obligation is
a licence file in your repo.

So: use the bespoke set as the core, and reach for **Lucide** (ISC, ~1,600 icons,
official free Figma plugin) for anything it doesn't cover. That is the
recommendation, not a fallback.

If you later want to supplement the set, these are safe:

| Library | Licence | Notes |
|---|---|---|
| Lucide | ISC | Closest match to this system's stroke and grid |
| Phosphor | MIT | Multiple weights; use the "regular" weight only |
| Heroicons | MIT | Tailwind's set; heavier optical weight |
| Radix Icons | MIT | 15px grid — will not align with a 16px system |
| Material Symbols | Apache 2.0 | Variable weight; needs tuning to match |

Whatever you add, **redraw it to a 16px grid at 1.5px stroke** or it will read as
imported.

---

## Figma library

Publishing this file as a shared library needs a paid Figma seat, which the
GG Studios plan already includes. There is **no additional cost** to publish, and
no per-file or per-consumer fee.

To publish: **Assets panel → Libraries → Publish**. Other files then subscribe
from the same menu. Anything you publish stays under your ownership; Figma claims
no rights over it.

If you later share the library outside your org, note that consuming a published
library requires the consumer to have a Figma seat. That is Figma's pricing, not
a licence on this system — the tokens and designs themselves remain free to
redistribute in any form.

---

## What is *not* included, deliberately

- **No stock photography.** The media containers use neutral placeholder fills.
  Every stock licence has terms; none are worth inheriting into a design system.
- **No third-party illustration.** Empty states use type and a single icon.
- **No brand assets.** Logo placement rules are defined; the logo is yours.
- **No analytics, no CDN dependencies, no runtime licence checks.** The system is
  a set of files. Nothing phones home.

---

## If you are ever asked

> The Minimal design system is original work. Its icon set was drawn in-house and
> carries no third-party licence. Its typeface, Plus Jakarta Sans, is licensed
> under the SIL Open Font License 1.1, which permits unlimited commercial use,
> embedding, modification and redistribution at no cost. No component of this
> system requires payment, attribution, or a licence renewal.
````

## Bundled file: examples/components.css

````css
@import "../tokens/tokens.css";

/* Scope the example's layout and controls so it can be adapted incrementally. */
.minimal-example {
  margin: 0;
  background: var(--surface-page);
  color: var(--text-primary);
  font-family: var(--font-sans);
}
.minimal-example * { box-sizing: border-box; }
.minimal-example main {
  max-width: var(--container-content);
  margin-inline: auto;
  padding: var(--s-10) var(--s-8);
}
.minimal-example h1 {
  margin: 0;
  font-size: var(--t-h1-size);
  line-height: var(--t-h1-lh);
  font-weight: 600;
}
.minimal-example p {
  color: var(--text-secondary);
  font-size: var(--t-body-size);
  line-height: var(--t-body-lh);
}
.minimal-example section { margin-top: var(--s-9); }
.minimal-example label { display: block; margin-bottom: var(--s-4); }
.minimal-example input, .minimal-example select {
  width: 100%;
  min-height: var(--control-h-md);
  padding: var(--s-5);
  border: var(--line) solid var(--border-control);
  border-radius: var(--r-control);
  background: var(--surface-control);
  color: var(--text-primary);
  font: inherit;
}
.minimal-example .actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s-4);
  margin-top: var(--s-8);
}
.minimal-example button, .minimal-example .secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: var(--control-h-md);
  padding: var(--s-4) var(--s-6);
  border: var(--line) solid transparent;
  border-radius: var(--r-control);
  background: var(--action-primary-bg);
  color: var(--action-primary-fg);
  font: inherit;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
}
.minimal-example .secondary {
  background: var(--action-secondary-bg);
  color: var(--action-secondary-fg);
  border-color: var(--action-secondary-border);
}
@media (hover: hover) and (pointer: fine) {
  .minimal-example button:hover { background: var(--action-primary-bg-hover); }
  .minimal-example .secondary:hover { background: var(--action-secondary-bg-hover); }
}
.minimal-example :focus-visible {
  outline: 2px solid var(--border-focus);
  outline-offset: 3px;
}
.minimal-example output { display: block; margin-top: var(--s-6); }
````

## Bundled file: examples/components.html

````html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Minimal component example</title>
  <link rel="stylesheet" href="components.css">
</head>
<body class="minimal-example">
  <main>
    <h1>Create a project</h1>
    <p>A small working example of Minimal typography, spacing, and controls.</p>
    <section aria-label="Appearance">
      <label for="theme">Appearance</label>
      <select id="theme">
        <option value="">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </section>
    <section aria-label="Project details">
      <form id="project-form">
        <label for="project-name">Project name</label>
        <input id="project-name" name="name" required maxlength="80" autocomplete="off">
        <div class="actions">
          <button type="submit">Create project</button>
          <a class="secondary" href="../SKILL.md">Read the skill</a>
        </div>
        <output id="result" aria-live="polite"></output>
      </form>
    </section>
  </main>
  <script>
    document.getElementById('theme').addEventListener('change', (event) => {
      if (event.target.value) document.documentElement.dataset.theme = event.target.value;
      else document.documentElement.removeAttribute('data-theme');
    });
    document.getElementById('project-form').addEventListener('submit', (event) => {
      event.preventDefault();
      const name = document.getElementById('project-name').value.trim();
      document.getElementById('result').textContent = name
        ? 'Preview created for ' + name + '. This example keeps data in this page only.'
        : 'Enter a project name.';
    });
  </script>
</body>
</html>
````

## Bundled file: reference/checklist.md

````markdown
# Minimal — Pre-ship Design Review

Every question is pass/fail. A "sort of" is a fail. Run this before any UI ships,
and run it against Figma mocks before they get built.

---

## The job

- [ ] I can state the user's job to be done in one sentence.
- [ ] Every element on this screen serves that job. Nothing is here out of habit.
- [ ] There is no step, field, click, or confirmation that could be removed.
- [ ] Nothing is asked of the user that could have been inferred or defaulted.

## Hierarchy & gaze

- [ ] A stranger names the most important element in under two seconds.
- [ ] Exactly one element is emphasized — one primary button, one focal point.
- [ ] Identity and home are top-left. Global actions are top-right.
- [ ] The commit action sits at the end of the reading path, not before it.
- [ ] The eye never has to backtrack to find the next step.
- [ ] Related things are near each other; unrelated things are visibly apart.
- [ ] Section gaps are visibly larger than the gaps inside a section.

## Stability

- [ ] Every control occupies the same position in every state.
- [ ] Loading does not change any element's size. Widths are locked.
- [ ] An appearing error or badge does not push anything else. Space is reserved.
- [ ] Buttons sit in the same place here as in every other screen of the product.
- [ ] The only transform on interaction is `scale(0.98)` on press.

## Visibility & comprehension

- [ ] Nothing interactive is invisible at rest. No hover-only discovery.
- [ ] Every interactive element is visually distinguishable from static content.
- [ ] Icon-only controls have both a tooltip and an accessible name.
- [ ] Every label is a plain verb phrase naming its outcome. No "OK" or "Submit".
- [ ] No jargon the user didn't bring with them.
- [ ] This works without a tutorial, tour, or coach mark.

## No dead ends

- [ ] Every state — including empty, loading, and error — has a way forward.
- [ ] Every state has a way back.
- [ ] The empty state names what's missing and offers the action that fills it.
- [ ] Errors say what happened, what state the data is in, and what to do next.
- [ ] There is a retry, and it's a real button.

## Reversibility & data safety

- [ ] Reversible actions offer undo rather than a confirmation dialog.
- [ ] Multi-step flows have a working back affordance.
- [ ] In-progress input survives navigation, refresh, and accidental close.
- [ ] Nothing the user typed can be lost by a single misclick.

## Guarding the irreversible

- [ ] Destructive actions are ≥24px from their neighbors.
- [ ] The destructive confirm is not the auto-focused control.
- [ ] Irreversible actions require a deliberate second act.
- [ ] A rapid double-click cannot fire the action twice.
- [ ] The consequence is stated honestly, including what cannot be recovered.

## Feedback & honesty

- [ ] Visible response to every input within 100ms.
- [ ] Waits are matched to the right affordance (nothing / spinner / percentage).
- [ ] No fake progress. No bar parked at 99%.
- [ ] No disabled control without a visible reason for being disabled.
- [ ] Success is confirmed exactly once — not by a toast *and* a button state.
- [ ] Nothing important is communicated only by a toast.

## Color & motion

- [ ] Green, amber, and red appear only as success, warning, and error.
- [ ] Every colored status is also carried by a word or an icon.
- [ ] No hex values in the code. Every color is a semantic token.
- [ ] Nothing moves unless the user caused it or is waiting on it.
- [ ] Only `opacity`, `transform`, and color properties animate.
- [ ] The screen is calm at rest.

## System consistency

- [ ] One line weight: 1px, everywhere.
- [ ] Radius follows the system: 4 chips/checkboxes, 8 controls, 16 cards/
      modals/popovers. No 10, 14, or 20 anywhere — those belong to the old scale.
- [ ] Every spacing value is a multiple of 4, preferably 8.
- [ ] Type comes from the scale. No arbitrary sizes, no bracket values.
- [ ] No text set in all caps, anywhere on the screen — except a proper noun,
      acronym, or file name (`SKILL.md`, API), which is spelled that way
      regardless of case.
- [ ] No orphaned single word or single letter on the last line of a
      paragraph, heading, button label, or wrapped title.
- [ ] Font size, weight, and color are drawn only from the named tokens —
      never a size, weight, or gray invented for one screen.
- [ ] Light and dark both verified. Page is pure white / very dark gray.
- [ ] Dark mode expresses elevation by surface lightness, not shadow.
- [ ] A user who knows another one of my products already knows this screen.
- [ ] Every component is a library instance — nothing was redrawn freehand.

## Grouping & space

- [ ] Every divider earns its place — a table's rows, a dense settings list —
      not decorating a gap that's already visibly a gap.
- [ ] Every solid grouping box (card/panel) holds exactly one real object,
      not a cluster of unrelated controls boxed "to be safe."
- [ ] Grouping boxes show their edge with a fill difference (or a blur, over
      background content) — not an outline, unless the grouping itself is
      deliberately meant to draw the eye.
- [ ] No container nests inside another container more than one level.
- [ ] Covering every line and border with a thumb, the groups are still
      readable from spacing alone.
- [ ] Every dropdown/select/input near another one on this page shares the
      same width — none has shrunk to fit its own value.
- [ ] Sliders and other room-hungry controls use the full width available to
      them on canvases that have the room.
- [ ] No dead whitespace at the bottom or trailing edge of the window unless
      the surface is a fixed-viewport app shell that intentionally fills it.
      Widgets, popovers, and panels hug their content.

## Filled controls, not outlined

- [ ] Inputs, selects, and search fields are identified by a fill difference
      (`--surface-control`) at rest — not a border.
- [ ] `--border-control` appears only on the documented exceptions: an
      unchecked checkbox/radio/switch, a Secondary button, or a control
      forced to sit on a surface sharing its own fill.
- [ ] Primary and Danger buttons carry no visible border in any state.
- [ ] Focus is shown with a ring, not by adding a border to the control.

## Surfaces

- [ ] Every target meets its modality's minimum: pointer 32, touch 44×44, TV 56.
- [ ] Hit areas grew; visible boxes did not.
- [ ] Nothing is discoverable only by hover, only by gesture, or only in a tooltip.
- [ ] Hover states are wrapped in a hover-capable query so they can't latch after
      a tap.
- [ ] I dragged the window through every canvas class and nothing broke.
- [ ] Class changes add or rearrange content — they don't merely stretch it.
- [ ] Safe-area insets respected on every edge; nothing interactive under a
      notch, home indicator, rounded corner, or outside TV safe area.
- [ ] Nothing important sits across a fold.
- [ ] Type never drops below its distance floor: 13 wrist, 12 desk, 18 at 3m.
- [ ] Fold, rotate, resize, detach, and input switch each preserve scroll,
      selection, input, playback, and focus.
- [ ] Directional navigation reaches every element, with no traps or dead corners.
- [ ] Glanceable surfaces show stale data with a timestamp instead of a spinner.
- [ ] The product is recognisably the same on the smallest and largest surface.

## Disclosure & density

- [ ] Every element is assigned to a tier, deliberately.
- [ ] Tier 1 is within the density budget for the *smallest* supported canvas.
- [ ] Exactly one primary action — at every canvas class.
- [ ] Every disclosure's trigger is visible at rest and clearly labeled.
- [ ] No cost, consequence, permission, data use, current state, required field,
      or error is hidden behind a disclosure.
- [ ] Nothing is hidden because it's unflattering.
- [ ] Groups are named for outcomes. No "Other", no "Misc".
- [ ] Groups hold ≤7 items, nested at most one level, in stable order.
- [ ] Menus don't reorder themselves by recency or usage.
- [ ] Search and deep links reach every tier, including Tier 3.
- [ ] A problem inside a closed control is badged on the closed trigger.
- [ ] Reveal motion moves the content; the trigger stays put.

## Access

- [ ] Body text ≥ 4.5:1. Large text and UI boundaries ≥ 3:1. Measured, not guessed.
- [ ] Fully operable by keyboard, in a logical order.
- [ ] Focus is visible on every focusable element. `outline: none` appears nowhere.
- [ ] Modals trap focus and return it to the trigger on close.
- [ ] Escape closes. Enter commits.
- [ ] `prefers-reduced-motion` and `prefers-color-scheme` respected.

## The last look

- [ ] Nothing here is decoration.
- [ ] If I removed one more element, the screen would get worse — not better.
- [ ] I would be happy to have my name on this.
````

## Bundled file: reference/components.md

````markdown
# Minimal — Components & Interaction Reference

Every component, every state, with values. Token names refer to `tokens/tokens.css`.

**Four laws that apply to everything below:**

1. The box never resizes between states. Reserve space for what might appear.
2. Response to input is visible within 100ms.
3. Nothing animates except `opacity`, `transform`, `background-color`,
   `border-color`, `color`, `box-shadow`, `filter`. The one exception is a
   user-requested disclosure animating its own height — and even then the
   trigger stays put (`reference/disclosure.md`).
4. Components don't branch on device. They read tokens that adapt by capability.
   Sizes below are the **pointer baseline**; `tokens.css` raises them under
   `@media (any-pointer: coarse)` and under `[data-surface="tv"]`
   (`reference/surfaces.md`).

**Writing hover states.** Always gate them:
`@media (hover: hover) and (pointer: fine)`, or `can-hover:` in Tailwind. On
touch, `:hover` latches after a tap and leaves the control looking permanently
hovered.

---

## Button

### Geometry

| Size | Height (pointer) | Touch | TV | Padding X | Gap | Type | Icon |
|---|---|---|---|---|---|---|---|
| sm | 32px | 40px | 48px | 12px | 6px | `label` 14/20 · 500 | 14px |
| md | 40px | 44px | 56px | 16px | 8px | `label` 14/20 · 500 | 16px |
| lg | 48px | 52px | 64px | 20px | 8px | `title` 17/24 · 600 | 18px |

Use `var(--control-h-md)` — the columns above resolve automatically. Icon-only
buttons are square at the same height.

Radius `8px` at every size (`12px` on TV, `16px` on watch — larger radii sit
better inside a curved display). Border `1px` on secondary only — it's the
one variant with no fill at rest, so the border is its whole affordance.
Primary, danger, and tertiary carry a `1px solid transparent` border so all
variants share identical outer dimensions and never shift by a pixel when a
variant swaps; primary and danger stay filled and borderless in every real
state — the transparent border exists purely for geometry, not to imply an
outline is coming.

Touch: minimum 44×44 hit area. Achieve it with a transparent pseudo-element (the
`.hit-target` helper in `tokens.css`), never by growing the visible box — so the
layout is pixel-identical whether a finger or a mouse is pointing at it.

**On watch:** one primary action per screen, full width, ≥44pt. No secondary
buttons beside it — stack or move to another screen.

**On TV:** focus replaces hover entirely. The focused button takes
`scale(1.06)` + `--shadow-e3` + a 2px `--focus-ring` border. Reserve the scale
headroom in the grid so neighbours never reflow.

### State matrix

**Primary — light**

| State | Background | Text | Transform | Other |
|---|---|---|---|---|
| Default | `--n-950` #0E0E10 | `#FFFFFF` | none | |
| Hover | `--n-800` #26262A | `#FFFFFF` | none | 120ms `standard` |
| Focus-visible | default | `#FFFFFF` | none | 2px ring `--focus-ring`, 2px offset |
| Press | `--n-950` #0E0E10 | `#FFFFFF` | `scale(0.98)` | 90ms |
| Disabled | `--n-100` #F1F1F3 | `--n-400` #A5A5AE | none | `cursor: not-allowed`; reason required |
| Loading | default | label at `opacity: 0` | none | spinner centered; `aria-busy="true"` |
| Processing | default | "Uploading… 42%" | none | determinate fill, see below |
| Success | `--status-success-solid` | `#FFFFFF` | none | check icon, 1200ms, then back to default |

**Primary — dark**: `#FFFFFF` bg / `#0E0E10` text; hover `#DEDEE2`; press returns
to `#FFFFFF` + `scale(0.98)`; disabled `#232327` bg / `#5A5A62` text.

> **The law:** hover moves the fill one step *toward mid-gray* — black lightens,
> white dims. It reads as the surface lifting toward you. Press returns the fill
> and applies `scale(0.98)` — it reads as pushing down. Identical metaphor in
> both themes, so muscle memory transfers between them.

**Secondary (outline)**

| State | Background | Border | Text |
|---|---|---|---|
| Default | transparent | `--action-secondary-border` | `--action-secondary-fg` |
| Hover | `--action-secondary-bg-hover` | `--action-secondary-border-hover` | unchanged |
| Focus-visible | default | default | + 2px ring, 2px offset |
| Press | `--action-secondary-bg-active` | hover border | unchanged, `scale(0.98)` |
| Disabled | transparent | `--border-subtle` | `--text-disabled` |
| Loading | default | default | label `opacity: 0` + spinner |

**Tertiary (ghost)** — the shape appears on hover, exactly as intended.

| State | Background | Text |
|---|---|---|
| Default | transparent, no border | `--action-tertiary-fg` |
| Hover | `--action-tertiary-bg-hover` — 8px radius fades in over 120ms | unchanged |
| Focus-visible | transparent | + 2px ring |
| Press | `--action-tertiary-bg-active`, `scale(0.98)` | unchanged |
| Disabled | transparent | `--text-disabled` |

The hover shape uses the same 8px radius as every other control, so the ghost
button is revealed as *the same object* the other buttons are.

**Danger** — `--action-danger-bg` solid, white text, hover
`--action-danger-bg-hover`. Only for irreversible destruction. Never
default-focused. See *Destructive confirmation* below.

### Loading, processing, success

**Spinner:** 16px box (14px in sm), 1.5px stroke, 25%-opacity track ring with a
90° arc in `currentColor`, `rotate 700ms linear infinite`.

**Width locking** — this is how the button doesn't move:

```jsx
<button className="relative ..." aria-busy={loading} data-loading={loading}>
  {/* Label stays in the DOM at opacity 0 — it holds the width open. */}
  <span className={loading ? "opacity-0" : "opacity-100 transition-opacity duration-fast"}>
    {children}
  </span>
  {loading && (
    <span className="absolute inset-0 grid place-items-center">
      <Spinner />
    </span>
  )}
</button>
```

Never `{loading ? <Spinner/> : label}` — that collapses the width and the button
jumps.

**Choosing the right wait affordance:**

| Duration | Show |
|---|---|
| < 300ms | Nothing. Just complete. A flashed spinner reads as a glitch. |
| 300ms – 1s | Nothing on the button; disable re-submit only. |
| 1s – 3s | Indeterminate spinner in place of the label. |
| > 3s | **Processing**: determinate — real percentage or step count in the label, plus a subtle progress fill behind it (`--action-primary-bg-hover` growing left→right). Never fake the number. |
| > 10s | Move the work out of the button entirely — a progress row or toast — and give the user their interface back. |

**Success state** is only for actions with no other confirmation. If a toast, a
route change, or new content already confirms it, skip it — two confirmations of
one event is noise. When used: swap to a check icon for 1200ms, then return.

**Loading is not disabled.** Use `aria-busy` + `pointer-events: none`, keeping
the button focusable. A disabled control loses focus and strands keyboard users.

### Button rules

- One primary per view. If you want two, one is secondary.
- Order in a row: primary is **last** in the reading path (rightmost) — the eye
  ends on the commit action. Destructive sits far-left with ≥24px separation.
- Label is a verb phrase naming the outcome: "Save changes", "Delete project",
  "Send invite". Never "OK", "Submit", "Yes".
- Never disable without an adjacent reason. Better: leave enabled and explain the
  problem on click.
- Guard against double-fire — ignore repeat activations while `aria-busy`.

---

## Icon button

Square, radius 8, same variants and states as Button. Requires `aria-label`
**and** a tooltip after 400ms hover. Icon 16px (md) / 18px (lg), stroke 1.5px to
match the system's single line weight. Never use an icon-only button for a
destructive or rare action — those get words.

**Tooltips don't exist on touch or TV.** So an icon-only button is only
acceptable where the icon is universally understood (close, search, back) or
where a text label appears nearby. On compact canvases, prefer icon + label for
anything else — you have the width you saved by having fewer actions.

---

## Text field / textarea / select / search

Height 40 (md), radius 8, **no border at rest**, background `--surface-control`,
padding 12px, `body` 15/22. Search fields and select triggers share this exact
spec — one filled-control language for every field-shaped thing in the system.

| State | Fill | Border | Notes |
|---|---|---|---|
| Default | `--surface-control` | none | placeholder `--text-tertiary` |
| Hover | `--surface-control-hover` | none | 120ms |
| Focus | `--surface-control` | none | + 2px ring, 2px offset — the ring, not a border, is the focus affordance |
| Filled | `--surface-control` | none | value `--text-primary` |
| Error | `--status-danger-bg` (light red wash) | none | message below + 14px alert icon in `--status-danger-fg` |
| Disabled | `--surface-sunken` | none | text `--text-disabled` |
| Read-only | `--surface-sunken` | none | no ring, still selectable |

An empty field is identified by its **fill**, not an outline: `--surface-control`
is a deliberate, visible step off `--surface-page`, and that step has to clear
the same ≥3:1 boundary contrast a border used to carry — the requirement didn't
relax, the technique changed. If a field ever has to sit on a surface that
already shares `--surface-control`'s own fill (rare — mainly an inline-editable
cell inside a table that's already using that tone), fall back to
`1px --border-control`; that's the documented exception, not the default.

**Layout:** label above (`label` 14/20 · 500, `--text-secondary`), 6px gap, field,
6px gap, helper or error text (`caption` 13/18).

**Reserve the message row.** Give the helper/error slot a fixed `min-height:
18px` from the start so an error appearing never pushes the submit button down.

**Validation timing:** validate on blur, not on keystroke. Once a field is in
error, re-validate on input so the error clears the instant it's fixed. Never
show an error for a field the user hasn't reached yet.

**Error copy** says what's wrong and what to do: "Enter a date after today", not
"Invalid input".

---

## Checkbox · radio · switch

These three are the system's documented exception to "controls are filled, not
outlined" (see §2 Tokens, `--border-control`). At 16–26px, a fill difference
against an arbitrary background can't be relied on to clear 3:1 the way it can
in a 40px input — so the unchecked state is identified by its outline instead,
on purpose, not by oversight.

- Checkbox 18×18, radius 4. Unchecked: `1px --border-control` on page
  background. Checked: fill `--action-primary-bg`, white check, 120ms; the
  check draws with a 60ms path animation.
- Radio 18×18, radius full, `1px --border-control` unchecked, 5px inner dot
  scaling in from 0.
- Switch 44×26, radius full. Off: `--surface-control` track with a
  `1px --border-control` outline — the track is large enough that fill alone
  almost carries it, but the outline is kept as the last function-required
  exception rather than risk it failing at 3:1 against light backgrounds. On:
  `--action-primary-bg`, no outline — a filled, saturated track needs no
  border to read as "on." Knob 22px white, travels 180ms `standard` — the only
  element in the system permitted to translate on state change, because the
  travel *is* the meaning.
- All three: 44×44 hit area, label is clickable, focus ring on the control.
- Switches apply immediately (with undo if consequential). Checkboxes wait for a
  commit action. Don't mix the two metaphors in one form.

---

## Card

`--surface-raised` + `1px --border-elevated` + `--shadow-e1`, radius 16,
padding 20 or 24. `--border-elevated` is transparent in light — the fill and
shadow alone carry the edge — and a hairline in dark, where shadow barely
reads; see Surfaces in §2. This is a Raised surface, and it's the same object
Principle 10 means by "a solid box for grouping": one card, one real object.

Interactive cards only: hover raises to `--shadow-e2` over 180ms. **No lift
transform** — a translating card disturbs its neighbors' apparent alignment.
Press: `scale(0.995)`. Don't add an outline on hover — a card announcing
itself as clickable is a shadow and fill change, never a border appearing
from nothing.

If a card is clickable, the whole card is clickable, and its title is the
accessible link. Don't put competing buttons inside a clickable card.

---

## Modal / dialog

Scrim `--surface-scrim`, fades in 180ms. Panel `--surface-overlay` +
`1px --border-elevated` (transparent in light, hairline in dark), radius 16,
`--shadow-e3`, max-width 480 (confirm) / 640 (form), padding 24.

Entry: `opacity 0→1` + `scale(0.96)→1` over 260ms `entrance`.
Exit: reverse over 180ms `exit`. Things leave faster than they arrive.

Structure top→bottom: title (`h3`), body (`body`, `--text-secondary`), actions
row bottom-right with secondary then primary.

Requirements: focus moves into the dialog on open and returns to the trigger on
close; focus is trapped; Escape closes; the scrim closes only non-destructive
dialogs; background scroll is locked; `role="dialog"` + `aria-modal` +
`aria-labelledby`.

**On compact, a modal becomes a bottom sheet.** Same content, same actions,
anchored to the bottom edge so it sits in thumb reach: `--r-xl` on the top
corners only, a drag handle, and padding that clears `--safe-bottom`. Dismissible
by swipe *and* by a visible control — a gesture alone is invisible (Principle 8).

**On watch and TV, don't stack.** Depth is navigation, not layering: push a full
screen instead. A modal over a modal is never correct on either.

### Destructive confirmation

For anything irreversible:

- Title names the object and the consequence: "Delete *Q3 Roadmap* permanently?"
- Body states what is lost and whether it can be recovered. Be honest — if
  there's no backup, say there's no backup.
- Confirm button is **danger** variant, is **not** auto-focused (focus lands on
  Cancel), and is separated from Cancel by ≥24px.
- For high-stakes deletion, require typing the object's name, or hold-to-confirm:
  an 800ms press that fills the button, cancels on early release.
- Prefer skipping the dialog entirely in favor of a 5-second undo toast wherever
  the action is technically reversible. Undo beats confirm.

---

## Toast

Bottom-center (mobile) or bottom-right (desktop), width 360, radius 16,
`--surface-overlay` + `--shadow-e2` + `1px --border-elevated`, padding 12–16.

Enter: `translateY(8px)→0` + fade, 260ms `entrance`. Exit: fade + 4px down, 180ms.
Stack max 3, newest at the bottom, older ones shift with the same 260ms curve.

Duration: 4s neutral · 4s success · 6s warning · **errors do not auto-dismiss**.
Any toast offering an undo lives at least 5s and pauses its timer on hover or focus.

Leading status icon in `--status-*-fg`; text `body` 15/22. One action maximum,
tertiary variant, right-aligned. Never put critical information only in a toast —
it will be missed.

---

## Tooltip

`--surface-inverse` background, `--text-inverse` text, `caption` 13/18, padding
6×10, radius 8. Appears after 400ms hover (0ms if another tooltip is already
open), 0ms on keyboard focus. Fades in 120ms. 8px offset from its trigger.

Tooltips clarify; they never carry information the user needs to complete the
task. If it's required, put it on the page.

---

## Menu / dropdown / popover

`--surface-overlay`, radius 16, `--shadow-e2`, `1px --border-elevated`
(transparent in light, hairline in dark), 6px padding. Items 36px tall, radius
8, 10px horizontal padding, `body` 15/22.

Item hover `--surface-hover`, active `--surface-active`, selected
`--surface-selected` + a check on the left. Destructive items use
`--status-danger-fg` text and sit in their own group at the bottom, separated by
a 1px `--border-subtle` divider with 6px above and below.

Enter: fade + `scale(0.98)→1`, 180ms `entrance`, `transform-origin` at the
trigger edge — so it visibly comes *from* the button that opened it.

Keyboard: arrows move, Home/End jump, typing jumps to match, Escape closes and
returns focus, Enter activates.

---

## Tabs

Underline style. Tab label `label` 14/20 · 500. Inactive `--text-secondary`,
active `--text-primary`. 2px indicator in `--text-primary` that **slides**
between tabs over 260ms `standard` — the one place motion explains a
relationship rather than just confirming a touch.

Reserve the indicator's 2px track at all times so the row never shifts height.
Tab order is stable; never reorder tabs based on usage.

---

## Table

Header row: `--surface-sunken`, `micro` 11/14 · 500, uppercase,
`--text-tertiary`, 36px tall, sticky on scroll.
Body rows: 48px, 1px `--border-subtle` between, hover `--surface-hover` (120ms).

Numbers right-aligned and tabular (`font-variant-numeric: tabular-nums`); text
left-aligned. Row actions live in a right-most column, tertiary icon buttons,
visible at rest at `--icon-secondary` and reaching full contrast on row hover —
**visible at rest**, never hover-only. On coarse pointers they render at full
strength permanently, since there is no hover to strengthen them.

Row height reads `var(--row-h)`: 48 pointer, 56 touch, 72 TV.

**Below `medium`, a table is not a table.** Collapse each row into a stacked
card: the identifying column becomes the title, two or three supporting values
become labeled lines, and row actions move into a single overflow control.
Horizontal scrolling a data table on a phone is a dead end — the columns that
matter are the ones off screen.

Selection: checkbox column at the left; when any row is selected, a 48px action
bar appears in reserved space above the table, never overlaying the header.

Sort indicator is a 12px arrow next to the header label; only one column sorts
at a time.

---

## Badge / status

Height 22, radius 4, padding 0 8, `caption` 13/18 · 500. Background
`--status-*-bg`, text `--status-*-fg`, 1px `--status-*-border`.

Always pair the color with a word, and add a 12px icon when the badge appears
among many others. Color alone is not a status.

---

## Progress

**Linear:** 4px track `--surface-active`, fill `--action-primary-bg`, radius full.
Width transitions 260ms `standard`. Determinate whenever a real number exists.
Pair with a text percentage for anything over 5 seconds.

**Indeterminate:** a 30%-width segment traversing the track on a 1400ms
`standard` loop. Use only when progress genuinely can't be measured.

Never let a progress bar sit at 99%. If you can't measure, don't pretend to.

---

## Skeleton / empty / error — the three states people forget

**Skeleton.** Match the real content's geometry exactly so nothing shifts on
load. `--skeleton-base` fill, radius matching the element, with a
`--skeleton-sheen` gradient sweeping across on a 1400ms loop. Show skeletons only
after ~200ms of waiting — a flashed skeleton is worse than a blank moment. Never
skeleton more than one screenful.

**Empty state.** Centered in the content area, max-width 360:

- A restrained mark or icon at `--icon-secondary`, 32px, or nothing at all.
- Title (`title` 17/24) naming what would be here: "No projects yet".
- One line (`body`, `--text-secondary`) explaining what appears here and why.
- One primary button doing the thing that fills it.

An empty state without an action is a dead end — Principle 14 violation.

**Error state.** Say what happened, in what state the data now is, and the one
thing to do next. Provide the retry as a real button. Include a copyable error
reference for anything a human might need to report. Never a bare "Something went
wrong."

---

## App shell & navigation

Every product has the same skeleton:

- **Top bar, 56px**, `--surface-page` with a 1px bottom border that appears only
  once the content scrolls beneath it. Padded by `--safe-top`.
- **Top-left:** the home affordance — wordmark or product name, always clickable,
  always returning to the start point. Same position on every screen.
- **Top-right:** the global cluster — search, notifications, account. Grouped with
  8px gaps, separated from everything else by ≥24px. This is where users will
  look, so this is where these things live, in every product, forever.
- **Back:** on any drill-down, a back affordance at the top-left of the content
  area (not the browser's). Breadcrumbs when nesting exceeds two levels.
- **Current location** is always indicated. A user must never have to guess where
  they are.

Route transitions: cross-fade 180ms, or nothing. Never slide whole pages — it
implies a spatial model most apps don't actually have.

### Navigation by canvas class

| Class | Pattern |
|---|---|
| micro | None. One view; the system provides back. |
| compact | Bottom tab bar (≤5 destinations) or top bar + drawer. Bottom bar clears `--safe-bottom`. |
| medium | Navigation rail, 80px, icons + labels. |
| expanded | Rail or sidebar, 240–280px. |
| large / xlarge | Persistent sidebar, plus an optional supplementary pane. |
| TV | Left rail or top nav, focus-driven, no hover. |

The destinations and their order are **identical** at every class. Only the
presentation changes — a user who learns the phone app knows the desktop one.

**Frequent actions belong in thumb reach on compact.** A bottom action bar or a
floating primary action is correct there; the top-right cluster stays where it is
for account, search, and settings. Findability and reachability are different
problems, and they have different answers.

---

## Disclosure controls

**Overflow menu (⋯).** A tertiary icon button opening a menu. Use for 3+
secondary actions on a row or item. Order by frequency, destructive last and
separated. If something inside needs attention — an error, an expired credential
— badge the *closed* trigger; a problem hidden behind a menu is a dead end.

**Accordion / disclosure section.** Header is a full-width button, `--r-control`,
with a chevron on the right that rotates 180° in sync with the panel. Header
carries `aria-expanded` and controls the panel by id. The header **never moves** —
only the content below it does. Use the `.disclosure` grid technique in
`tokens.css`; see `reference/disclosure.md` for the motion spec.

**"Show advanced".** A tertiary button beneath the standard fields. Only valid
when the defaults are genuinely safe — a required field is never advanced. If the
user has ever changed something inside, remember it open next visit.

**Contextual toolbar.** Appears in *reserved* space when a selection exists,
never as an overlay that covers content. Fades in over 180ms; the space is held
from the start so nothing below shifts.

Pattern selection, tiering, grouping rules, and per-canvas density budgets are in
`reference/disclosure.md`.

---

## Composition checklist for any new screen

1. Name the job to be done in one sentence.
2. Identify the single most important element. Give it the hierarchy.
3. Place identity top-left, global actions top-right, commit action at the end of
   the reading path — and frequent actions in thumb reach on compact.
4. Group by proximity: 8 within, 16 between, 32 across sections.
5. Assign every element a disclosure tier; check Tier 1 against the density
   budget for the **smallest** canvas you support, not the largest.
6. Design the empty, loading, and error states *before* the happy path.
7. Confirm every element has a resting affordance and every state has an exit.
8. Reserve space for anything that can appear (errors, badges, spinners,
   selection toolbars).
9. Add motion only where the user is touching or waiting.
10. Walk it across every canvas class, and check what survives a fold, a rotate,
    and a switch from trackpad to touch.
11. Run `checklist.md`.
````

## Bundled file: reference/design-crit.md

````markdown
# Minimal — Design Crit

A short, repeatable review pass to run **after implementing any screen**,
before it's considered done — Figma, React, or a spec document. The goal is
to catch the gap between "follows the tokens" and "is actually minimal,"
which are not the same thing. A screen can use every correct color and still
be cluttered.

Run this once, act on what it finds, then run it once more. Two passes is
almost always enough; a system this constrained converges fast.

---

## Pass 1 — cold read

Look at the finished screen as if for the first time, not as the sum of the
decisions that built it.

- What is this screen for? One sentence. If it takes two, Principle 1 failed
  and something needs to be demoted.
- Where does the eye land first? Is that the thing that should win?
- What would a stranger click first? Is that the primary action?

## Pass 2 — walk the principles against the pixels

Don't check these in the abstract — point at the actual screen for each one.

**Hierarchy & emphasis**
- [ ] Exactly one primary button is visible.
- [ ] Nothing else on the screen has comparable visual weight to it.
- [ ] The reading order is left→right, top→bottom; nothing forces backtracking.

**Typography**
- [ ] No text is set in all caps, anywhere on the screen, except a proper
      noun, acronym, or file name (`SKILL.md`, API) — check labels, nav,
      table headers, and status chips specifically; these are where caps
      creep back in.
- [ ] No bracket/arbitrary font sizes, weights, or one-off grays — every text
      node maps to a named step, one of the three weights, and a named
      `--text-*` color.
- [ ] No orphan: no paragraph, heading, button label, or wrapped title ends
      its last line with a single word or letter standing alone.
- [ ] No more than two lines of centered text.

**Grouping — the part most likely to drift**
- [ ] Every divider on the screen earns its place — a table's rows, a dense
      settings list — not decorating a gap that's already 24px+.
- [ ] Every solid grouping box (card/panel) holds exactly one real object (a
      record, a card, a message) — not a cluster of unrelated controls boxed
      together "to be safe."
- [ ] Grouping boxes show their boundary with a fill difference — or a blur,
      if the box sits over dynamic background content — not an outline,
      unless the grouping is deliberately meant to draw the eye.
- [ ] No container is nested inside another container more than one level
      deep.
- [ ] Related elements are close; unrelated elements have a visibly larger
      gap. If you covered every line and border with your thumb, could you
      still tell the groups apart from spacing alone? If not, the grouping
      was never really working — it was the line doing the job.

**Filled controls**
- [ ] Inputs, selects, and search fields show their edge as a fill
      difference (`--surface-control`) at rest, not a border.
- [ ] Any border on a control is one of the documented exceptions —
      unchecked checkbox/radio/switch, Secondary button, or a control forced
      onto a same-fill surface — and not applied by default habit.
- [ ] Primary and Danger buttons have no visible border in any state.
- [ ] Radius on every element is 4, 8, or 16 — nothing at 10, 14, or 20.

**Alignment & consistency**
- [ ] Every dropdown/select/input near another one on the same page shares
      the same column width — none has shrunk to fit its current value.
- [ ] Label baselines, field left edges, and trailing-action right edges
      align across rows.
- [ ] Sliders and other room-hungry controls use the full width of their row
      on canvases that have the room, not a short fixed track.

**Motion & feedback**
- [ ] Nothing moved position between states (only fill, scale-on-press,
      opacity).
- [ ] Something visibly responds within 100ms of every input.
- [ ] Disabled controls, if any, explain why.

**Color**
- [ ] Every colored element is green/amber/red *and* means succeeded /
      needs attention / failed-or-destructive. Nothing is colored for mood.

**Window / canvas**
- [ ] No dead whitespace at the bottom or trailing edge of the window that
      isn't intentional (a fixed app-shell viewport with content pushed to
      fill it). If the surface is a widget, popover, or panel, its edges
      hug its content — it isn't oversized "in case."

**Library discipline (Figma specifically)**
- [ ] Every control is an instance of a Minimal library component, not a
      freehand redraw that merely resembles one.
- [ ] No raw hex fills or strokes — everything traces to a bound variable.

## Pass 3 — subtract

For each element on the screen, ask: if this were deleted, would the screen
still do its job? If yes, that's a real candidate — remove it and check
nothing broke. This single question catches more clutter than any checklist
item above it. Do this last, after the structural checks, so you're
subtracting from something already correctly aligned and grouped.

## Pass 4 — act, then stop

Fix what pass 2 and 3 found. Re-run pass 2 once against the fixed version —
a fix sometimes creates a new violation nearby (widening one dropdown so it
no longer matches its neighbor, for instance). If the second pass is clean,
stop. Continuing to hunt past a clean second pass is usually second-guessing
a decision that was already right, not finding real issues.
````

## Bundled file: reference/disclosure.md

````markdown
# Minimal — Progressive Disclosure & Grouping

How much to show, when to show the rest, and where the rest lives.

---

## The premise

Every element on a screen spends from the same fixed budget: the user's
attention. Adding a control doesn't just add a control — it taxes everything
already there. Disclosure is how you spend that budget deliberately instead of
letting whoever shipped last take it.

This is the operational half of "remove the step" and "prevent information
overload." Those principles say *less*. This file says *where the rest goes*.

---

## The cardinal rule

> **Disclosure hides content. It never hides the affordance that reveals it.**

A "More" button is always visible; what's inside it is not. An accordion header
is always visible; its body is not. The moment the *entry point* becomes
invisible, you've stopped doing progressive disclosure and started doing
Principle 8 violations — invisible elements.

Every corollary in this file descends from that one sentence.

---

## Four tiers

Assign every element in a view to exactly one tier. If you can't, you don't yet
understand who it's for.

**Tier 1 — Always visible.**
The primary path of the job to be done. Used by most people on most visits.
Budget: 5–7 elements, fewer on small canvases. One of them is the primary action.

**Tier 2 — One interaction away.**
Behind a visible, labeled control: an overflow menu, a disclosure section, a
secondary tab, a detail pane. The *control* is Tier 1 even though its contents
are Tier 2. Reaching it costs one click and no navigation.

**Tier 3 — In a dedicated place.**
Settings, advanced configuration, admin, history. Reached by navigation, not
hidden — a place, with a name, that a user can return to and describe to someone
else.

**Tier 4 — Deleted.**
If nobody uses it, remove it. Disclosure is not a landfill. Burying a feature
that nothing needs still costs you: it lengthens menus, complicates search
results, and adds a thing to maintain. Moving something to Tier 3 rather than
deleting it should be a decision, not a reflex.

**Promotion and demotion are the real work.** Ship, watch, and move things
between tiers. A Tier 2 item that everyone opens immediately belongs in Tier 1. A
Tier 1 control nobody touches is taxing every user for nothing.

---

## What may never be disclosed

Some things stay Tier 1 forever, regardless of how crowded the screen gets. This
is where disclosure meets honesty:

- **Cost.** Price, what's billable, when charging starts.
- **Consequence.** That an action is permanent, public, shared, or destructive.
- **Data.** What is collected, who sees it, where it goes.
- **Permission.** What access is being granted and to whom.
- **Current state.** Whether work is saved, syncing, failed, or offline.
- **Anything required.** If a field is required, it is not advanced. Move it or
  give it a default — never hide it behind "Show advanced" and then reject the
  form.

**Never hide something because it's unflattering.** Disclosure manages
complexity; it does not manage accountability. If burying it would make the user
feel better about a decision they'd otherwise make differently, it belongs on the
surface. This test catches most dark patterns before they get built.

---

## Choosing a pattern

| Pattern | Use when | Don't use when |
|---|---|---|
| **Overflow menu (⋯)** | 3+ secondary actions on a row or item | The action is primary, or destructive *and* frequent |
| **Disclosure / accordion** | Optional sections of a long form | Users need to compare across sections — or need all of it anyway |
| **"Show advanced"** | Power-user options with genuinely safe defaults | The default isn't actually safe, or the option is required |
| **Inline "Show more"** | Long prose, truncated lists | The content is short or scannable already |
| **Tabs** | Peer content, viewed one at a time, roughly equally likely | One tab holds 90% of use — that's not a tab, that's the page |
| **Detail pane / popover** | Supporting detail about a selected item | The detail is required in order to act |
| **Stepped flow** | Genuinely sequential, dependent steps | Steps are independent — then it's one page |
| **Command palette (⌘K)** | Large action surface, repeat users, pointer/keyboard | It's the *only* route — a palette must mirror visible UI, never replace it |
| **Contextual toolbar** | Actions that only exist during selection or edit | The user needs to know the capability exists beforehand |
| **Settings page** | Configuration set once and forgotten | Something adjusted during the task — that belongs inline |

**Two patterns that are almost always wrong:**

- **Hover-to-reveal as the only route.** Half of sessions have no hover. See
  `reference/surfaces.md`.
- **Nested menus two levels deep.** If a submenu needs a submenu, you don't have
  a menu problem, you have a navigation problem. Build the page.

---

## Grouping less-used elements

1. **Group by user intent, not by your architecture.** "Sharing and access", not
   "Permissions & API". The user is looking for what they want to *do*.
2. **Maximum 7 per group.** Beyond that, subdivide — or admit it needs a page.
3. **Every group gets a noun-phrase label naming its outcome.** Never "Other",
   "Misc", or "Advanced" as a catch-all. A Misc group is a confession that the
   domain isn't understood yet; the fix is to understand it, not to name it.
4. **Order within a group: most-used first.** Not alphabetical, not the order you
   built them. Destructive last, separated by a divider and ≥8px.
5. **Order of groups: frequency descending.** Irreversible groups always last,
   wherever their frequency lands.
6. **One level of nesting, maximum.**
7. **Keep positions stable.** Never reorder a menu by recency or usage — the
   whole value of a menu is that it's in the same order tomorrow. This is
   Principle 11 applied to lists.
8. **A group of one is not a group.** Promote it or fold it into a neighbour.

---

## Density budget

Concrete ceilings for simultaneously-visible interactive elements, by canvas
class. Exceed one and you owe a disclosure decision.

| Class | Primary | Secondary visible | Total interactive |
|---|---|---|---|
| micro (watch, small widget) | 1 | 0 | 1 |
| compact (phone) | 1 | ≤ 2 | ≤ 5 |
| medium (tablet portrait) | 1 | ≤ 4 | ≤ 9 |
| expanded / large (desktop) | 1 | ≤ 6 | ≤ 15 |
| xlarge | 1 | ≤ 6 | ≤ 15 |
| TV | 1 | ≤ 4 | ≤ 5 focusable per row |

Persistent navigation doesn't count against the total; it's chrome, learned once.

Note that the primary column reads `1` at every size. More canvas never buys a
second primary action — it buys more *content*, or more secondary actions, or
more breathing room. Never a second emphasis.

**Disclosure is canvas-dependent.** The same feature can be Tier 1 on desktop and
Tier 2 on phone. That's correct and expected — the tiers move with the budget.
What must not move is the *order*: if it's the third item in the overflow menu on
desktop, it's the third item on phone.

---

## Motion for reveals

Expanding is inherently a size change, so this is the one documented exception to
"only opacity, transform, and color may animate."

**Why it doesn't violate "nothing moves":** Principle 11 forbids *unrequested*
movement, and forbids a control changing position across its own states. A user
who clicks "Show advanced" has requested the movement below the fold. The rule
that still binds: **the trigger itself must not move.** The disclosure header
stays exactly where it was; only the content below it changes.

```css
/* Animate grid-template-rows, not height — it handles auto content. */
.disclosure { display: grid; grid-template-rows: 0fr;
              transition: grid-template-rows var(--d-slow) var(--e-entrance); }
.disclosure[data-open] { grid-template-rows: 1fr; }
.disclosure > * { overflow: hidden; }

/* Or, where supported: */
:root { interpolate-size: allow-keywords; }
```

- Open: 260ms `--e-entrance`. Content fades in over 120ms, delayed 60ms, so it
  doesn't smear during the expansion.
- Close: 180ms `--e-exit`. Things leave faster than they arrive.
- The chevron rotates 180° over the same duration — it is the state indicator,
  so it must never fall out of sync with the panel.
- Under `prefers-reduced-motion`, snap open with no transition. Already handled
  globally in `tokens.css`.

Never animate a reveal that happens on page load. If it's open at load, it was
always open.

---

## Making the hidden findable

Disclosure only works if people can get back to what you hid.

- **Search covers every tier.** If a setting exists at Tier 3, searching its name
  must find it — and land on it, highlighted, not merely on its page.
- **Deep-link every disclosed surface.** A URL that opens the right page with the
  right section expanded. Support answers get shorter and the UI gets testable.
- **Preserve the open state** where it reflects intent (an expanded advanced
  section stays expanded next visit). Don't preserve it where it reflects
  browsing (an accordion in a list resets).
- **Badge, don't bury.** If something inside an overflow needs attention — an
  error, an expired credential — surface an indicator on the closed trigger. A
  problem hidden behind a menu is a dead end.
- **Never disclose an error.** Something that failed is Tier 1 until resolved.

---

## Review

- [ ] Every element is assigned to a tier, deliberately.
- [ ] Tier 1 is within the density budget for the smallest supported canvas.
- [ ] Exactly one primary action, at every canvas class.
- [ ] Every disclosure's *trigger* is visible at rest and clearly labeled.
- [ ] No required field, cost, consequence, permission, or state is disclosed.
- [ ] Nothing is hidden because it's unflattering.
- [ ] Groups are named for outcomes; no "Other" or "Misc".
- [ ] Groups hold ≤7 items, nested at most one level, in stable order.
- [ ] Destructive items are last, separated, and never adjacent to a common action.
- [ ] Search and deep links reach every tier.
- [ ] Errors and attention states are never hidden behind a closed control.
- [ ] Reveal motion moves the content, never the trigger.
````

## Bundled file: reference/icons-and-illustrations.md

````markdown
# Minimal — Icons & Illustrations

Two visual languages, deliberately different weights, with a rule for when each
is allowed to appear.

---

## The three line weights

The system says "one line weight" and that rule governs **UI chrome** — borders,
dividers, outlines. Icons and illustrations are a separate progression, and the
progression is tied to scale rather than being arbitrary:

| Layer | Size | Stroke | Why |
|---|---|---|---|
| **Chrome** | any | 1px | Borders and dividers. Never varies. |
| **Icon** | 16px | 1.5px | Dense enough to read at label size |
| **Illustration** | 120px | 2px | Deliberately *lighter* in proportion |

That last row is the interesting one. Matching an icon's stroke-to-size ratio at
120px would need an 11px stroke, which would be absurd. Illustrations are
proportionally much thinner **on purpose** — that airiness is exactly what makes
them read as illustration rather than as a giant icon.

---

## Icons

**221 icons**, drawn for this system on a 16px grid at 1.5px stroke, round caps
and joins. Categories: navigation, actions, files and folders, editing and tools,
media and playback, devices and equipment, communication, people, commerce,
status, shapes, scene and weather, data and charts, security, layout.

### Rules

- **16px is the base.** 14 inside small controls, 18 inside large, 20 standalone,
  24 for display. Below 14 the 1.5px stroke stops resolving — use a dot or a
  word instead.
- **Icons inherit the colour of the text they sit beside.** Never colour an icon
  separately inside a button, a menu item or a list row. The only exception is
  a status icon, which takes its `status/*/fg`.
- **An icon that decorates rather than informs should be deleted.** If removing
  it costs nothing, it was costing you something.
- **Leading icons clarify what the action is. Trailing icons signal what happens
  next** — a chevron for "opens a menu", an external-link mark for "leaves the
  app". Never both on one control.
- **Icon-only is a commitment.** It requires an accessible name *and* a tooltip,
  and tooltips do not exist on touch or TV. So icon-only is acceptable only when
  the icon is universally understood (close, search, back, more) or a text label
  sits adjacent. Never for a destructive or rare action — those get words.

### Growing the set beyond 221

For the long tail, **use Lucide** rather than drawing more. It's ~1,600 icons on
a 24px grid with a minimal stroke style that matches this system closely, under
the **ISC licence** — functionally identical to MIT. Commercial use, modification,
redistribution and shipping inside a product you sell are all permitted; the only
obligation is keeping the licence text in your repo, never in your UI.

Install the official **Lucide Figma plugin** (free) and you have all of them
immediately. **Tabler Icons** (MIT, ~5,900) is the other safe pick.

Whatever you add, **redraw it to the 16px grid at 1.5px stroke** before shipping,
or it will read as imported. Lucide is authored at 24px/2px, which scales to
16px/1.33px — noticeably lighter than this set. Set the stroke explicitly.

---

## Illustrations

**31 illustrations** at 120×120, 2px stroke, line art only — no fills, no
gradients, no colour except where a secondary line uses `icon/secondary` for
depth.

Available: `empty` · `upload` · `download` · `search-empty` · `no-results` ·
`success` · `error` · `warning` · `try-again` · `offline` · `loading` ·
`laptop` · `phone` · `desktop` · `edit` · `move` · `recommend` · `celebrate` ·
`locked` · `permissions` · `team` · `inbox-empty` · `calendar-empty` ·
`chart-empty` · `sync` · `share-nodes` · `message-empty` · `trash-empty` ·
`settings-large` · `welcome` · `file-missing`

### Rules

- **One illustration per screen, maximum.** They are the loudest thing in a
  monochrome system. Two competing is two focal points, which is Principle 3.
- **Size: 120 default, 96 on compact, 160 on a full-page state.** Never below 80
  — the 2px stroke stops holding together.
- **An illustration never appears alone.** It is always paired with a title
  naming what's missing and an action that fills it. An illustration with no
  action is decoration on a dead end.
- **Never illustrate an error the user caused.** A friendly drawing above "Your
  payment failed" reads as tone-deaf. Errors get an icon and plain words;
  illustrations are for *empty*, not for *broken*. The `error` and `warning`
  illustrations exist for system-level failures — a 500 page, an outage — not
  for form validation.
- **Never animate them.** They're the one thing on screen with enough visual
  weight to be genuinely distracting in motion.
- They inherit `icon/primary`, so they re-theme with the mode automatically. Do
  not hardcode a stroke colour.

### Where each belongs

| State | Illustration | Paired with |
|---|---|---|
| No data yet | `empty`, `inbox-empty`, `calendar-empty` | "No projects yet" + primary action |
| Search found nothing | `no-results` | The query, plus a way to clear it |
| Action succeeded | `success`, `celebrate` | Only when there's no other confirmation |
| System failure | `error`, `offline` | What broke, data state, retry button |
| Blocked by permissions | `locked`, `permissions` | Who to ask, not just "denied" |
| Onboarding | `welcome`, `team` | One sentence, one action |

`celebrate` is deliberately rare. Reserve it for genuine milestones — finishing
onboarding, shipping something. Using it for routine success trains people to
ignore it.

---

## Licensing

Every icon and illustration here was drawn for this system. They are not forks or
subsets of any existing library, carry no third-party licence, and are yours
outright — free to use commercially, modify, and redistribute. See
`LICENSE-AND-ASSETS.md`.
````

## Bundled file: reference/motion.md

````markdown
# Minimal — Interaction & Motion Contract

Every interactive element in every product implements this. No exceptions, no
per-project variation.

---

## Rapid *and* smooth is not a contradiction

They feel opposed because most systems try to buy smoothness with duration. That
is the wrong lever, and it produces interfaces that feel syrupy.

**Perceived speed comes from how fast the animation *starts*, not how long it
runs.** An ease-out curve covers 60–70% of its distance in the first third of its
duration. The eye reads that opening burst as the response time; the tail is
read as polish. So a 180ms ease-out transition feels *faster* than a 120ms linear
one, while looking considerably better.

That gives the two rules the whole system runs on:

1. **Short durations for anything the finger is on.** 90–120ms. Direct
   manipulation must not have a perceptible lag.
2. **Front-loaded easing everywhere.** Never `linear` (except a spinner, which
   has no start or end), never `ease-in` on an entrance — `ease-in` starts slow,
   which is exactly the frame the user is judging you on.

**The 100ms rule.** Something must change within 100ms of any input. If the real
work takes longer, acknowledge the input *now* and show progress separately. This
is the single most important line in this file.

---

## Durations

| Token | Value | Used for |
|---|---|---|
| `--d-instant` | 0ms | State that must not animate — theme flips on load, reduced motion |
| `--d-fast` | 120ms | Hover in/out, focus ring, icon colour, small state |
| `--d-base` | 180ms | The default. Most transitions, exits, cross-fades |
| `--d-slow` | 260ms | Entrances: modals, popovers, sheets, disclosures |
| `--d-slower` | 400ms | Route changes, large layout shifts |

Press is deliberately faster than hover: **90ms down, 120ms release.** A press
that lags feels broken in a way a slow hover never does.

## Easing

| Token | Curve | Used for |
|---|---|---|
| `--e-standard` | `cubic-bezier(0.2, 0, 0, 1)` | The default. In-out, front-loaded |
| `--e-entrance` | `cubic-bezier(0.16, 1, 0.3, 1)` | Things arriving. Near-instant start, long soft settle |
| `--e-exit` | `cubic-bezier(0.4, 0, 1, 1)` | Things leaving. Accelerates away |

**Things leave faster than they arrive.** An exit at the same duration as its
entrance feels like the interface is reluctant to let go.

---

## The interaction contract

Every interactive element implements all six. If one is missing, the component
is not finished.

| State | Trigger | Response | Duration |
|---|---|---|---|
| **Default** | at rest | must be visibly interactive *without* hover | — |
| **Hover** | pointer only | surface or border moves one step | 120ms `standard` |
| **Focus** | keyboard | 2px ring, 2px offset, always visible | 120ms `standard` |
| **Press** | pointer down / touch start | `scale(0.98)` + fill settles | 90ms `standard` |
| **Release** | pointer up | returns to hover (pointer) or default (touch) | 120ms `standard` |
| **Disabled** | — | no transition, no pointer events, reason always given | 0ms |

### What may animate

`opacity` · `transform` · `background-color` · `border-color` · `color` ·
`box-shadow` · `filter`

These are compositor-friendly and none of them affect layout. Animating `width`,
`height`, `top`, `left`, `margin` or `padding` is banned: it costs frames and it
moves neighbouring elements.

**The one exception** is a user-requested disclosure animating its own height —
and even then the trigger must not move. See `reference/disclosure.md`.

### Press on touch

There is no hover, so press carries the entire burden of "this is live."

- `touch-action: manipulation` — kills the 300ms tap delay.
- Press feedback fires on **touchstart**, not on tap completion.
- Never rely on `:hover` for touch. In Tailwind always write `can-hover:hover:`;
  a bare `hover:` latches after a tap and leaves the control looking permanently
  hovered.

### Hover on pointer

- Hover moves the fill **one step toward mid-gray** — black lightens, white dims.
  Both read as the surface lifting toward you.
- Hover never changes size, position, or layout. `scale` on hover makes lists
  shimmer as the pointer crosses them.
- Hover-out uses the same 120ms. Asymmetric hover timing feels like lag.

---

## Per-component behaviour

| Component | Hover | Press | Notes |
|---|---|---|---|
| Button | fill one step | `scale(0.98)` | Box never resizes; loading holds width |
| Icon button | surface wash appears | `scale(0.98)` | Needs label + tooltip |
| Tertiary button | 10px shape fades in | `scale(0.98)` | No border ever; typography is the affordance |
| Input / Search | border → `strong` | — | Focus ring on focus, not click |
| Select | border → `strong` | menu opens from trigger edge | Chevron rotates 180° over 180ms |
| Checkbox / Radio | border → `strong` | `scale(0.98)` | Check path draws over 60ms |
| Switch | track lightens | knob squashes 2px | Knob travels 180ms — the travel IS the meaning |
| Segmented | segment label darkens | — | Indicator slides 260ms `standard` |
| Card (interactive) | shadow e1 → e2 | `scale(0.995)` | **No lift transform** — it misaligns neighbours |
| List row | surface wash | — | Row actions visible at rest, not hover-only |
| Menu item | surface wash | — | Menu enters from the trigger edge |
| Tab | label darkens | — | Underline slides 260ms |
| Accordion | header wash | — | Content 260ms open / 180ms close; header never moves |
| Slider | thumb ring grows | thumb `scale(1.1)` | Value updates live, never on release only |
| Toast | timer pauses | — | Enter 260ms up+fade, exit 180ms down+fade |
| Modal | — | — | Enter 260ms `entrance` scale(0.96)→1; exit 180ms |
| Tooltip | 400ms delay in, 0ms out | — | 0ms delay if another tooltip is already open |

---

## Loading and waiting

Match the affordance to the actual wait. Getting this wrong is the most common
way a fast interface feels slow.

| Wait | Show |
|---|---|
| < 300ms | **Nothing.** A flashed spinner reads as a glitch and makes it feel slower |
| 300ms – 1s | Nothing visible; just block re-submission |
| 1s – 3s | Indeterminate spinner, in place, box unchanged |
| > 3s | Determinate progress with a **real** number |
| > 10s | Move it out of the control entirely — give the user their interface back |

Spinner: 16px, 1.5px stroke, 270° arc, `700ms linear infinite`. Linear is correct
here and nowhere else: a spinner has no beginning or end to ease.

Skeletons appear only after ~200ms and must match the real content's geometry
exactly, or the page jumps on load. Never skeleton more than one screenful.

---

## Reduced motion

`prefers-reduced-motion: reduce` is honoured globally in `tokens.css` — every
duration collapses to ~0. Two things must still hold when it does:

- **Nothing may become unusable.** If a disclosure only makes sense because you
  watched it expand, it was badly designed.
- **State changes stay legible.** Without the transition, the difference between
  default and hover must still be visible at a glance.

Motion is an enhancement. It is never the only carrier of meaning.

---

## Review

- [ ] Every interactive element implements all six states.
- [ ] Something visibly changes within 100ms of every input.
- [ ] Press fires on touchstart, not tap completion.
- [ ] Hover states are gated behind a hover-capable query.
- [ ] Nothing animates except opacity, transform and colour.
- [ ] Nothing moves position or changes size on hover.
- [ ] Exits are faster than entrances.
- [ ] No `linear` easing outside the spinner.
- [ ] No animation fires on page load.
- [ ] Wait affordance matches the actual duration; no fake progress.
- [ ] Everything still works and reads with reduced motion on.
````

## Bundled file: reference/sizing.md

````markdown
# Minimal — Sizing

Small, medium and large across every control family, and the rules for which one
to reach for.

---

## One height scale, three steps

| Size | Pointer | Touch | TV | Padding X | Icon | Type |
|---|---|---|---|---|---|---|
| **sm** | 32 | 40 | 48 | 12 | 14 | `label` 14/20 |
| **md** | 40 | 44 | 56 | 16 | 16 | `label` 14/20 |
| **lg** | 48 | 52 | 64 | 20 | 18 | `title` 17/24 |

Radius stays `10` at every size — a small button is not a differently-shaped
button. Only height, padding, icon and (at lg) type size change.

The pointer column is what the tokens hold; `tokens.css` raises them under
`@media (any-pointer: coarse)` and under `[data-surface="tv"]`. **Components read
`var(--control-h-md)`; they never hardcode 40.**

### Which size

- **md is the default.** If you're not sure, it's md. A product should look like
  it picked one size and stuck to it.
- **sm** for dense contexts: table rows, toolbars, inline actions, filter bars,
  anywhere a control sits inside another control's rhythm.
- **lg** for a single hero action: the one button on an empty state, a marketing
  CTA, the primary action on a compact-canvas form.
- **Never mix sm and lg in one row.** Mixed heights in a control group read as a
  bug, not a hierarchy.

A screen should contain at most two sizes. Three means the hierarchy is being
carried by size instead of by variant, which is the wrong lever.

---

## Controls that follow the height scale

Button · Icon button · Input · Search field · Select · Combo box · Date picker
trigger · Stepper · Segmented control · Toolbar button · Filter chip

All of these align on a shared baseline when placed in a row, because they share
one height token. That alignment is most of what makes a form look composed.

## Controls that do not

Some elements have their own scale because their size means something different.

| Element | sm | md | lg | Scale driver |
|---|---|---|---|---|
| **Avatar** | 24 | 32 | 40 | Identity density — also 20 inline, 64 profile |
| **Checkbox / Radio** | 16 | 18 | 20 | Tap target is added, not grown |
| **Switch** | 36×20 | 44×26 | 52×30 | Track:knob ratio is fixed at 1.7:1 |
| **Badge** | 18 | 22 | 26 | Follows caption/label type |
| **Notification dot** | 6 | 8 | 10 | Never contains more than 2 digits |
| **Icon (standalone)** | 14 | 16 | 20 | 24 for display, 32+ for empty states |
| **Divider** | 1 | 1 | 1 | There is one line weight |
| **Spinner** | 14 | 16 | 20 | Matches the icon in its control |

---

## Containers

Containers scale by **padding and radius**, not by a height token.

| Container | Padding | Radius | Gap |
|---|---|---|---|
| Card | 20 (sm 16, lg 24) | 16 | 8 |
| Panel / Paper | 24 | 16 | 16 |
| Dialog | 24 | 16 | 12 |
| Sheet | 24 | 16 top only | 12 |
| Popover | 16 | 16 | 8 |
| Menu | 6 | 16 | 0 |
| Banner | 12 / 16 | 8 | 12 |
| Toast | 12 / 16 | 16 | 12 |

**A child's radius sits one step down the 4/8/16 scale from its parent's,** not
an arbitrary subtraction — the doubling scale makes this automatic. A 16px
container holds children at radius 8; an 8px control holds children (an icon,
a small chip) at radius 4. This is why menu items are 8 inside a 16 menu.

---

## Type sizes — when to use which

The ramp is not a set of options; each step has a job.

| Style | Size/LH | Use for | Never |
|---|---|---|---|
| `display` 48/52 | marketing hero, empty-state headline | — | inside an app shell |
| `h1` 32/38 | page title, one per screen | — | repeated in a list |
| `h2` 24/30 | major section | — | as a card title |
| `h3` 20/26 | subsection, dialog title | — | body copy |
| `title` 17/24 | card title, list item title, lg button | — | long text |
| `body-lg` 17/26 | intro paragraph, marketing body | — | dense UI |
| `body` 15/22 | **the default.** All UI text, form values, list content | — | — |
| `label` 14/20 | field labels, buttons, table headers, tabs | — | paragraphs |
| `caption` 13/18 | helper text, timestamps, metadata | — | primary content |
| `micro` 11/14 | uppercase eyebrows, sidebar section headers | — | anything you must read carefully |

**Recommendations:**

- Body copy caps at ~72 characters per line. Past that the eye loses the return.
- Only ever use **two** type sizes in a single component. Three means it wants to
  be two components.
- Weight carries hierarchy better than size in dense UI. Prefer `body` at
  semibold over jumping to `title`.
- Never centre more than two lines.
- `micro` is the floor at arm's length. On a watch the floor is 13, on TV it's 18
  — `tokens.css` handles both via `data-surface`.

---

## Density

Three levers, in the order you should reach for them:

1. **Remove elements.** If a screen feels busy, it has too many things, not
   things that are too big.
2. **Change the size step.** sm instead of md across a whole region.
3. **Tighten the space scale.** 8 instead of 16 between grouped items.

Never shrink type below its floor to fit more in. That trades legibility for
density and legibility is not yours to spend.
````

## Bundled file: reference/spec-template.md

````markdown
# Minimal — Product Spec & Build Prompt Template

Two scaffolds. The first is for thinking; the second is for handing to an agent.
Because the visual system is already settled, a spec written this way spends none
of its words on what things look like.

---

## Part 1 — The spec

### 1. Job to be done

> One sentence. The user's goal, in their words, not the feature's name.

**Job:** When ______, I want to ______, so I can ______.

**Today they:** *(the current workaround, and what it costs them)*

**Done looks like:** *(the observable end state — what's true when they can stop)*

### 2. Success

| | Metric | Today | Target |
|---|---|---|---|
| Primary | | | |
| Guardrail | *(what must not get worse)* | | |

### 3. Scope

**In:**
-

**Explicitly out (and why):**
-

### 4. Surfaces

Which surfaces ship, and which is the **primary** one — the surface the design is
resolved against first. Everything else adapts from it.

| Surface | Ship? | Canvas class | Input | Notes |
|---|---|---|---|---|
| Web (responsive) | | compact → xlarge | pointer + touch | |
| Desktop app | | expanded → xlarge | pointer + keyboard | |
| Phone | | compact | touch | |
| Tablet | | medium / expanded | touch (+ keyboard) | |
| Foldable | | compact ↔ expanded | touch | Posture changes mid-session |
| Touch laptop | | expanded → large | **both** | |
| Watch | | micro | touch + rotary | |
| TV | | xlarge | directional | |
| Widget | | micro | tap only | |
| OS surface | | — | varies | Notification, menu bar, lock screen |

**Design against the tightest constraint first.** The smallest canvas fixes the
density budget; the coarsest input fixes the target sizes. Growing a design is
easy; shrinking one is a redesign.

**What can change mid-session?** *(fold, rotate, resize, detach, input switch)*
And what state must survive it — scroll, selection, input, playback, focus:

### 5. The flow

Number the steps a user takes from entry to done. Then delete one.

1. **Entry** — where they arrive from, and what they already know.
2.
3.
4. **Done** — how they know it worked, and where they go next.

**Steps removed and why:**

### 6. Screens

For each screen:

| | |
|---|---|
| **Purpose** | The one thing this screen is for |
| **Most important element** | Gets the hierarchy — name exactly one |
| **Primary action** | Exactly one, `primary` variant |
| **Tier 1 (always visible)** | ≤5–7 elements. Check against the smallest canvas. |
| **Tier 2 (one click away)** | What's behind which visible control |
| **Tier 3 (a dedicated place)** | Where, and what it's called |
| **Where the eye lands** | Top-left → … → commit action |
| **Compact layout** | What changes below 600 — and what's demoted a tier |
| **Expanded layout** | What the extra width *adds*, not what it stretches |
| **Empty state** | What it says, what action it offers |
| **Loading state** | Skeleton / spinner / nothing (per wait duration) |
| **Error states** | What broke, what to say, how to retry |
| **Back / exit** | How the user leaves without losing work |

### 7. Data & honesty

- What is saved, when, and where it's visible.
- What the user should know that they might not want to hear — state it plainly.
- What is irreversible, and how it's guarded.
- What happens to in-progress input on navigate, refresh, close, fold, or rotate.
- What must never be disclosed: cost, consequence, permissions, current state,
  required fields, errors.

### 8. Edge cases

| Case | Behavior |
|---|---|
| First run, no data | |
| Offline / request fails | |
| Slow response (>3s) | |
| Permission denied | |
| Concurrent edit | |
| Very long content | |
| Maximum volume | |
| Smallest supported canvas | |
| Fold / rotate / resize mid-task | |
| Touch and pointer both present | |

### 9. Open questions

-

---

## Part 2 — The build prompt

Paste into Claude Code once the spec is settled.

```
Build [FEATURE].

DESIGN SYSTEM
Follow the Minimal design system exactly. Read SKILL.md, reference/components.md,
reference/surfaces.md, and reference/disclosure.md before writing any UI code.
Import tokens/tokens.css and use tokens/tailwind.preset.js. Non-negotiable:
  - Semantic tokens only. No hex values, no bracket values like text-[15px].
  - Light and dark both work via data-theme on <html>. Verify both.
  - One primary action per view, at every canvas class.
  - One line weight (1px). Radius 4/8/16 only. Controls are filled
    (`--surface-control`), not outlined — a border appears only on the
    documented exceptions (checkbox/radio/switch, Secondary buttons).
  - Controls never change size between states. Reserve space for anything that
    can appear.
  - Every state implemented: default, hover, focus-visible, press, disabled,
    loading, empty, error.
  - Only opacity, transform, and color properties animate. The sole exception is
    a user-requested disclosure animating its own height — and its trigger must
    not move.
  - Sizing reads var(--control-h-*) / var(--hit-target-min) so it adapts to
    coarse pointers automatically. Never branch on device or user agent.
  - Write hover as can-hover:hover: — never bare hover:. Nothing is discoverable
    only on hover, only by gesture, or only in a tooltip.
  - Full keyboard operation. Visible focus everywhere. Never outline: none.

JOB TO BE DONE
[one sentence from §1]

SURFACES
[from §4 — name the primary surface and the canvas class range]
[what can change mid-session, and what state must survive it]

FLOW
[numbered steps from §5]

SCREENS
[the table from §6 for each screen, including the tier assignments and the
compact/expanded layout differences]

EDGE CASES
[the table from §8]

OUT OF SCOPE
[from §3 — be explicit, it prevents scope drift]

BEFORE YOU FINISH
Run reference/checklist.md against what you built and report any failures
honestly rather than fixing them silently. Include the Surfaces and Disclosure
sections — those are the ones that get skipped.
```

---

## Part 3 — The Figma mock prompt

```
Create [SCREEN] in Figma using the Minimal library.

- Bind every fill, stroke, text style, and corner radius to a variable from the
  Minimal library. No raw hex on any layer.
- Build the frame in the Light mode, then duplicate and switch the mode to Dark
  to verify. Both must hold without manual fixes.
- Use auto-layout throughout, with spacing from the 4px scale (8/16/24/32/64).
- Include the empty, loading, and error variants as separate frames beside the
  happy path — the mock is not done without them.
- Include the smallest supported canvas as its own frame, not as an afterthought.
  Show what gets demoted a disclosure tier to fit.
- Annotate the single most important element and the single primary action.

Job to be done: [one sentence]
Content: [real copy, never lorem ipsum — fake text hides real layout problems]
```

---

## A note on writing these

The system exists so specs can be short. Don't describe a black rounded button —
write "primary". Don't describe a gray caption — write "caption,
`--text-secondary`". Spend the recovered words on the job to be done, the edge
cases, and the honest answer to what happens when it fails. Those are the parts
no system can decide for you.
````

## Bundled file: reference/surfaces.md

````markdown
# Minimal — Surfaces

Phone, tablet, foldable, touch laptop, desktop, web, watch, TV, widget, OS
surface. One system, adapted — never redesigned.

---

## Don't design for devices

Device names date badly and multiply forever. Design against **four independent
axes**, then compose. A device is just a point in that space, and a device you've
never heard of is just a point you haven't visited.

| Axis | Range | Governs |
|---|---|---|
| **Input modality** | pointer · touch · both · directional (remote/D-pad) · rotary (crown) · keyboard · voice · pen | Target size, hover availability, focus model |
| **Viewing distance** | ~30cm watch · ~35cm phone · ~50cm tablet · ~60cm laptop/desktop · ~3m TV | Minimum legible type, minimum target |
| **Canvas class** | micro → compact → medium → expanded → large → xlarge | Columns, navigation pattern, pane count |
| **Attention budget** | glance (2s) · short (30s) · sustained (minutes+) | How much may be on screen at once |

A phone and a folded foldable share a canvas class but differ in continuity
needs. A touch laptop and a desktop share a canvas class but differ in input.
Handle the axis, and every device falls out for free.

**Detect capability, never device.** `@media (hover: hover)`,
`(any-pointer: coarse)`, `(pointer: fine)`. Never user-agent sniffing, never
"is it mobile". A touch laptop is both, and both must work.

---

## Canvas classes

| Class | Width | Typical | Columns | Page pad | Navigation |
|---|---|---|---|---|---|
| **micro** | < 320 | Watch, small widget, mini surface | 1 | 8 | none — one view |
| **compact** | 320–599 | Phone portrait, folded outer display | 4 | 16 | bottom tabs (≤5) or top bar |
| **medium** | 600–839 | Tablet portrait, phone landscape, unfolded | 8 | 24 | navigation rail |
| **expanded** | 840–1199 | Tablet landscape, small laptop | 12 | 32 | rail or sidebar |
| **large** | 1200–1599 | Desktop | 12 | 40 | sidebar |
| **xlarge** | ≥ 1600 | Large desktop, TV (1920 logical) | 12 | 48 | sidebar + supplementary pane |

Gutters stay 24 at every class. Content still caps at `--container-content`
(720) for reading — a wider window gets more margin, not longer lines.

**Class changes should add, not stretch.** Going from compact to medium means
showing the detail pane that was a separate screen — not the same layout
inflated. If a breakpoint only changes font sizes and padding, you've found a
layout that didn't need a breakpoint.

---

## Input modality

### Target sizes

| Modality | Minimum | Comfortable | Notes |
|---|---|---|---|
| Pointer (fine) | 24px visual / 32px hit | 32–40px | Hover and tooltips available |
| Touch (coarse) | **44×44** | 48×48 | No hover. Ever. |
| Both (touch laptop) | **44×44** | 48×48 | Touch wins the sizing; hover is bonus |
| Directional (TV) | 48px, visually much larger at distance | 56–64px | Focus is the cursor |
| Rotary (crown) | 44pt targets, one action per screen | full-width | Always show on-screen response |

`tokens.css` bumps `--control-h-*` and `--hit-target-min` automatically under
`@media (any-pointer: coarse)`. You write one component; it adapts.

**Grow the hit area, not the box.** Use a transparent pseudo-element to reach
44×44 while the visible control stays 32px. Layout stays identical across
modalities; only the touchable region changes.

### Hover is an enhancement, never a channel

Roughly half of all sessions have no hover at all. So:

- Nothing may be discoverable *only* on hover. (Principle 8, restated for touch.)
- Tooltips never carry required information — they don't exist on touch or TV.
- Every hover-revealed action needs a non-hover route: visible at rest on touch,
  an overflow menu, or long-press with a visible affordance.
- Row actions in tables sit at `--icon-secondary` at rest and strengthen on
  hover. On coarse pointers they render at full strength permanently.

### Press feedback matters more without hover

Touch has no hover to signal "this is live", so the press state carries the whole
burden. Keep `scale(0.98)` on press, and never delay it — a 300ms tap delay reads
as a broken app. Set `touch-action: manipulation`.

---

## Viewing distance → legibility floor

Type size is not a style choice; it's a function of how far the eye sits.

| Distance | Body | Minimum | Display | Min target |
|---|---|---|---|---|
| ~30cm (watch) | 16 | 13 | 24–30 | 44pt |
| ~35cm (phone) | 15–17 | 13 | 32–48 | 44 |
| ~50cm (tablet) | 15–17 | 13 | 32–48 | 44 |
| ~60cm (laptop/desktop) | 15 | 12 | 32–48 | 32 |
| ~3m (TV) | 24–28 | 18 | 48–72 | 56 |

Set `data-surface="tv"` or `"watch"` on the root and `tokens.css` applies the
scale. Everything else — weights, tracking, color, radius — is unchanged. The
system reads as one family at every distance because only size moved.

---

## Phone and tablet

**One-handed reach.** On compact, the bottom third of the screen is easy, the top
corners are not. Primary actions belong low: a bottom action bar, a floating
primary action, or the bottom of a sheet. Destructive and rare actions may live
top-right, where a deliberate reach is a feature.

This does not contradict "global actions top-right" — that rule is about
*findability* of account, search, and settings. Frequent, task-critical actions
go where the thumb already is.

**Safe areas are not optional.** Respect `env(safe-area-inset-*)` on every edge.
Nothing interactive under a notch, a home indicator, or a rounded corner.
`tokens.css` exposes `--safe-*` for this.

**Orientation is a canvas class change, not a new design.** Phone landscape is
`medium` — that usually means a two-pane layout, not a stretched list. Never lock
orientation unless the content genuinely demands it (a camera, a game).

**Sheets over modals on compact.** A bottom sheet respects reach and the platform
gesture vocabulary. Radius `--r-xl` on the top corners only, drag handle,
dismissible by swipe *and* by a visible control — gesture alone is invisible
(Principle 8).

**Tablet is not a big phone.** At `medium` and above, use the width for
list/detail. A tablet showing one stretched column is a wasted canvas. Keep the
list pane 320–400 and give the rest to detail.

**Worked example — a list/detail app across classes:**

| Class | Layout |
|---|---|
| compact | List screen → tap → detail screen. Back returns to list, restoring scroll. |
| medium | Two panes: 320 list + flexible detail. Selection persists. No navigation. |
| expanded | Nav rail + 360 list + detail. |
| large | Sidebar + 360 list + detail + optional 320 inspector. |
| xlarge | Same as large, with the content column capped and centered. |

The user's mental model never changes — only how much is visible at once.

---

## Web and desktop apps

**Windows resize continuously; design for the range, not the breakpoint.** Drag
the window across every class and watch for the moment something breaks. That
moment is a bug, not an edge case.

**Density.** Pointer-fine desktops can carry more per screen — that is a licence
for information, not for clutter. Table rows may drop to 36px, controls to 32px,
but type never goes below 12 and grouping rules still apply
(`reference/disclosure.md`).

**Keyboard is a first-class input, not an accessibility afterthought.** Every
action reachable by keyboard. Visible focus at all times. Standard bindings:
Escape closes, Enter commits, ⌘/Ctrl+K opens the command palette if one exists,
⌘/Ctrl+Z undoes. Publish the shortcuts somewhere discoverable — a shortcut nobody
can find is a shortcut nobody uses.

**Multi-window and multi-pane.** State belongs to the document, not the window.
Two windows on the same document stay in sync. Panes are resizable, their sizes
persist, and a collapsed pane leaves a visible affordance to bring it back
(never a dead edge).

**Web specifics.** The browser's back button is a real control — never break it.
URLs reflect state so a view can be shared and restored. Scroll position and form
input survive back/forward. Nothing hijacks scroll, right-click, or find-in-page.

---

## Foldables

Posture matters more than pixels.

| Posture | Class | Design for |
|---|---|---|
| Folded (outer) | compact, often unusually tall/narrow | One hand, one column, short sessions |
| Unfolded flat | medium/expanded | Two panes — *more* content, not bigger content |
| Half-open (book/tabletop) | split canvas | Never place content across the hinge |

**The hinge is an occlusion, not a divider.** Query
`@media (horizontal-viewport-segments: 2)` and use `env(viewport-segment-*)` to
lay out either side of it. Never let a primary action, a form field, or a line of
running text fall on the fold.

**Continuity is the whole ballgame.** Folding is a resize, not a navigation. On
fold or unfold, preserve: scroll position, selection, form input, playback
position, and focus. Losing any of these is a Principle 24 violation caused by
hardware — and it's the single most common foldable failure. Test it by folding
mid-sentence in a text field.

---

## Touch laptops and hybrids

The device is both, always, and may change mid-session when a user picks up a
detachable or reaches for the screen.

- Baseline is **touch-sized**; hover is a layer added on top. Not the reverse.
- If `(any-pointer: coarse)` matches, meet 44×44 — even with a mouse attached.
- Never latch on the first input seen. A user who scrolls with a trackpad may tap
  the next control.
- Every drag interaction needs a non-drag equivalent (a menu command, an arrow
  key), since precise dragging is miserable on a vertical touchscreen.
- Never render a "touch mode" toggle. The user should not have to tell you what
  they're holding.

---

## Watch and glanceable surfaces

Attention budget: **two seconds**. Design for a person with a raised wrist.

- **One primary action per screen**, full width, ≥44pt tall.
- Vertical list only. Nothing side by side.
- Type: body 16, minimum 13. Weights and tracking unchanged.
- Inset content from the curved display corners; use `--r-xl` and larger.
- Motion is shorter — `--d-fast` 100ms, `--d-base` 150ms. Glances don't wait.
- No hover, no tooltips, no stacked modals. Depth is navigation, not layering.
- Crown/rotary scrolls and adjusts values — always with visible on-screen
  response, never silent.
- Status color earns its keep here: at a glance, green/amber/red *is* the message.

## TV and 10-foot interfaces

Attention budget is long, precision is near zero, and the pointer does not exist.

- **Focus is the cursor.** Exactly one element is focused; it must be readable
  from three metres: `scale(1.06)` + raised surface + 2px `--focus-ring` border +
  `--shadow-e3`.
- **This is the one documented exception to "nothing moves."** Scaling the
  focused element is the only focus signal that survives distance. It's a
  `transform`, so it costs no layout, and the grid must reserve headroom so
  neighbours never reflow.
- Directional navigation must be complete: every element reachable by
  up/down/left/right, no traps, no unreachable corners, and a predictable spatial
  grid. Left/right moves within a row, up/down between rows.
- Safe area: inset 5% on all sides for overscan. Nothing interactive outside it.
- Type: body 24–28, minimum 18, display 48–72 at 1080p logical.
- Dark is the default. This system is already suited to it: the dark page is
  `#0E0E10` rather than pure black, and primary text is `#F2F2F3` rather than
  pure white, which avoids OLED bloom and halation at distance.
- Avoid text entry. Prefer selection, search-as-you-type with suggestions, or a
  handoff to phone. On-screen keyboards at 3m are a punishment.
- No hover, no tooltips, no right-click, no long-press.

## Widgets and mini surfaces

A widget is not a small app. It's **one idea, legible in under two seconds.**

- One idea per widget. If it needs a second, it needs to be two widgets.
- No scrolling, no internal navigation, no text input, no multi-step anything.
- Scale between sizes by **removing items, never by shrinking type**. Small shows
  the headline number; large shows the same number plus three rows. The floor is
  the floor.
- Tap target is the whole widget, or at most 2–3 discrete deep links, each ≥44px.
- **Show stale data honestly.** Widgets refresh on the system's schedule, not
  yours. Never show a spinner — show the last known value with an unobtrusive
  timestamp. A confidently wrong number is worse than an openly old one.
- Don't draw your own container edge. Inherit the system's corner radius, margin,
  and material.
- Type floor 11 (`micro`), and only `micro`/`caption`/`title`/`h2` are in play.

## OS surfaces

Notifications, menu-bar items, share sheets, lock-screen activities, quick
settings. The OS owns the chrome; you own the content and nothing more.

- **Notification:** one line of what happened, one action. The important part
  goes first — it's the part that survives truncation.
- **Menu bar / tray:** monochrome glyph, 1.5px stroke, matching the system's own
  weight. Signal state by changing the glyph, not by adding color — except the
  three status colors, which are exactly what they're for.
- **Lock screen / live activity:** glanceable, at most one action, and honest
  about update frequency. If the data is 5 minutes old, say so.
- Never reproduce your app's navigation inside an OS surface. Deep-link into the
  app instead.

---

## Choosing a surface's rules

```
1. Which input modalities can reach this?   → target sizes, hover budget, focus model
2. How far away is the eye?                 → type floor
3. What canvas class?                       → columns, nav pattern, pane count
4. What's the attention budget?             → density budget (reference/disclosure.md)
5. What can change mid-session?             → fold, rotate, resize, input switch, detach
```

Step 5 is the one that gets skipped and the one that produces the worst bugs.
Anything that can change mid-session must preserve scroll, selection, input,
playback, and focus when it does.

---

## Cross-surface review

- [ ] Every interactive target meets its modality's minimum.
- [ ] Nothing is discoverable only by hover, only by gesture, or only by tooltip.
- [ ] The layout was dragged through every canvas class without breaking.
- [ ] Class changes add or rearrange content — they don't merely stretch it.
- [ ] Safe-area insets respected on every edge.
- [ ] Nothing important sits on a fold, under a notch, or outside TV safe area.
- [ ] Fold, rotate, resize, and input switch all preserve scroll, selection,
      input, playback, and focus.
- [ ] Type never drops below the floor for its viewing distance.
- [ ] Keyboard reaches every action; directional navigation reaches every element.
- [ ] Glanceable surfaces show stale data honestly instead of spinning.
- [ ] The product is recognisably the same on the smallest and largest surface.
````

## Bundled file: reference/taxonomy.md

````markdown
# Minimal — Component Taxonomy

Platform vocabularies overlap and contradict each other. macOS calls it a
pull-down button, Material calls it a menu, the web calls it a dropdown, and iOS
calls half of them pickers. Left alone, that produces four components that do the
same job slightly differently.

This file resolves the naming. **Pick the component by what it does, not by what
the platform you grew up on called it.**

---

## Overlays — ordered by interruption

The whole family separates on two questions: *who opened it* and *how much does
it interrupt*.

| Component | Opened by | Interrupts | Carries required info? | Dismiss |
|---|---|---|---|---|
| **Tooltip** | hover / focus | not at all | **never** | leaving |
| **Popover** | the user, deliberately | not at all | no | click-out, Escape |
| **Dialog** | the app or the user | fully — blocks | yes | explicit decision |
| **Sheet** | the user | fully, on compact | yes | swipe **and** a visible control |

Rules that fall out of the table:

- A **Tooltip** clarifies. It doesn't exist on touch or TV, so an icon-only
  control that depends on one is broken in roughly half of all sessions.
- A **Popover** must never hold information required to act. If it does, it's a
  Dialog, or it belongs on the page.
- A **Dialog** demands a decision. If the user can just carry on, don't use one.
- A **Sheet** is what a Dialog becomes on compact — same content, anchored to the
  bottom edge in thumb reach. Never dismissible by gesture alone; a gesture is
  invisible.

Never stack overlays. On watch and TV, don't use them at all — push a full screen
instead, because depth there is navigation, not layering.

---

## Menus — ordered by what the trigger promises

All four look similar. The **trigger label** is the tell.

| Component | Opens | Trigger label | Use when |
|---|---|---|---|
| **Menu** (pull-down) | actions | never changes — "Actions", "⋯" | 3+ secondary actions on an object |
| **Select** (pop-up) | values | shows the current value | one choice from a known list |
| **Combo box** | values + free text | shows current value, editable | the list is long or open-ended |
| **Picker** | structured values | shows current value | dates, times, durations |

A Picker is a Select specialised for a value type that has structure worth
rendering — a calendar grid beats a list of 365 dates. That's the only reason it
exists as a separate thing.

**If the label changes when you choose, it's a Select. If it doesn't, it's a
Menu.** Everything else follows.

---

## Messaging — ordered by persistence

Not by severity. A critical message can be a Banner and a trivial one can be a
Toast; what separates them is how long they stay and who dismisses them.

| Component | Lives | Placement | Dismissed by | Good for |
|---|---|---|---|---|
| **Help text** | forever | under one field | nothing | formatting rules, constraints |
| **Inline error** | until fixed | under one field | fixing it | validation |
| **Banner** | until resolved | top of the region it concerns | the user, or the condition clearing | degraded state, expiry, maintenance |
| **Toast** | 4–6s | bottom | itself | confirmations, undo |
| **Notification** | OS-owned | outside the app | the OS | things worth interrupting for |

The load-bearing rule: **never put critical information only in a Toast.** It
will be missed, and it can't be retrieved. If the user must act on it, it's a
Banner. If it failed, it stays visible until resolved.

Errors never auto-dismiss. Any Toast offering undo lives at least 5 seconds and
pauses its timer on hover or focus.

---

## Selection — commit vs immediate

Two families that look interchangeable and are not.

| Component | Applies | States | Use when |
|---|---|---|---|
| **Checkbox** | on commit | unchecked · checked · **indeterminate** | multi-select, form fields, "select all" |
| **Radio** | on commit | unselected · selected | one of 2–5, all visible, in a form |
| **Switch** | **immediately** | off · on | a setting that takes effect now |
| **Segmented** | immediately | one of 2–5 selected | switching a view or mode |

"A toggle that can be on, neutral, or off" is **not a Switch** — a Switch is
binary and applies immediately. A tri-state with a neutral middle is a
**Checkbox with an indeterminate state**, and it waits for a commit action.

**Never mix commit and immediate in one form.** If some controls save on click
and others wait for a Save button, users can't tell which of their changes
landed. Pick one metaphor per surface.

---

## Not components

These get asked for as components and shouldn't be:

- **Form** — a layout pattern. Single column, labels above, related fields
  grouped at 16, groups separated at 32, commit action at the end of the reading
  path. See the layout section of `SKILL.md`.
- **Group box / Fieldset** — a labeled section within a form. It's a heading plus
  spacing, not a bordered container; reach for a border only when space alone is
  ambiguous.
- **Window** — the OS owns this. You own the content and the toolbar inside it.
- **Scrollbar** — the platform's, always. Never restyle it into something that
  can be mistaken for content, and never hide it where scrolling isn't otherwise
  discoverable.
- **Coach mark** — see below.

---

## Coach marks

**Principle 20 says a flow that needs an onboarding overlay should be redesigned.
That still holds.** A coach mark is a patch over a discoverability failure, and
the fix is almost always the underlying screen.

The narrow exception: a genuinely novel interaction with no precedent to borrow —
a new gesture, a non-obvious direct manipulation. Not "here's our nav", not
"welcome to the new dashboard".

If you're building one, it must:

- Point at exactly one thing, once, and never return.
- Be dismissible in one action, and dismissal must stick permanently.
- Never block the action it describes.
- Never chain. Two coach marks in sequence is a tour, and a tour is proof the
  design failed.

Before building one, try: a better empty state, a clearer label, or making the
thing visible at rest. Those fix the cause rather than annotating it.

---

## Deciding quickly

```
Something appears above the page?         → Overlays table, by interruption
A control opens a list?                   → does the label change? Select : Menu
Telling the user something?               → Messaging table, by persistence
A binary control?                         → does it apply now? Switch : Checkbox
Asked for a "window", "form", "group box"?→ not a component; see above
Asked for a coach mark?                   → fix the screen first
```
````

## Bundled file: reference/token-usage.md

````markdown
# Token setup and usage

The reusable base tokens live in `tokens/`, relative to SKILL.md.
Copy that folder into your project. Keep all three files together.
Fonts and Figma component instances are separate assets. The CSS uses a font
stack, but does not download font binaries. See LICENSE-AND-ASSETS.md for
self-hosting font files and their notices.

## Tailwind CSS 3.4

This preset targets Tailwind 3.4. For a project using Tailwind 4, use the CSS
variables directly or adapt the preset explicitly before adopting it.

Import `./tokens/tokens.css` once in your application entry or global stylesheet.
Adjust the relative path for your project. Configure Tailwind to scan your
actual source folders.

```js
// tailwind.config.cjs
module.exports = {
  presets: [require('./tokens/tailwind.preset.js')],
  content: ['./src/**/*.{js,ts,jsx,tsx,html}'],
};
```

```html
<div class="bg-page p-page text-fg">
  <h1 class="text-h1">Project title</h1>
  <p class="mt-4 text-body text-fg-secondary">Supporting text.</p>
  <button class="mt-6 h-control-md rounded-control bg-primary px-6 text-primary-fg">
    Continue
  </button>
</div>
```

Use `can-hover:hover:` for hover states so touch devices do not retain them.
Use the same semantic classes in both themes.

## CSS without Tailwind

```css
@import "./tokens/tokens.css";

.panel {
  background: var(--surface-page);
  color: var(--text-primary);
  padding: var(--s-8);
}
```

Use the exact names defined in tokens.css. Semantic variables describe roles.
Primitive colors are inputs to semantic values and should not be applied
directly to components.

## Light and dark

Set `data-theme="light"` or `data-theme="dark"` on the root HTML element.
Omitting the attribute follows the operating system. The CSS uses light-dark().
For older browsers, compile explicit light and dark values for your targets.

## Spacing

The custom spacing indices are not Tailwind's default pixel values.

| Index | px |
|---|---|
| 0 | 0 |
| 1 | 2 |
| 2 | 4 |
| 3 | 6 |
| 4 | 8 |
| 5 | 12 |
| 6 | 16 |
| 7 | 20 |
| 8 | 24 |
| 9 | 32 |
| 10 | 40 |
| 11 | 48 |
| 12 | 64 |
| 13 | 80 |
| 14 | 96 |
| 15 | 128 |

For example, `gap-4` is 8 px and `mt-7` is 20 px.
Check the preset before using indices outside this scale.

## Figma tokens

tokens.json contains DTCG token data. Use a compatible token importer such as
Tokens Studio, then map the semantic light and dark values to Figma variable
modes. Figma does not universally accept this JSON as a native Variables import.
Bind component properties to semantic variables.
````

## Bundled file: tokens/tailwind.preset.js

````javascript
/**
 * MINIMAL — Tailwind preset
 *
 * Everything maps to the CSS custom properties in tokens.css, so dark mode
 * works by flipping `data-theme` on <html>. No `dark:` variants needed for
 * color — the variable already changed underneath you.
 *
 * Setup:
 *   1. import "./tokens/tokens.css" once at your app entry.
 *   2. tailwind.config.js →  presets: [require("./tokens/tailwind.preset.js")]
 *   3. <html data-theme="light"> (or "dark", or omit to follow the OS)
 *
 * Rule: if you find yourself reaching for a raw Tailwind color like
 * `bg-gray-100`, stop. Use `bg-hover` / `bg-sunken` / etc. instead.
 */

module.exports = {
  darkMode: ['variant', '&:is([data-theme="dark"] *)'],
  theme: {
    // Canvas classes. Contiguous, no gaps. See reference/surfaces.md.
    screens: {
      compact:  '320px',   // phone portrait, folded outer display
      medium:   '600px',   // tablet portrait, phone landscape, unfolded
      expanded: '840px',   // tablet landscape, small laptop
      large:    '1200px',  // desktop
      xlarge:   '1600px',  // large desktop, TV at 1920 logical
    },
    extend: {
      colors: {
        // Surfaces
        page:     'var(--surface-page)',
        chrome:   'var(--surface-chrome)',
        raised:   'var(--surface-raised)',
        sunken:   'var(--surface-sunken)',
        overlay:  'var(--surface-overlay)',
        inverse:  'var(--surface-inverse)',
        scrim:    'var(--surface-scrim)',
        hover:    'var(--surface-hover)',
        active:   'var(--surface-active)',
        selected: 'var(--surface-selected)',

        // Control fill — inputs, selects, search fields at rest. This is the
        // DEFAULT way a control shows its edge: a fill step off `page`, not a
        // border. Use `bg-control` / `bg-control-hover`, not `border-line-control`,
        // unless you're in one of the documented exceptions below.
        control: {
          DEFAULT: 'var(--surface-control)',
          hover:   'var(--surface-control-hover)',
        },

        // Text  →  text-fg, text-fg-secondary, …
        fg: {
          DEFAULT:   'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary:  'var(--text-tertiary)',
          disabled:  'var(--text-disabled)',
          inverse:   'var(--text-inverse)',
        },

        // Borders  →  border-line, border-line-subtle, …
        // `control` here is the ≥3:1 exception-only outline — an unchecked
        // checkbox/radio/switch, a Secondary button, or a control that must
        // sit on a surface sharing its own fill. It is NOT the default way an
        // input or select shows its edge; `bg-control` above is.
        line: {
          DEFAULT:  'var(--border-default)',
          subtle:   'var(--border-subtle)',
          chrome:   'var(--border-chrome)',
          control:  'var(--border-control)',
          strong:   'var(--border-strong)',
          focus:    'var(--border-focus)',
          // Transparent in light, hairline in dark. Use on every card,
          // popover, menu, dialog, and toast instead of a flat 1px border.
          elevated: 'var(--border-elevated)',
        },

        // Actions
        primary: {
          DEFAULT:    'var(--action-primary-bg)',
          hover:      'var(--action-primary-bg-hover)',
          active:     'var(--action-primary-bg-active)',
          fg:         'var(--action-primary-fg)',
          disabled:   'var(--action-primary-bg-disabled)',
          'fg-disabled': 'var(--action-primary-fg-disabled)',
        },
        secondary: {
          DEFAULT:      'var(--action-secondary-bg)',
          hover:        'var(--action-secondary-bg-hover)',
          active:       'var(--action-secondary-bg-active)',
          fg:           'var(--action-secondary-fg)',
          line:         'var(--action-secondary-border)',
          'line-hover': 'var(--action-secondary-border-hover)',
        },
        tertiary: {
          DEFAULT: 'var(--action-tertiary-bg)',
          hover:   'var(--action-tertiary-bg-hover)',
          active:  'var(--action-tertiary-bg-active)',
          fg:      'var(--action-tertiary-fg)',
        },

        // Status — these three hues are the ONLY color in the system.
        success: {
          DEFAULT: 'var(--status-success-fg)',
          bg:      'var(--status-success-bg)',
          line:    'var(--status-success-border)',
          solid:   'var(--status-success-solid)',
        },
        warning: {
          DEFAULT: 'var(--status-warning-fg)',
          bg:      'var(--status-warning-bg)',
          line:    'var(--status-warning-border)',
          solid:   'var(--status-warning-solid)',
        },
        danger: {
          DEFAULT: 'var(--status-danger-fg)',
          bg:      'var(--status-danger-bg)',
          line:    'var(--status-danger-border)',
          solid:   'var(--status-danger-solid)',
          action:  'var(--action-danger-bg)',
          'sec-fg':     'var(--action-danger-secondary-fg)',
          'sec-line':   'var(--action-danger-secondary-border)',
          'sec-hover':  'var(--action-danger-secondary-bg-hover)',
          'ter-fg':     'var(--action-danger-tertiary-fg)',
          'ter-hover':  'var(--action-danger-tertiary-bg-hover)',
          'action-hover': 'var(--action-danger-bg-hover)',
          'action-fg':    'var(--action-danger-fg)',
        },
        neutral: {
          DEFAULT: 'var(--status-neutral-fg)',
          bg:      'var(--status-neutral-bg)',
          line:    'var(--status-neutral-border)',
        },

        skeleton: {
          DEFAULT: 'var(--skeleton-base)',
          sheen:   'var(--skeleton-sheen)',
        },

        focus: 'var(--focus-ring)',
      },

      fontFamily: {
        sans: 'var(--font-sans)',
        mono: 'var(--font-mono)',
      },

      // Each entry carries size + line-height + tracking + weight together.
      // Use `text-body`, `text-h1` — never `text-[15px]`.
      fontSize: {
        display: ['48px', { lineHeight: '52px', letterSpacing: '-0.020em', fontWeight: '600' }],
        h1:      ['32px', { lineHeight: '38px', letterSpacing: '-0.014em', fontWeight: '600' }],
        h2:      ['24px', { lineHeight: '30px', letterSpacing: '-0.012em', fontWeight: '600' }],
        h3:      ['20px', { lineHeight: '26px', letterSpacing: '-0.009em', fontWeight: '600' }],
        title:   ['17px', { lineHeight: '24px', letterSpacing: '-0.006em', fontWeight: '600' }],
        'body-lg':['17px',{ lineHeight: '26px', letterSpacing: '-0.006em', fontWeight: '400' }],
        body:    ['15px', { lineHeight: '22px', letterSpacing: '-0.004em', fontWeight: '400' }],
        label:   ['14px', { lineHeight: '20px', letterSpacing: '-0.002em', fontWeight: '500' }],
        caption: ['13px', { lineHeight: '18px', letterSpacing: '0em',      fontWeight: '400' }],
        micro:   ['11px', { lineHeight: '14px', letterSpacing: '0.020em',  fontWeight: '500' }],
      },

      spacing: {
        0: '0px', 1: '2px', 2: '4px', 3: '6px', 4: '8px', 5: '12px',
        6: '16px', 7: '20px', 8: '24px', 9: '32px', 10: '40px',
        11: '48px', 12: '64px', 13: '80px', 14: '96px', 15: '128px',

        // Adaptive — these read the CSS vars, so they grow automatically on
        // coarse pointers and on TV. Prefer them over the fixed values above
        // for anything a finger has to hit.
        'control-sm': 'var(--control-h-sm)',
        'control-md': 'var(--control-h-md)',
        'control-lg': 'var(--control-h-lg)',
        'target':     'var(--hit-target-min)',
        'row':        'var(--row-h)',
        'page':       'var(--page-pad)',

        // Safe areas — notches, home indicators, TV overscan.
        'safe-t': 'var(--safe-top)',
        'safe-r': 'var(--safe-right)',
        'safe-b': 'var(--safe-bottom)',
        'safe-l': 'var(--safe-left)',
      },

      // 4 / 8 / 16 — each step doubles the last, and every value divides
      // cleanly by the 4px space grid. lg and xl are intentionally the same
      // number: cards, popovers, modals, and sheets now share one large
      // radius instead of a 14/20 split.
      borderRadius: {
        xs:      '4px',
        sm:      '4px',
        control: '8px',
        md:      '8px',
        lg:      '16px',
        xl:      '16px',
        full:    '9999px',
      },

      backdropBlur: { chrome: 'var(--chrome-blur)' },

      boxShadow: {
        e1: 'var(--shadow-e1)',
        e2: 'var(--shadow-e2)',
        e3: 'var(--shadow-e3)',
        none: 'none',
      },

      maxWidth: {
        content: '720px',
        app:     '1200px',
        wide:    '1440px',
      },

      transitionDuration: {
        fast:   '120ms',
        base:   '180ms',
        slow:   '260ms',
        slower: '400ms',
      },

      transitionTimingFunction: {
        standard: 'cubic-bezier(0.2, 0, 0, 1)',
        entrance: 'cubic-bezier(0.16, 1, 0.3, 1)',
        exit:     'cubic-bezier(0.4, 0, 1, 1)',
      },

      scale: {
        press: '0.98',
      },

      zIndex: {
        sticky: '100', dropdown: '200', overlay: '300',
        modal: '400', toast: '500', tooltip: '600',
      },

      keyframes: {
        'spin-minimal': { to: { transform: 'rotate(360deg)' } },
        'fade-in':  { from: { opacity: '0' }, to: { opacity: '1' } },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.96)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        spinner:    'spin-minimal 700ms linear infinite',
        'fade-in':  'fade-in 180ms cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scale-in 260ms cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slide-up 260ms cubic-bezier(0.16, 1, 0.3, 1)',
        shimmer:    'shimmer 1400ms cubic-bezier(0.2, 0, 0, 1) infinite',
      },
    },
  },

  plugins: [
    function ({ addVariant }) {
      /**
       * Capability variants. Branch on what the input can do — never on
       * device. A touch laptop is both, and both must work.
       *
       *   can-hover:bg-hover   only where a real pointer exists
       *   touch:h-11           where any pointer is coarse (incl. hybrids)
       *   fine:h-8             precise pointer only
       *   tv:text-body         [data-surface="tv"]
       */
      addVariant('can-hover', '@media (hover: hover) and (pointer: fine)');
      addVariant('touch',     '@media (any-pointer: coarse)');
      addVariant('fine',      '@media (any-pointer: fine)');
      addVariant('stylus',    '@media (any-pointer: fine) and (any-hover: none)');

      // Surfaces CSS cannot detect — set data-surface on <html>.
      addVariant('tv',     '&:is([data-surface="tv"] *)');
      addVariant('watch',  '&:is([data-surface="watch"] *)');
      addVariant('widget', '&:is([data-surface="widget"] *)');

      // Foldables — a hinge sits between the two segments.
      addVariant('folded-h', '@media (horizontal-viewport-segments: 2)');
      addVariant('folded-v', '@media (vertical-viewport-segments: 2)');

      // User preferences.
      addVariant('reduced-motion', '@media (prefers-reduced-motion: reduce)');
      addVariant('more-contrast',  '@media (prefers-contrast: more)');
    },
  ],
};

/**
 * IMPORTANT — always write hover as `can-hover:`, never bare `hover:`.
 *
 * On touch, :hover latches after a tap and sticks until the user taps
 * elsewhere, so a bare hover: state leaves controls looking permanently
 * hovered. `can-hover:` compiles to a media query that touch never matches.
 *
 *   ✗  hover:bg-primary-hover
 *   ✓  can-hover:hover:bg-primary-hover
 */
````

## Bundled file: tokens/tokens.css

````css
/* ==========================================================================
   MINIMAL — Design Tokens
   Monochrome + semantic. Light and dark. One line weight. One radius language.
   --------------------------------------------------------------------------
   Every semantic token is declared ONCE, using light-dark(light, dark).
   There is no duplicated dark-mode block to forget to update.

   Setup:
     <html>                      → follows the OS
     <html data-theme="light">   → forced light
     <html data-theme="dark">    → forced dark

   Requires light-dark() — Chrome 123+, Safari 17.5+, Firefox 120+.
   For older targets, compile these to two static blocks at build time.

   Rule: never write a hex value in a component. Always use a semantic token.
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. PRIMITIVES — the raw ramp. Do not use these directly in components.
   -------------------------------------------------------------------------- */
:root {
  --n-0:    #FFFFFF;
  --n-25:   #FCFCFD;
  --n-50:   #F7F7F8;
  --n-100:  #F1F1F3;
  --n-200:  #E4E4E7;
  --n-300:  #D2D2D8;
  --n-400:  #A5A5AE;
  --n-450:  #8E8E97;  /* lightest gray that clears 3:1 on white */
  --n-500:  #71717A;
  --n-600:  #56565C;
  --n-700:  #3D3D43;
  --n-800:  #26262A;
  --n-900:  #171719;
  --n-950:  #0E0E10;
  --n-1000: #000000;

  /* Dark-side neutrals — the ramp read from the other end. */
  --d-page:    #0E0E10;
  --d-sunken:  #09090B;
  --d-raised:  #18181B;
  --d-overlay: #1C1C20;
  --d-100:     #232327;
  --d-200:     #2E2E33;
  --d-300:     #3A3A41;
  --d-400:     #55555E;
  --d-450:     #6A6A74;  /* lightest gray that clears 3:1 on #0E0E10 */
  --d-500:     #8A8A92;
  --d-550:     #8A8A95;
  --d-600:     #A1A1A8;
  --d-700:     #DEDEE2;
  --d-800:     #F2F2F3;
  --d-disabled:#5A5A62;

  /* Alpha neutrals — washes over unknown backgrounds. */
  --a-black-40: rgba(0, 0, 0, 0.40);
  --a-black-60: rgba(0, 0, 0, 0.60);
  --a-white-6:  rgba(255, 255, 255, 0.06);
  --a-white-8:  rgba(255, 255, 255, 0.08);
  --a-white-10: rgba(255, 255, 255, 0.10);
  --a-white-14: rgba(255, 255, 255, 0.14);

  /* Semantic hues. Three only. Each earns its place. */
  --green-600: #0F7A34;  --green-500: #16A34A;
  --green-400: #4ADE80;  --green-50:  #ECFDF3;  --green-line: #A9E5C0;

  --amber-600: #8A5A00;  --amber-500: #B45309;
  --amber-400: #FBBF24;  --amber-50:  #FFF8EB;  --amber-line: #F4D08A;

  --red-700:   #9A1E14;  --red-600:   #B42318;  --red-550: #C42F33;
  --red-525:   #D93A3F;  --red-500:   #DC2626;
  --red-400:   #F87171;  --red-50:    #FEF2F2;  --red-line: #F2B8B2;
}

/* --------------------------------------------------------------------------
   2. NON-COLOR TOKENS — identical in both themes.
   -------------------------------------------------------------------------- */
:root {
  /* --- Typography --------------------------------------------------------
     Plus Jakarta Sans (SIL Open Font License). Wider and rounder than Inter
     with a large x-height, so the tracking below is ~35% less negative than a
     Inter/SF ramp would use — on this face the tighter values read cramped.
     Load weights 400/500/600 only; there is no bold in the UI. */
  --font-sans: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont,
               "Inter", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --font-mono: ui-monospace, "SF Mono", "SFMono-Regular", "JetBrains Mono",
               Menlo, Consolas, monospace;

  --fw-regular: 400;
  --fw-medium: 500;
  --fw-semibold: 600;

  /* size / line-height / tracking — never mix rows */
  --t-display-size: 48px;
  --t-display-lh: 52px;
  --t-display-ls: -0.020em;

  --t-h1-size: 32px;
  --t-h1-lh: 38px;
  --t-h1-ls: -0.014em;

  --t-h2-size: 24px;
  --t-h2-lh: 30px;
  --t-h2-ls: -0.012em;

  --t-h3-size: 20px;
  --t-h3-lh: 26px;
  --t-h3-ls: -0.009em;

  --t-title-size: 17px;
  --t-title-lh: 24px;
  --t-title-ls: -0.006em;

  --t-body-lg-size: 17px;
  --t-body-lg-lh: 26px;
  --t-body-lg-ls: -0.006em;

  --t-body-size: 15px;
  --t-body-lh: 22px;
  --t-body-ls: -0.004em;

  --t-label-size: 14px;
  --t-label-lh: 20px;
  --t-label-ls: -0.002em;

  --t-caption-size: 13px;
  --t-caption-lh: 18px;
  --t-caption-ls: 0em;

  --t-micro-size: 11px;
  --t-micro-lh: 14px;
  --t-micro-ls: 0.020em;

  /* --- Space — 4px base -------------------------------------------------- */
  --s-0: 0px;    --s-1: 2px;    --s-2: 4px;    --s-3: 6px;
  --s-4: 8px;    --s-5: 12px;   --s-6: 16px;   --s-7: 20px;
  --s-8: 24px;   --s-9: 32px;   --s-10: 40px;  --s-11: 48px;
  --s-12: 64px;  --s-13: 80px;  --s-14: 96px;  --s-15: 128px;

  /* --- Radius --------------------------------------------------------------
     Three steps, each double the last: 4 / 8 / 16. Every radius on every
     project divides cleanly by 4, same as the space scale — 10 (the old
     default) doesn't, and a number that doesn't divide by the grid it sits on
     reads as slightly off even when nobody can say why. --r-xl is gone: cards,
     popovers, modals, and sheets now share one large radius (16) instead of a
     14/20 split that wasn't earning its keep. */
  --r-xs: 4px;        /* chips, tags, badges, checkbox, small indicators */
  --r-sm: 4px;        /* alias of xs — kept for components already using it */
  --r-control: 8px;   /* THE default: buttons, inputs, selects, menu items */
  --r-md: 8px;        /* alias of control */
  --r-lg: 16px;        /* cards, panels, popovers, modals, sheets */
  --r-xl: 16px;        /* alias of lg — modals/sheets no longer get their own step */
  --r-full: 9999px;   /* pills, avatars, toggles */

  /* --- Line weight — there is exactly one --------------------------------- */
  --line: 1px;

  /* --- Motion ------------------------------------------------------------ */
  --d-instant: 0ms;
  --d-fast: 120ms;    /* hover/press on small elements */
  --d-base: 180ms;    /* the default */
  --d-slow: 260ms;    /* modals, sheets arriving */
  --d-slower: 400ms;  /* route transitions */

  --e-standard: cubic-bezier(0.2, 0, 0, 1);
  --e-entrance: cubic-bezier(0.16, 1, 0.3, 1);
  --e-exit: cubic-bezier(0.4, 0, 1, 1);

  --press-scale: 0.98;

  /* --- Layout ------------------------------------------------------------ */
  --container-content: 720px;
  --container-app: 1200px;
  --container-wide: 1440px;
  --gutter: 24px;
  --page-pad-sm: 16px;
  --page-pad-md: 24px;
  --page-pad-lg: 32px;

  /* --- Canvas classes ----------------------------------------------------
     Media queries can't read custom properties, so the literals below are
     repeated in the @media rules in section 5. These exist so JS, container
     queries, and docs read from one place. Ranges are contiguous — no gaps,
     no overlaps. See reference/surfaces.md. */
  --bp-micro:    0px;     /* watch, small widget, mini surface   */
  --bp-compact:  320px;   /* phone portrait, folded outer display */
  --bp-medium:   600px;   /* tablet portrait, phone landscape     */
  --bp-expanded: 840px;   /* tablet landscape, small laptop       */
  --bp-large:    1200px;  /* desktop                              */
  --bp-xlarge:   1600px;  /* large desktop, TV at 1920 logical    */

  /* Page padding per class — set automatically in section 5. */
  --page-pad: 16px;
  /* Columns available at the current class — for grid layouts. */
  --columns: 4;

  /* --- Safe areas — notches, home indicators, rounded corners, overscan --- */
  --safe-top:    env(safe-area-inset-top, 0px);
  --safe-right:  env(safe-area-inset-right, 0px);
  --safe-bottom: env(safe-area-inset-bottom, 0px);
  --safe-left:   env(safe-area-inset-left, 0px);

  /* --- Z-index ----------------------------------------------------------- */
  --z-base: 0;      --z-sticky: 100;  --z-dropdown: 200;
  --z-overlay: 300; --z-modal: 400;   --z-toast: 500;  --z-tooltip: 600;

  /* --- Controls ----------------------------------------------------------
     These are the POINTER baseline. Section 6 raises them automatically for
     coarse pointers and for TV. Component code never branches on device — it
     reads these tokens and the right thing happens. */
  --control-h-sm: 32px;
  --control-h-md: 40px;
  --control-h-lg: 48px;
  --hit-target-min: 44px;   /* the transparent hit area, not the visible box */
  --row-h: 48px;            /* table and list rows */

  /* Focus scale — 1 everywhere except TV, where distance demands it. */
  --focus-scale: 1;
}

/* --------------------------------------------------------------------------
   3. THEME SWITCHING
   -------------------------------------------------------------------------- */
:root                  { color-scheme: light dark; }  /* follow the OS */
:root[data-theme="light"] { color-scheme: light; }
:root[data-theme="dark"]  { color-scheme: dark; }

/* --------------------------------------------------------------------------
   4. SEMANTIC TOKENS — light-dark(LIGHT, DARK). Use only these in components.
   -------------------------------------------------------------------------- */
:root {
  /* --- Surfaces ---------------------------------------------------------- */
  /* Light page is the brightest white. Dark page is a very dark gray,
     never pure black. Light carries depth in shadow; dark carries it in
     surface lightness plus a hairline. */
  --surface-page:     light-dark(var(--n-0),  var(--d-page));
  --surface-raised:   light-dark(var(--n-0),  var(--d-raised));
  --surface-sunken:   light-dark(var(--n-50), var(--d-sunken));
  --surface-overlay:  light-dark(var(--n-0),  var(--d-overlay));
  --surface-inverse:  light-dark(var(--n-950), var(--n-0));
  --surface-scrim:    light-dark(var(--a-black-40), var(--a-black-60));

  /* Filled control surface — inputs, selects, search fields at rest.
     A control's edge is a fill difference against --surface-page, not a
     border; this is deliberately the same value as --surface-sunken (a
     control fill is functionally a shallow well) but named separately so a
     future change to one doesn't silently retune the other. See SKILL.md
     "Controls are filled, not outlined." */
  --surface-control:       light-dark(var(--n-50),  var(--d-sunken));
  --surface-control-hover: light-dark(var(--n-100), var(--d-100));

  /* Washes for hover/press on otherwise transparent things */
  --surface-hover:    light-dark(var(--n-50),  var(--a-white-6));
  --surface-active:   light-dark(var(--n-100), var(--a-white-10));
  --surface-selected: light-dark(var(--n-100), var(--a-white-8));

  /* --- Text -------------------------------------------------------------- */
  --text-primary:   light-dark(var(--n-950), var(--d-800));
  --text-secondary: light-dark(var(--n-600), var(--d-600));
  --text-tertiary:  light-dark(var(--n-500), var(--d-500));
  --text-disabled:  light-dark(var(--n-400), var(--d-disabled));
  --text-inverse:   light-dark(var(--n-0),   var(--n-950));
  --text-link:      light-dark(var(--n-950), var(--d-800));

  /* --- Borders — one weight, four strengths ------------------------------ */
  --border-subtle:  light-dark(var(--n-200), var(--d-100));  /* dividers, used sparingly */
  --border-default: light-dark(var(--n-300), var(--d-200));  /* rare card-on-card edge */
  --border-control: light-dark(var(--n-450), var(--d-450));  /* exceptions only — see note */
  --border-strong:  light-dark(var(--n-500), var(--d-550));  /* hovered control that has a border */
  --border-focus:   light-dark(var(--n-950), var(--d-800));

  /* Raised/Overlay surfaces (cards, popovers, menus, dialogs, toasts): no
     border in light mode, where shadow alone carries the boundary; a hairline
     in dark mode, where shadow barely reads. One token instead of restating
     "except in dark" on every component. */
  --border-elevated: light-dark(transparent, var(--border-subtle));

  /* NOTE on --border-control: this is NOT the default way a control shows its
     edge — --surface-control (a fill difference) is. Reserve --border-control
     for the short, function-required exception list: an unchecked checkbox or
     radio (too small at 16-18px for fill contrast to read reliably) and a
     switch track's off state; a control that must sit directly on a surface
     sharing its own fill; and a Secondary button, whose border IS its entire
     affordance since it carries no fill at rest. Wherever it is used, it must
     still clear ≥3:1 (WCAG 1.4.11) — the technique changed, the accessibility
     requirement didn't. This distinction is intentional, not an oversight. */

  /* --- Icons ------------------------------------------------------------- */
  --icon-primary:   light-dark(var(--n-950), var(--d-800));
  --icon-secondary: light-dark(var(--n-500), var(--d-500));
  --icon-disabled:  light-dark(var(--n-400), var(--d-disabled));
  --icon-inverse:   light-dark(var(--n-0),   var(--n-950));

  /* --- Primary action ---------------------------------------------------- */
  /* Solid black on white; solid white on dark. Hover moves the fill one step
     toward mid-gray (black lightens, white dims) — it reads as lifting toward
     you. Press returns the fill and applies scale(0.98) — pushing down. */
  --action-primary-bg:          light-dark(var(--n-950), var(--n-0));
  --action-primary-bg-hover:    light-dark(var(--n-800), var(--d-700));
  --action-primary-bg-active:   light-dark(var(--n-950), var(--n-0));
  --action-primary-fg:          light-dark(var(--n-0),   var(--n-950));
  --action-primary-bg-disabled: light-dark(var(--n-100), var(--d-100));
  --action-primary-fg-disabled: light-dark(var(--n-400), var(--d-disabled));

  /* --- Secondary action — outline ---------------------------------------- */
  --action-secondary-bg:           transparent;
  --action-secondary-bg-hover:     light-dark(var(--n-50),  var(--a-white-6));
  --action-secondary-bg-active:    light-dark(var(--n-100), var(--a-white-10));
  --action-secondary-fg:           light-dark(var(--n-950), var(--d-800));
  --action-secondary-border:       light-dark(var(--n-300), var(--d-300));
  --action-secondary-border-hover: light-dark(var(--n-400), var(--d-400));

  /* --- Tertiary action — text only; shape appears on hover --------------- */
  --action-tertiary-bg:        transparent;
  --action-tertiary-bg-hover:  light-dark(var(--n-100), var(--a-white-8));
  --action-tertiary-bg-active: light-dark(var(--n-200), var(--a-white-14));
  --action-tertiary-fg:        light-dark(var(--n-950), var(--d-800));

  /* --- Destructive ------------------------------------------------------- */
  /* The one variant exempt from the lightening rule: danger DEEPENS on hover
     in both themes, because white label text must stay above 4.5:1. */
  --action-danger-bg:       light-dark(var(--red-600), var(--red-525));
  --action-danger-bg-hover: light-dark(var(--red-700), var(--red-550));
  --action-danger-fg:       var(--n-0);
  --action-danger-border:   light-dark(var(--red-600), var(--red-525));

  /* --- Destructive, three levels ------------------------------------------
     Solid red is a shout. Reserve it for the moment of commitment — the confirm
     button in a dialog. A destructive option sitting in a row, a menu or a
     toolbar uses the outline or text level instead. */
  --action-danger-secondary-fg:        light-dark(var(--red-600), var(--red-400));
  --action-danger-secondary-border:    light-dark(var(--red-600), var(--red-400));
  --action-danger-secondary-bg-hover:  light-dark(var(--red-50),  rgba(248,113,113,0.12));
  --action-danger-secondary-bg-active: light-dark(var(--red-line),rgba(248,113,113,0.28));
  --action-danger-tertiary-fg:         light-dark(var(--red-600), var(--red-400));
  --action-danger-tertiary-bg-hover:   light-dark(var(--red-50),  rgba(248,113,113,0.12));
  --action-danger-tertiary-bg-active:  light-dark(var(--red-line),rgba(248,113,113,0.28));

  /* --- Focus ring — identical everywhere, never removed ------------------ */
  --focus-ring:        light-dark(var(--n-950), var(--d-800));
  --focus-ring-width:  2px;
  --focus-ring-offset: 2px;

  /* --- Status — the only color in the system ----------------------------- */
  --status-success-fg:     light-dark(var(--green-600), var(--green-400));
  --status-success-bg:     light-dark(var(--green-50),  rgba(74, 222, 128, 0.12));
  --status-success-border: light-dark(var(--green-line),rgba(74, 222, 128, 0.28));
  --status-success-solid:  light-dark(var(--green-500), var(--green-400));

  --status-warning-fg:     light-dark(var(--amber-600), var(--amber-400));
  --status-warning-bg:     light-dark(var(--amber-50),  rgba(251, 191, 36, 0.12));
  --status-warning-border: light-dark(var(--amber-line),rgba(251, 191, 36, 0.28));
  --status-warning-solid:  light-dark(var(--amber-500), var(--amber-400));

  --status-danger-fg:      light-dark(var(--red-600), var(--red-400));
  --status-danger-bg:      light-dark(var(--red-50),  rgba(248, 113, 113, 0.12));
  --status-danger-border:  light-dark(var(--red-line),rgba(248, 113, 113, 0.28));
  --status-danger-solid:   light-dark(var(--red-500), var(--red-400));

  --status-neutral-fg:     light-dark(var(--n-600), var(--d-600));
  --status-neutral-bg:     light-dark(var(--n-100), var(--a-white-8));
  --status-neutral-border: light-dark(var(--n-200), var(--d-200));

  /* --- Elevation --------------------------------------------------------- */
  --shadow-e1:
    0 1px 2px light-dark(rgba(0,0,0,0.04), rgba(0,0,0,0.30)),
    0 1px 1px light-dark(rgba(0,0,0,0.03), rgba(0,0,0,0.20));
  --shadow-e2:
    0 4px 12px light-dark(rgba(0,0,0,0.06), rgba(0,0,0,0.40)),
    0 1px 2px  light-dark(rgba(0,0,0,0.04), rgba(0,0,0,0.24));
  --shadow-e3:
    0 16px 40px light-dark(rgba(0,0,0,0.12), rgba(0,0,0,0.55)),
    0 2px 8px   light-dark(rgba(0,0,0,0.06), rgba(0,0,0,0.32));

  /* --- Skeleton ---------------------------------------------------------- */
  --skeleton-base:  light-dark(var(--n-100), #202024);
  --skeleton-sheen: light-dark(var(--n-50),  #2A2A2F);

  /* --- Chrome material ---------------------------------------------------
     The ONE translucent surface in the system. Sidebars, toolbars, sheets —
     OS-level chrome only. Everything else stays opaque so contrast is never
     a function of what happens to be scrolling underneath.
     72% opacity is the floor at which text on top still clears 4.5:1 over
     arbitrary content. Do not lower it. */
  --surface-chrome: light-dark(rgba(255,255,255,0.72), rgba(24,24,27,0.72));
  --border-chrome:  light-dark(rgba(0,0,0,0.08), rgba(255,255,255,0.10));
  --chrome-blur: 24px;
}

/* Apply to chrome surfaces. Degrades to the flat 72% fill where
   backdrop-filter is unsupported — which is still legible, by design. */
.chrome {
  background: var(--surface-chrome);
  -webkit-backdrop-filter: blur(var(--chrome-blur));
  backdrop-filter: blur(var(--chrome-blur));
}

/* ==========================================================================
   5. ADAPTATION — one component, every surface.
   --------------------------------------------------------------------------
   Nothing here branches on device. It branches on capability (what input can
   reach this?), on canvas size, and on an explicit data-surface attribute for
   the two contexts CSS genuinely cannot detect: TV and watch.

   Component code stays identical everywhere. See reference/surfaces.md.
   ========================================================================== */

/* --- 5a. Canvas classes ---------------------------------------------------
   Contiguous ranges, no gaps, no overlaps. Mobile-first: each overrides the
   last. Defaults above are the micro/compact case. */
@media (min-width: 320px) {
  :root { --page-pad: 16px; --columns: 4; }
}
@media (min-width: 600px) {
  :root { --page-pad: 24px; --columns: 8; }
}
@media (min-width: 840px) {
  :root { --page-pad: 32px; --columns: 12; }
}
@media (min-width: 1200px) {
  :root { --page-pad: 40px; --columns: 12; }
}
@media (min-width: 1600px) {
  :root { --page-pad: 48px; --columns: 12; }
}

/* --- 5b. Input modality ---------------------------------------------------
   `any-pointer: coarse` matches if ANY available pointer is coarse — so a
   touch laptop with a mouse attached still gets touch-sized targets. That is
   deliberate: touch wins the sizing, hover is a bonus layer. */
@media (any-pointer: coarse) {
  :root {
    --control-h-sm: 40px;
    --control-h-md: 44px;
    --control-h-lg: 52px;
    --hit-target-min: 44px;
    --row-h: 56px;
  }
}

/* Hover states must be wrapped in this so they never latch on touch, where
   :hover can stick after a tap.
   Usage:  @media (hover: hover) and (pointer: fine) { .btn:hover { … } }      */

/* --- 5c. Distance: TV / 10-foot ------------------------------------------
   Set <html data-surface="tv">. Only sizes change — weights, tracking, color,
   and radius are untouched, so it still reads as the same family. */
:root[data-surface="tv"] {
  color-scheme: dark;  /* dark is the default at distance */

  --t-display-size: 72px; --t-display-lh: 78px;
  --t-h1-size:      56px; --t-h1-lh:      62px;
  --t-h2-size:      40px; --t-h2-lh:      46px;
  --t-h3-size:      32px; --t-h3-lh:      38px;
  --t-title-size:   28px; --t-title-lh:   36px;
  --t-body-lg-size: 28px; --t-body-lg-lh: 40px;
  --t-body-size:    24px; --t-body-lh:    34px;
  --t-label-size:   22px; --t-label-lh:   30px;
  --t-caption-size: 20px; --t-caption-lh: 28px;
  --t-micro-size:   18px; --t-micro-lh:   24px;  /* the floor at 3m */

  --control-h-sm: 48px;
  --control-h-md: 56px;
  --control-h-lg: 64px;
  --hit-target-min: 56px;
  --row-h: 72px;

  --r-control: 12px;
  --r-lg: 20px;
  --r-xl: 24px;

  /* Focus IS the cursor. This scale is the documented exception to
     "nothing moves" — it's a transform, so it costs no layout, and the grid
     must reserve headroom so neighbours never reflow. */
  --focus-scale: 1.06;
  --focus-ring-width: 2px;
  --focus-ring-offset: 4px;

  /* 5% overscan inset on every edge. */
  --safe-top: 5vh;  --safe-bottom: 5vh;
  --safe-left: 5vw; --safe-right: 5vw;
  --page-pad: 48px;
}

/* --- 5d. Distance: watch / glanceable ------------------------------------
   Set <html data-surface="watch">. One action per screen, vertical only. */
:root[data-surface="watch"] {
  --t-h1-size:      24px; --t-h1-lh:      28px;
  --t-h2-size:      22px; --t-h2-lh:      26px;
  --t-h3-size:      20px; --t-h3-lh:      24px;
  --t-title-size:   18px; --t-title-lh:   22px;
  --t-body-lg-size: 17px; --t-body-lg-lh: 22px;
  --t-body-size:    16px; --t-body-lh:    21px;
  --t-label-size:   15px; --t-label-lh:   20px;
  --t-caption-size: 14px; --t-caption-lh: 18px;
  --t-micro-size:   13px; --t-micro-lh:   16px;  /* the floor on the wrist */

  --control-h-md: 44px;
  --control-h-lg: 52px;
  --hit-target-min: 44px;

  /* Larger radii sit better inside a curved display. */
  --r-control: 16px;
  --r-lg: 20px;
  --r-xl: 28px;

  /* A glance doesn't wait. */
  --d-fast: 100ms;
  --d-base: 150ms;
  --d-slow: 200ms;

  --page-pad: 8px;
}

/* --- 5e. Widgets and mini surfaces ---------------------------------------
   Set <html data-surface="widget">. One idea, no scroll, no navigation.
   The OS owns the container — don't draw your own edge. */
:root[data-surface="widget"] {
  --page-pad: 12px;
  --d-fast: 0ms;   /* widgets are composited, not interacted with */
  --d-base: 0ms;
}
:root[data-surface="widget"] body {
  background: transparent;  /* inherit the system material */
  overflow: hidden;
}

/* --- 5f. Foldables --------------------------------------------------------
   Two viewport segments means a hinge sits between them. Never place a
   primary action, a form field, or running text across it. */
@media (horizontal-viewport-segments: 2) {
  :root {
    --fold-left-width:  env(viewport-segment-width 0 0, 50vw);
    --fold-gap-start:   env(viewport-segment-right 0 0, 50vw);
    --fold-gap-end:     env(viewport-segment-left 1 0, 50vw);
    --fold-gap: calc(var(--fold-gap-end) - var(--fold-gap-start));
  }
}
@media (vertical-viewport-segments: 2) {
  :root {
    --fold-top-height: env(viewport-segment-height 0 0, 50vh);
    --fold-gap-start:  env(viewport-segment-bottom 0 0, 50vh);
    --fold-gap-end:    env(viewport-segment-top 0 1, 50vh);
    --fold-gap: calc(var(--fold-gap-end) - var(--fold-gap-start));
  }
}

/* --------------------------------------------------------------------------
   6. BASELINE — the minimum every project inherits.
   -------------------------------------------------------------------------- */
*, *::before, *::after { box-sizing: border-box; }

html {
  -webkit-text-size-adjust: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0;
  background: var(--surface-page);
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-size: var(--t-body-size);
  line-height: var(--t-body-lh);
  letter-spacing: var(--t-body-ls);
  font-weight: var(--fw-regular);
}

/* Theme switching should feel like a dimmer, not a strobe.
   Only color transitions — never layout. */
body {
  transition: background-color var(--d-base) var(--e-standard),
              color var(--d-base) var(--e-standard);
}

/* One focus treatment, applied globally, never removed.
   --focus-scale is 1 everywhere except TV, where focus is the cursor and
   must be readable from three metres. */
:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring);
  outline-offset: var(--focus-ring-offset);
  border-radius: var(--r-xs);
  transform: scale(var(--focus-scale));
  transition: transform var(--d-base) var(--e-standard);
}
:focus:not(:focus-visible) { outline: none; }

/* Touch: respond immediately, and never let :hover stick after a tap. */
button, a, [role="button"], input, select, textarea, summary {
  touch-action: manipulation;
}

/* Reach 44×44 without changing the visible box or the layout. */
.hit-target { position: relative; }
.hit-target::after {
  content: "";
  position: absolute;
  inset: 50% 50%;
  width: max(100%, var(--hit-target-min));
  height: max(100%, var(--hit-target-min));
  translate: -50% -50%;
}

/* Disclosure — the one place a size change may animate. The trigger must not
   move; only the content below it does. See reference/disclosure.md. */
.disclosure {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows var(--d-slow) var(--e-entrance);
}
.disclosure > * { overflow: hidden; }
.disclosure[data-open] {
  grid-template-rows: 1fr;
  transition: grid-template-rows var(--d-slow) var(--e-entrance);
}
.disclosure:not([data-open]) {
  transition: grid-template-rows var(--d-base) var(--e-exit);
}

::selection {
  background: var(--text-primary);
  color: var(--surface-page);
}

/* Motion is an enhancement, never load-bearing. */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* --------------------------------------------------------------------------
   7. THEME TOGGLE — paste into <head> before any stylesheet to avoid a flash.
   Only needed if you offer a manual light/dark switch; without it the system
   already follows the OS.

   <script>
     (function () {
       var t = localStorage.getItem('theme');
       if (t === 'light' || t === 'dark') {
         document.documentElement.dataset.theme = t;
       }
     })();
   </script>
   -------------------------------------------------------------------------- */
````

## Bundled file: tokens/tokens.json

````json
{
  "$description": "Minimal design tokens. W3C DTCG format. Import into Figma via Tokens Studio or any Variables importer. Three collections: 'primitive' (single mode), 'semantic' (Light + Dark modes), 'scale' (single mode, non-color).",
  "primitive": {
    "$description": "Raw ramp. Never bind a component property to these directly \u2014 bind to semantic.",
    "neutral": {
      "0": {
        "$type": "color",
        "$value": "#FFFFFF"
      },
      "25": {
        "$type": "color",
        "$value": "#FCFCFD"
      },
      "50": {
        "$type": "color",
        "$value": "#F7F7F8"
      },
      "100": {
        "$type": "color",
        "$value": "#F1F1F3"
      },
      "200": {
        "$type": "color",
        "$value": "#E4E4E7"
      },
      "300": {
        "$type": "color",
        "$value": "#D2D2D8"
      },
      "400": {
        "$type": "color",
        "$value": "#A5A5AE"
      },
      "450": {
        "$type": "color",
        "$value": "#8E8E97"
      },
      "500": {
        "$type": "color",
        "$value": "#71717A"
      },
      "600": {
        "$type": "color",
        "$value": "#56565C"
      },
      "700": {
        "$type": "color",
        "$value": "#3D3D43"
      },
      "800": {
        "$type": "color",
        "$value": "#26262A"
      },
      "900": {
        "$type": "color",
        "$value": "#171719"
      },
      "950": {
        "$type": "color",
        "$value": "#0E0E10"
      },
      "1000": {
        "$type": "color",
        "$value": "#000000"
      }
    },
    "green": {
      "600": {
        "$type": "color",
        "$value": "#0F7A34"
      },
      "500": {
        "$type": "color",
        "$value": "#16A34A"
      },
      "400": {
        "$type": "color",
        "$value": "#4ADE80"
      },
      "50": {
        "$type": "color",
        "$value": "#ECFDF3"
      }
    },
    "amber": {
      "600": {
        "$type": "color",
        "$value": "#8A5A00"
      },
      "500": {
        "$type": "color",
        "$value": "#B45309"
      },
      "400": {
        "$type": "color",
        "$value": "#FBBF24"
      },
      "50": {
        "$type": "color",
        "$value": "#FFF8EB"
      }
    },
    "red": {
      "700": {
        "$type": "color",
        "$value": "#9A1E14"
      },
      "600": {
        "$type": "color",
        "$value": "#B42318"
      },
      "550": {
        "$type": "color",
        "$value": "#C42F33"
      },
      "525": {
        "$type": "color",
        "$value": "#D93A3F"
      },
      "500": {
        "$type": "color",
        "$value": "#DC2626"
      },
      "400": {
        "$type": "color",
        "$value": "#F87171"
      },
      "50": {
        "$type": "color",
        "$value": "#FEF2F2"
      }
    },
    "material": {
      "chrome-light": {
        "$type": "color",
        "$value": "#FFFFFFB8"
      },
      "chrome-dark": {
        "$type": "color",
        "$value": "#18181BB8"
      },
      "edge-light": {
        "$type": "color",
        "$value": "#00000014"
      },
      "edge-dark": {
        "$type": "color",
        "$value": "#FFFFFF1A"
      }
    }
  },
  "semantic": {
    "$description": "Bind every component property to these. Two modes: Light and Dark.",
    "light": {
      "surface": {
        "page": {
          "$type": "color",
          "$value": "#FFFFFF"
        },
        "raised": {
          "$type": "color",
          "$value": "#FFFFFF"
        },
        "sunken": {
          "$type": "color",
          "$value": "#F7F7F8"
        },
        "control": {
          "$type": "color",
          "$value": "#F7F7F8",
          "$description": "Filled input/select/search background at rest — the DEFAULT way a control shows its edge, not a border."
        },
        "control-hover": {
          "$type": "color",
          "$value": "#F1F1F3"
        },
        "overlay": {
          "$type": "color",
          "$value": "#FFFFFF"
        },
        "inverse": {
          "$type": "color",
          "$value": "#0E0E10"
        },
        "scrim": {
          "$type": "color",
          "$value": "#00000066"
        },
        "hover": {
          "$type": "color",
          "$value": "#F7F7F8"
        },
        "active": {
          "$type": "color",
          "$value": "#F1F1F3"
        },
        "selected": {
          "$type": "color",
          "$value": "#F1F1F3"
        },
        "chrome": {
          "$type": "color",
          "$value": "#FFFFFFB8"
        }
      },
      "text": {
        "primary": {
          "$type": "color",
          "$value": "#0E0E10"
        },
        "secondary": {
          "$type": "color",
          "$value": "#56565C"
        },
        "tertiary": {
          "$type": "color",
          "$value": "#71717A"
        },
        "disabled": {
          "$type": "color",
          "$value": "#A5A5AE"
        },
        "inverse": {
          "$type": "color",
          "$value": "#FFFFFF"
        },
        "link": {
          "$type": "color",
          "$value": "#0E0E10"
        }
      },
      "border": {
        "subtle": {
          "$type": "color",
          "$value": "#E4E4E7"
        },
        "default": {
          "$type": "color",
          "$value": "#D2D2D8"
        },
        "control": {
          "$type": "color",
          "$value": "#8E8E97"
        },
        "strong": {
          "$type": "color",
          "$value": "#71717A"
        },
        "focus": {
          "$type": "color",
          "$value": "#0E0E10"
        },
        "chrome": {
          "$type": "color",
          "$value": "#00000014"
        },
        "elevated": {
          "$type": "color",
          "$value": "#00000000",
          "$description": "Cards, popovers, menus, dialogs, toasts: transparent in light (shadow carries the boundary), a hairline in dark (see dark mode's value)."
        }
      },
      "icon": {
        "primary": {
          "$type": "color",
          "$value": "#0E0E10"
        },
        "secondary": {
          "$type": "color",
          "$value": "#71717A"
        },
        "disabled": {
          "$type": "color",
          "$value": "#A5A5AE"
        },
        "inverse": {
          "$type": "color",
          "$value": "#FFFFFF"
        }
      },
      "action": {
        "primary": {
          "bg": {
            "$type": "color",
            "$value": "#0E0E10"
          },
          "bg-hover": {
            "$type": "color",
            "$value": "#26262A"
          },
          "bg-active": {
            "$type": "color",
            "$value": "#0E0E10"
          },
          "fg": {
            "$type": "color",
            "$value": "#FFFFFF"
          },
          "bg-disabled": {
            "$type": "color",
            "$value": "#F1F1F3"
          },
          "fg-disabled": {
            "$type": "color",
            "$value": "#A5A5AE"
          }
        },
        "secondary": {
          "bg": {
            "$type": "color",
            "$value": "#FFFFFF00"
          },
          "bg-hover": {
            "$type": "color",
            "$value": "#F7F7F8"
          },
          "bg-active": {
            "$type": "color",
            "$value": "#F1F1F3"
          },
          "fg": {
            "$type": "color",
            "$value": "#0E0E10"
          },
          "border": {
            "$type": "color",
            "$value": "#D2D2D8"
          },
          "border-hover": {
            "$type": "color",
            "$value": "#A5A5AE"
          }
        },
        "tertiary": {
          "bg": {
            "$type": "color",
            "$value": "#FFFFFF00"
          },
          "bg-hover": {
            "$type": "color",
            "$value": "#F1F1F3"
          },
          "bg-active": {
            "$type": "color",
            "$value": "#E4E4E7"
          },
          "fg": {
            "$type": "color",
            "$value": "#0E0E10"
          }
        },
        "danger": {
          "bg": {
            "$type": "color",
            "$value": "#B42318"
          },
          "bg-hover": {
            "$type": "color",
            "$value": "#9A1E14"
          },
          "fg": {
            "$type": "color",
            "$value": "#FFFFFF"
          },
          "border": {
            "$type": "color",
            "$value": "#B42318"
          }
        },
        "danger-secondary": {
          "fg": {
            "$type": "color",
            "$value": "#B42318"
          },
          "border": {
            "$type": "color",
            "$value": "#B42318"
          },
          "bg-hover": {
            "$type": "color",
            "$value": "#FEF2F2"
          },
          "bg-active": {
            "$type": "color",
            "$value": "#F2B8B2"
          }
        },
        "danger-tertiary": {
          "fg": {
            "$type": "color",
            "$value": "#B42318"
          },
          "bg-hover": {
            "$type": "color",
            "$value": "#FEF2F2"
          },
          "bg-active": {
            "$type": "color",
            "$value": "#F2B8B2"
          }
        }
      },
      "focus": {
        "ring": {
          "$type": "color",
          "$value": "#0E0E10"
        }
      },
      "status": {
        "success": {
          "fg": {
            "$type": "color",
            "$value": "#0F7A34"
          },
          "bg": {
            "$type": "color",
            "$value": "#ECFDF3"
          },
          "border": {
            "$type": "color",
            "$value": "#A9E5C0"
          },
          "solid": {
            "$type": "color",
            "$value": "#16A34A"
          }
        },
        "warning": {
          "fg": {
            "$type": "color",
            "$value": "#8A5A00"
          },
          "bg": {
            "$type": "color",
            "$value": "#FFF8EB"
          },
          "border": {
            "$type": "color",
            "$value": "#F4D08A"
          },
          "solid": {
            "$type": "color",
            "$value": "#B45309"
          }
        },
        "danger": {
          "fg": {
            "$type": "color",
            "$value": "#B42318"
          },
          "bg": {
            "$type": "color",
            "$value": "#FEF2F2"
          },
          "border": {
            "$type": "color",
            "$value": "#F2B8B2"
          },
          "solid": {
            "$type": "color",
            "$value": "#DC2626"
          }
        },
        "neutral": {
          "fg": {
            "$type": "color",
            "$value": "#56565C"
          },
          "bg": {
            "$type": "color",
            "$value": "#F1F1F3"
          },
          "border": {
            "$type": "color",
            "$value": "#E4E4E7"
          }
        }
      },
      "skeleton": {
        "base": {
          "$type": "color",
          "$value": "#F1F1F3"
        },
        "sheen": {
          "$type": "color",
          "$value": "#F7F7F8"
        }
      }
    },
    "dark": {
      "surface": {
        "page": {
          "$type": "color",
          "$value": "#0E0E10"
        },
        "raised": {
          "$type": "color",
          "$value": "#18181B"
        },
        "sunken": {
          "$type": "color",
          "$value": "#09090B"
        },
        "control": {
          "$type": "color",
          "$value": "#09090B",
          "$description": "Filled input/select/search background at rest — the DEFAULT way a control shows its edge, not a border."
        },
        "control-hover": {
          "$type": "color",
          "$value": "#232327"
        },
        "overlay": {
          "$type": "color",
          "$value": "#1C1C20"
        },
        "inverse": {
          "$type": "color",
          "$value": "#FFFFFF"
        },
        "scrim": {
          "$type": "color",
          "$value": "#00000099"
        },
        "hover": {
          "$type": "color",
          "$value": "#FFFFFF0F"
        },
        "active": {
          "$type": "color",
          "$value": "#FFFFFF1A"
        },
        "selected": {
          "$type": "color",
          "$value": "#FFFFFF14"
        },
        "chrome": {
          "$type": "color",
          "$value": "#18181BB8"
        }
      },
      "text": {
        "primary": {
          "$type": "color",
          "$value": "#F2F2F3"
        },
        "secondary": {
          "$type": "color",
          "$value": "#A1A1A8"
        },
        "tertiary": {
          "$type": "color",
          "$value": "#8A8A92"
        },
        "disabled": {
          "$type": "color",
          "$value": "#5A5A62"
        },
        "inverse": {
          "$type": "color",
          "$value": "#0E0E10"
        },
        "link": {
          "$type": "color",
          "$value": "#F2F2F3"
        }
      },
      "border": {
        "subtle": {
          "$type": "color",
          "$value": "#232327"
        },
        "default": {
          "$type": "color",
          "$value": "#2E2E33"
        },
        "control": {
          "$type": "color",
          "$value": "#6A6A74"
        },
        "strong": {
          "$type": "color",
          "$value": "#8A8A95"
        },
        "focus": {
          "$type": "color",
          "$value": "#F2F2F3"
        },
        "chrome": {
          "$type": "color",
          "$value": "#FFFFFF1A"
        },
        "elevated": {
          "$type": "color",
          "$value": "#232327",
          "$description": "Same value as border.subtle — dark mode's hairline for cards, popovers, menus, dialogs, toasts, since shadow doesn't read here."
        }
      },
      "icon": {
        "primary": {
          "$type": "color",
          "$value": "#F2F2F3"
        },
        "secondary": {
          "$type": "color",
          "$value": "#8A8A92"
        },
        "disabled": {
          "$type": "color",
          "$value": "#5A5A62"
        },
        "inverse": {
          "$type": "color",
          "$value": "#0E0E10"
        }
      },
      "action": {
        "primary": {
          "bg": {
            "$type": "color",
            "$value": "#FFFFFF"
          },
          "bg-hover": {
            "$type": "color",
            "$value": "#DEDEE2"
          },
          "bg-active": {
            "$type": "color",
            "$value": "#FFFFFF"
          },
          "fg": {
            "$type": "color",
            "$value": "#0E0E10"
          },
          "bg-disabled": {
            "$type": "color",
            "$value": "#232327"
          },
          "fg-disabled": {
            "$type": "color",
            "$value": "#5A5A62"
          }
        },
        "secondary": {
          "bg": {
            "$type": "color",
            "$value": "#0E0E1000"
          },
          "bg-hover": {
            "$type": "color",
            "$value": "#FFFFFF0F"
          },
          "bg-active": {
            "$type": "color",
            "$value": "#FFFFFF1A"
          },
          "fg": {
            "$type": "color",
            "$value": "#F2F2F3"
          },
          "border": {
            "$type": "color",
            "$value": "#3A3A41"
          },
          "border-hover": {
            "$type": "color",
            "$value": "#55555E"
          }
        },
        "tertiary": {
          "bg": {
            "$type": "color",
            "$value": "#0E0E1000"
          },
          "bg-hover": {
            "$type": "color",
            "$value": "#FFFFFF14"
          },
          "bg-active": {
            "$type": "color",
            "$value": "#FFFFFF24"
          },
          "fg": {
            "$type": "color",
            "$value": "#F2F2F3"
          }
        },
        "danger": {
          "bg": {
            "$type": "color",
            "$value": "#D93A3F"
          },
          "bg-hover": {
            "$type": "color",
            "$value": "#C42F33"
          },
          "fg": {
            "$type": "color",
            "$value": "#FFFFFF"
          },
          "border": {
            "$type": "color",
            "$value": "#D93A3F"
          }
        },
        "danger-secondary": {
          "fg": {
            "$type": "color",
            "$value": "#F87171"
          },
          "border": {
            "$type": "color",
            "$value": "#F87171"
          },
          "bg-hover": {
            "$type": "color",
            "$value": "#F871711F"
          },
          "bg-active": {
            "$type": "color",
            "$value": "#F8717147"
          }
        },
        "danger-tertiary": {
          "fg": {
            "$type": "color",
            "$value": "#F87171"
          },
          "bg-hover": {
            "$type": "color",
            "$value": "#F871711F"
          },
          "bg-active": {
            "$type": "color",
            "$value": "#F8717147"
          }
        }
      },
      "focus": {
        "ring": {
          "$type": "color",
          "$value": "#F2F2F3"
        }
      },
      "status": {
        "success": {
          "fg": {
            "$type": "color",
            "$value": "#4ADE80"
          },
          "bg": {
            "$type": "color",
            "$value": "#4ADE801F"
          },
          "border": {
            "$type": "color",
            "$value": "#4ADE8047"
          },
          "solid": {
            "$type": "color",
            "$value": "#4ADE80"
          }
        },
        "warning": {
          "fg": {
            "$type": "color",
            "$value": "#FBBF24"
          },
          "bg": {
            "$type": "color",
            "$value": "#FBBF241F"
          },
          "border": {
            "$type": "color",
            "$value": "#FBBF2447"
          },
          "solid": {
            "$type": "color",
            "$value": "#FBBF24"
          }
        },
        "danger": {
          "fg": {
            "$type": "color",
            "$value": "#F87171"
          },
          "bg": {
            "$type": "color",
            "$value": "#F871711F"
          },
          "border": {
            "$type": "color",
            "$value": "#F8717147"
          },
          "solid": {
            "$type": "color",
            "$value": "#F87171"
          }
        },
        "neutral": {
          "fg": {
            "$type": "color",
            "$value": "#A1A1A8"
          },
          "bg": {
            "$type": "color",
            "$value": "#FFFFFF14"
          },
          "border": {
            "$type": "color",
            "$value": "#2E2E33"
          }
        }
      },
      "skeleton": {
        "base": {
          "$type": "color",
          "$value": "#202024"
        },
        "sheen": {
          "$type": "color",
          "$value": "#2A2A2F"
        }
      }
    }
  },
  "scale": {
    "$description": "Non-color tokens. Single mode \u2014 identical in light and dark.",
    "space": {
      "0": {
        "$type": "dimension",
        "$value": "0px"
      },
      "1": {
        "$type": "dimension",
        "$value": "2px"
      },
      "2": {
        "$type": "dimension",
        "$value": "4px"
      },
      "3": {
        "$type": "dimension",
        "$value": "6px"
      },
      "4": {
        "$type": "dimension",
        "$value": "8px"
      },
      "5": {
        "$type": "dimension",
        "$value": "12px"
      },
      "6": {
        "$type": "dimension",
        "$value": "16px"
      },
      "7": {
        "$type": "dimension",
        "$value": "20px"
      },
      "8": {
        "$type": "dimension",
        "$value": "24px"
      },
      "9": {
        "$type": "dimension",
        "$value": "32px"
      },
      "10": {
        "$type": "dimension",
        "$value": "40px"
      },
      "11": {
        "$type": "dimension",
        "$value": "48px"
      },
      "12": {
        "$type": "dimension",
        "$value": "64px"
      },
      "13": {
        "$type": "dimension",
        "$value": "80px"
      },
      "14": {
        "$type": "dimension",
        "$value": "96px"
      },
      "15": {
        "$type": "dimension",
        "$value": "128px"
      }
    },
    "radius": {
      "$description": "4 / 8 / 16 — each step doubles the last and divides cleanly by the 4px space grid. lg and xl share one value: cards, popovers, modals, and sheets all use the same large radius now.",
      "xs": {
        "$type": "dimension",
        "$value": "4px"
      },
      "sm": {
        "$type": "dimension",
        "$value": "4px"
      },
      "control": {
        "$type": "dimension",
        "$value": "8px"
      },
      "lg": {
        "$type": "dimension",
        "$value": "16px"
      },
      "xl": {
        "$type": "dimension",
        "$value": "16px"
      },
      "full": {
        "$type": "dimension",
        "$value": "9999px"
      }
    },
    "border-width": {
      "line": {
        "$type": "dimension",
        "$value": "1px"
      }
    },
    "control-height": {
      "$description": "Pointer baseline. Raised automatically for coarse pointers and TV \u2014 see the target-size collection and reference/surfaces.md.",
      "sm": {
        "$type": "dimension",
        "$value": "32px"
      },
      "md": {
        "$type": "dimension",
        "$value": "40px"
      },
      "lg": {
        "$type": "dimension",
        "$value": "48px"
      }
    },
    "control-height-touch": {
      "$description": "Applied under @media (any-pointer: coarse) \u2014 including touch laptops with a mouse attached.",
      "sm": {
        "$type": "dimension",
        "$value": "40px"
      },
      "md": {
        "$type": "dimension",
        "$value": "44px"
      },
      "lg": {
        "$type": "dimension",
        "$value": "52px"
      }
    },
    "control-height-tv": {
      "$description": "Applied under [data-surface=\"tv\"], for directional navigation at ~3m.",
      "sm": {
        "$type": "dimension",
        "$value": "48px"
      },
      "md": {
        "$type": "dimension",
        "$value": "56px"
      },
      "lg": {
        "$type": "dimension",
        "$value": "64px"
      }
    },
    "target-min": {
      "$description": "Minimum hit area by input modality. Grow the hit area, never the visible box.",
      "pointer": {
        "$type": "dimension",
        "$value": "32px"
      },
      "touch": {
        "$type": "dimension",
        "$value": "44px"
      },
      "directional": {
        "$type": "dimension",
        "$value": "56px"
      }
    },
    "breakpoint": {
      "$description": "Canvas classes. Contiguous ranges, no gaps or overlaps. See reference/surfaces.md.",
      "micro": {
        "$type": "dimension",
        "$value": "0px"
      },
      "compact": {
        "$type": "dimension",
        "$value": "320px"
      },
      "medium": {
        "$type": "dimension",
        "$value": "600px"
      },
      "expanded": {
        "$type": "dimension",
        "$value": "840px"
      },
      "large": {
        "$type": "dimension",
        "$value": "1200px"
      },
      "xlarge": {
        "$type": "dimension",
        "$value": "1600px"
      }
    },
    "page-pad": {
      "$description": "Page padding per canvas class.",
      "micro": {
        "$type": "dimension",
        "$value": "8px"
      },
      "compact": {
        "$type": "dimension",
        "$value": "16px"
      },
      "medium": {
        "$type": "dimension",
        "$value": "24px"
      },
      "expanded": {
        "$type": "dimension",
        "$value": "32px"
      },
      "large": {
        "$type": "dimension",
        "$value": "40px"
      },
      "xlarge": {
        "$type": "dimension",
        "$value": "48px"
      }
    },
    "container": {
      "content": {
        "$type": "dimension",
        "$value": "720px"
      },
      "app": {
        "$type": "dimension",
        "$value": "1200px"
      },
      "wide": {
        "$type": "dimension",
        "$value": "1440px"
      }
    },
    "duration": {
      "instant": {
        "$type": "duration",
        "$value": "0ms"
      },
      "fast": {
        "$type": "duration",
        "$value": "120ms"
      },
      "base": {
        "$type": "duration",
        "$value": "180ms"
      },
      "slow": {
        "$type": "duration",
        "$value": "260ms"
      },
      "slower": {
        "$type": "duration",
        "$value": "400ms"
      }
    },
    "easing": {
      "standard": {
        "$type": "cubicBezier",
        "$value": [
          0.2,
          0,
          0,
          1
        ]
      },
      "entrance": {
        "$type": "cubicBezier",
        "$value": [
          0.16,
          1,
          0.3,
          1
        ]
      },
      "exit": {
        "$type": "cubicBezier",
        "$value": [
          0.4,
          0,
          1,
          1
        ]
      }
    },
    "shadow": {
      "e1": {
        "$type": "shadow",
        "$value": [
          {
            "color": "#0000000A",
            "offsetX": "0px",
            "offsetY": "1px",
            "blur": "2px",
            "spread": "0px"
          },
          {
            "color": "#00000008",
            "offsetX": "0px",
            "offsetY": "1px",
            "blur": "1px",
            "spread": "0px"
          }
        ]
      },
      "e2": {
        "$type": "shadow",
        "$value": [
          {
            "color": "#0000000F",
            "offsetX": "0px",
            "offsetY": "4px",
            "blur": "12px",
            "spread": "0px"
          },
          {
            "color": "#0000000A",
            "offsetX": "0px",
            "offsetY": "1px",
            "blur": "2px",
            "spread": "0px"
          }
        ]
      },
      "e3": {
        "$type": "shadow",
        "$value": [
          {
            "color": "#0000001F",
            "offsetX": "0px",
            "offsetY": "16px",
            "blur": "40px",
            "spread": "0px"
          },
          {
            "color": "#0000000F",
            "offsetX": "0px",
            "offsetY": "2px",
            "blur": "8px",
            "spread": "0px"
          }
        ]
      }
    },
    "typography-tv": {
      "$description": "[data-surface=\"tv\"] \u2014 ~3m viewing. Plus Jakarta Sans. Only sizes change; weights, tracking, color and radius are untouched, so it reads as the same family.",
      "display": {
        "$type": "typography",
        "$value": {
          "fontSize": "72px",
          "lineHeight": "78px"
        }
      },
      "h1": {
        "$type": "typography",
        "$value": {
          "fontSize": "56px",
          "lineHeight": "62px"
        }
      },
      "h2": {
        "$type": "typography",
        "$value": {
          "fontSize": "40px",
          "lineHeight": "46px"
        }
      },
      "h3": {
        "$type": "typography",
        "$value": {
          "fontSize": "32px",
          "lineHeight": "38px"
        }
      },
      "title": {
        "$type": "typography",
        "$value": {
          "fontSize": "28px",
          "lineHeight": "36px"
        }
      },
      "body-lg": {
        "$type": "typography",
        "$value": {
          "fontSize": "28px",
          "lineHeight": "40px"
        }
      },
      "body": {
        "$type": "typography",
        "$value": {
          "fontSize": "24px",
          "lineHeight": "34px"
        }
      },
      "label": {
        "$type": "typography",
        "$value": {
          "fontSize": "22px",
          "lineHeight": "30px"
        }
      },
      "caption": {
        "$type": "typography",
        "$value": {
          "fontSize": "20px",
          "lineHeight": "28px"
        }
      },
      "micro": {
        "$type": "typography",
        "$value": {
          "fontSize": "18px",
          "lineHeight": "24px"
        }
      }
    },
    "typography-watch": {
      "$description": "[data-surface=\"watch\"] \u2014 ~30cm, glanceable. Plus Jakarta Sans. Floor is 13px.",
      "h1": {
        "$type": "typography",
        "$value": {
          "fontSize": "24px",
          "lineHeight": "28px"
        }
      },
      "h2": {
        "$type": "typography",
        "$value": {
          "fontSize": "22px",
          "lineHeight": "26px"
        }
      },
      "h3": {
        "$type": "typography",
        "$value": {
          "fontSize": "20px",
          "lineHeight": "24px"
        }
      },
      "title": {
        "$type": "typography",
        "$value": {
          "fontSize": "18px",
          "lineHeight": "22px"
        }
      },
      "body-lg": {
        "$type": "typography",
        "$value": {
          "fontSize": "17px",
          "lineHeight": "22px"
        }
      },
      "body": {
        "$type": "typography",
        "$value": {
          "fontSize": "16px",
          "lineHeight": "21px"
        }
      },
      "label": {
        "$type": "typography",
        "$value": {
          "fontSize": "15px",
          "lineHeight": "20px"
        }
      },
      "caption": {
        "$type": "typography",
        "$value": {
          "fontSize": "14px",
          "lineHeight": "18px"
        }
      },
      "micro": {
        "$type": "typography",
        "$value": {
          "fontSize": "13px",
          "lineHeight": "16px"
        }
      }
    },
    "typography": {
      "$description": "Default \u2014 arm's length (~35-60cm). Plus Jakarta Sans, weights 400/500/600. Tracking is ~35% less negative than an Inter/SF ramp because Plus Jakarta is wider with a large x-height. Figma style strings are Regular/Medium/SemiBold \u2014 SemiBold has no space.",
      "display": {
        "$type": "typography",
        "$value": {
          "fontFamily": "Plus Jakarta Sans",
          "fontWeight": "600",
          "fontSize": "48px",
          "lineHeight": "52px",
          "letterSpacing": "-0.020em"
        }
      },
      "h1": {
        "$type": "typography",
        "$value": {
          "fontFamily": "Plus Jakarta Sans",
          "fontWeight": "600",
          "fontSize": "32px",
          "lineHeight": "38px",
          "letterSpacing": "-0.014em"
        }
      },
      "h2": {
        "$type": "typography",
        "$value": {
          "fontFamily": "Plus Jakarta Sans",
          "fontWeight": "600",
          "fontSize": "24px",
          "lineHeight": "30px",
          "letterSpacing": "-0.012em"
        }
      },
      "h3": {
        "$type": "typography",
        "$value": {
          "fontFamily": "Plus Jakarta Sans",
          "fontWeight": "600",
          "fontSize": "20px",
          "lineHeight": "26px",
          "letterSpacing": "-0.009em"
        }
      },
      "title": {
        "$type": "typography",
        "$value": {
          "fontFamily": "Plus Jakarta Sans",
          "fontWeight": "600",
          "fontSize": "17px",
          "lineHeight": "24px",
          "letterSpacing": "-0.006em"
        }
      },
      "body-lg": {
        "$type": "typography",
        "$value": {
          "fontFamily": "Plus Jakarta Sans",
          "fontWeight": "400",
          "fontSize": "17px",
          "lineHeight": "26px",
          "letterSpacing": "-0.006em"
        }
      },
      "body": {
        "$type": "typography",
        "$value": {
          "fontFamily": "Plus Jakarta Sans",
          "fontWeight": "400",
          "fontSize": "15px",
          "lineHeight": "22px",
          "letterSpacing": "-0.004em"
        }
      },
      "label": {
        "$type": "typography",
        "$value": {
          "fontFamily": "Plus Jakarta Sans",
          "fontWeight": "500",
          "fontSize": "14px",
          "lineHeight": "20px",
          "letterSpacing": "-0.002em"
        }
      },
      "caption": {
        "$type": "typography",
        "$value": {
          "fontFamily": "Plus Jakarta Sans",
          "fontWeight": "400",
          "fontSize": "13px",
          "lineHeight": "18px",
          "letterSpacing": "0.000em"
        }
      },
      "micro": {
        "$type": "typography",
        "$value": {
          "fontFamily": "Plus Jakarta Sans",
          "fontWeight": "500",
          "fontSize": "11px",
          "lineHeight": "14px",
          "letterSpacing": "0.020em"
        }
      }
    },
    "blur": {
      "$description": "The only blur in the system. OS-level chrome only.",
      "chrome": {
        "$type": "dimension",
        "$value": "24px"
      }
    }
  }
}
````
