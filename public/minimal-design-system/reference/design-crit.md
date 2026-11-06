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
