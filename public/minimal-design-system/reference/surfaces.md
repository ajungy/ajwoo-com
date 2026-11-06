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
