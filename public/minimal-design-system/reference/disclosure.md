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
