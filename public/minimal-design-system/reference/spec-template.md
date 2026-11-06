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
