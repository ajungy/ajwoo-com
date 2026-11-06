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
