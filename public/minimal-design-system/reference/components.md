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
