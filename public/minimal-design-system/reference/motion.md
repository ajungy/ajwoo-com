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
