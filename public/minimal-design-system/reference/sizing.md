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
