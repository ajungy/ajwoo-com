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
