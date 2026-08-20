# ajwoo.com — build contract

Architecture document. Nothing gets built that isn't argued for here first.

Inherits from the **minimal** design system. That file is the constitution; this
file is the local statute. Where they conflict, minimal wins unless the conflict
is logged below under *Documented extensions* with a constraint that resolves it.

System resolved at:
`~/Library/Application Support/Claude/local-agent-mode-sessions/skills-plugin/96909dae-.../skills/minimal`
(`/mnt/skills/user/minimal/` does not exist on this machine — same content, different path.)

---

## 0. Job to be done

> **A visitor deciding whether Alex Woo is worth their time reaches that decision
> inside one scroll, and acts on it in one click — book 20 minutes, or get an app.**

This sharpens your sentence in three ways, and you should push back if you disagree:

1. **The visitor's job is to decide, not to learn.** "Knows who I am" is *your*
   goal. Theirs is a go/no-go on spending time with you. Framing it as their
   decision is what tells us which facts earn a place on the landing page: only
   the ones that move the decision. Netflix Design Lead moves it. Le Cordon Bleu
   probably moves it (it's memorable and it's evidence of range). A 2013 award
   almost certainly doesn't move it above the fold.
2. **Three audiences collapse into one.** Hiring manager, design peer, curious
   developer all run the same evaluation and want the same evidence. Designing
   for three personas would produce three landing pages stacked on top of each
   other. There is one.
3. **"One click," not "one of two actions."** The count that matters is the
   distance to done, not the size of the menu.

### The two-actions / one-emphasis reconciliation

Your brief asks for exactly two actions site-wide. Principle 2 allows exactly one
primary per view. These are compatible, and the resolution is load-bearing:

| View | The one primary | The other action |
|---|---|---|
| `/` | **Book 20 minutes** (primary button) | Apps reachable as a nav destination, not a second emphasis |
| `/apps` | **one** flagship app's Get action | every other card's action is secondary |
| `/design`, `/coffee` | Book 20 minutes (persists in nav, secondary) | — |

"Book 20 minutes" appears in the top-right global cluster on every page as a
**secondary** button, and as the **primary** in the landing hero. Same action,
one emphasis, short path from anywhere. It is never two primaries.

**Open decision (D1):** `/apps` needs a flagship — the one app whose action gets
the primary. Name it, or I'll make every card secondary and the page will carry
no primary at all, which is a defensible but weaker reading of Principle 2.

---

## 1. Hard constraint — local only

Restating §2b as an operating rule because it governs every later phase.

**Will not happen without an explicit yes in conversation:** any deploy or
hosting CLI (`vercel`, `netlify`, `wrangler`, `gh-pages`, `firebase`), `git push`,
creating a remote or public repo, any DNS/registrar/WordPress mutation, any write
to a Figma file, any live payment key or live payment resource.

**Will happen:** `next dev` / `next build && next start` on localhost (port
reported each time), local git commits, `.env.local` gitignored with a committed
`.env.example` of placeholders only, `DEPLOY.md` maintained from Phase 1 and
never executed.

Live ajwoo.com stays untouched and reachable. Phase 0 reads it; it never writes.
Cutover is a config change: no hardcoded localhost, `NEXT_PUBLIC_SITE_URL` for
anything absolute, relative paths everywhere else.

The working directory is **not currently a git repository.** Phase 1 runs
`git init` locally, with no remote configured. Say if you'd rather it stayed
untracked.

---

## 2. Stack decisions

| Decision | Choice | Why |
|---|---|---|
| Framework | Next.js App Router + TypeScript, `output: 'export'` | Static export is achievable **only if** the payment provider is Polar or Gumroad — see D2. Stripe forces a server route. |
| CSS | Tailwind **v3.4**, `presets: [minimal preset]` | The preset is a v3 CommonJS module using `presets` + a `plugin({addVariant})`. Tailwind v4's CSS-first `@theme` config cannot consume it without a rewrite, and rewriting the system's preset is exactly the kind of drift §16 forbids. v3.4 uses it as shipped. |
| Animation library | **None** | Two effects total: one CSS transition (entrance) and one `requestAnimationFrame` transform loop (cursor). Framer Motion is ~34kB gzipped to do what 40 lines of CSS does, and its imperative API makes it easy to violate the "only opacity/transform/color" rule without noticing. Rejected. |
| Fonts | Self-hosted **Plus Jakarta Sans** variable via `next/font/local` | See §3. Self-hosted, not the Google CDN — no third-party request, no FOUT dependency on a network we don't control. |
| Icons | The system's 221-icon set, 1.5px stroke, inlined as SVG | No icon package. See `reference/icons-and-illustrations.md`. |
| Content | Typed TS modules for structured data (apps, clients, awards, work index); MDX only where there is real prose (coffee reviews, case-study bodies) | A CMS for four pages is the step Principle 12 tells us to remove. |
| Images | Pre-optimized at build with `sharp` → AVIF + WebP + fallback, plain `<img>` with explicit `width`/`height` and `srcset` | `next/image` does not optimize under `output: 'export'` without a custom loader. Explicit dimensions are non-negotiable: an image without them is a layout shift, and layout shift is a Principle 4 failure. |
| WordPress | Fully severed | No `wp-content` URL survives into the build. Every kept asset is downloaded, re-encoded, and served from `/public`. |
| Theme | Follow the OS. No toggle. | See rejections log. |

**Flagged coupling:** the payment decision (D2) determines whether this site can
be a pure static export. Decide D2 before Phase 6, not during it.

---

## 3. Type — one family, no pairing

**Recommendation: Plus Jakarta Sans alone, weights 400 / 500 / 600, plus the
system `--font-mono` for tabular metadata only.** No second face.

Reasoning, since you asked for a pairing and I'm proposing you don't buy one:

- **The tracking ramp is the craft signal, not the face.** The system's ramp is
  already retuned ~35% less negative for Plus Jakarta's width and x-height. Swap
  the face and every one of those ten tracking values is wrong until re-tuned by
  hand — §2 says this explicitly. That's real work whose only payoff is
  distinctiveness, and distinctiveness is not the job (§0).
- **Portfolio sites are where a distinctive face reads as least distinctive.**
  The faces a designer reaches for here — Söhne, GT America, Neue Haas Grotesk,
  a variable serif for the wordmark — are so consistently used for this exact
  purpose that they now signal *portfolio* rather than *taste*.
- **§16 says type is identical across every project.** A different face here
  means this site is not the same system as everything else you ship.
- What actually reads as expensive in this system: 64px between major regions,
  ≤72-character measure, one line weight, and three weights used with discipline.
  Those are free. A licensed display face is not.

**Where mono earns its place:** coffee scores, roast dates, award years — figures
that sit in columns and should align. `--font-mono` already exists in the tokens,
so this is not an addition. Used nowhere else.

**If you want the pairing anyway,** the smallest version that doesn't fight the
system: one display face used *only* at the `display` step on `/`, nowhere else,
with a hand-tuned tracking value for that one step documented as a §9 addition.
Say the word and I'll spec it. I'd rather not.

---

## 4. Information architecture

```
/          landing    identity · one primary action · entry to the three sections
/design    selected work
/coffee    reviews
/apps      gallery — free downloads and paid apps
/work/<slug>  project detail — 22 pages (added after Phase 0; the live site
              carries no prose on these, only image stacks)
```

**Chrome, identical on every page** (Principle 3, 17, and the app-shell spec):

- **Top-left:** `Alex Woo` wordmark, always a link to `/`. One action to home,
  same pixel position, every page, every canvas class.
- **Top-right:** the global cluster — three destinations (Design, Coffee, Apps)
  and `Book 20 minutes` as a secondary button, 8px gaps inside the cluster,
  ≥24px from the wordmark.
- **Current location always indicated** — the active destination sits at
  `--text-primary` while the others sit at `--text-secondary`. No underline
  indicator; the contrast step is the indicator and it costs no reserved space.

**Compact (<600px):** no hamburger. The three destinations are three short words
that fit; hiding them behind a drawer would cost an interaction and buy nothing.
Top bar carries wordmark left + `Book 20 min` right; the three destinations sit
in a single row directly beneath, visible at rest.

**Density check** — the budget is per `reference/disclosure.md`:

| Canvas | Primary | Total interactive in chrome | Budget | Pass |
|---|---|---|---|---|
| compact | 1 | 5 (wordmark, 3 links, CTA) | ≤5 | pass, at the ceiling |
| medium | 1 | 5 | ≤9 | pass |
| expanded/large | 1 | 5 | ≤15 | pass |

Compact sits exactly at the ceiling, which means **no chrome element may be added
at compact without removing one.** Recording that here so it isn't quietly
violated in Phase 4.

---

## 5. Component budget — the subtraction log

Per §4b's minimalism-first rule: each screen's list starts empty. Below is what
I intend to argue for, and what I've already rejected. This is provisional — the
Figma inventory (Phase 2) may replace hand-rolled entries with published
components, which is the preferred outcome in every case.

### Proposed, per screen

| Screen | Components | Justification |
|---|---|---|
| all | App shell (top bar), Button (primary/secondary/tertiary), Link | The floor. Nothing renders without them. |
| `/` | + nothing | Identity is type. The work entries are links. There is no card, no hero component, no carousel. |
| `/design` | + Card (interactive) *or* a linked list — **undecided, see below** | |
| `/coffee` | + a linked list, mono for scores | Reviews are prose behind titles. A grid of cards for text content is decoration. |
| `/apps` | + Card (raised, non-interactive container), Badge | §6 mandates cards here. Badge carries free/paid state as a word plus its neutral token. |

**`/design` — card vs. list, deferred to Phase 0.** If the work images survive
the inventory at a quality that makes them evidence, they are the argument and
`/design` is images. If they don't, cards around soft PNGs will make the page
look cheaper than plain type would, and it becomes a titled list. **I can't
decide this before I've seen the assets.** Flagging rather than guessing.

### Rejected, with reasons

| Considered | Rejected because |
|---|---|
| ~~Theme toggle~~ | **Reversed on Alex's instruction (built).** The original reasoning stands and is worth keeping on the record: the system says omit `data-theme` and follow the OS, and a toggle changes a preference the OS already knows. Two consequences accepted: compact chrome now holds **6** interactive elements against a budget of 5 (§4), and there are two more states to verify. It starts from the OS and only writes `data-theme` once the user chooses, so anyone who ignores it still gets the system's intended behaviour. |
| Hamburger / drawer nav | Three destinations, three short words. Hiding a visible affordance to save 150px is a Principle 5 risk for no gain. |
| Calendly inline embed | ~200kB of third-party iframe, its own type and color, its own focus behavior, and a `--surface` we don't control. A plain link to the Calendly page is the same number of clicks to booked and costs nothing. Rejected — the CTA is an `<a>`. |
| Modal for app details | Nothing on `/apps` requires a decision, which is the only thing a Dialog is for (`taxonomy.md`). Detail is a page or it is on the card. |
| Scroll-triggered reveals | Explicitly forbidden by §5(a) and Principle 5 — content hidden until scrolled to. |
| Testimonials / logo wall | The clients list is content; a marquee of logos is mood. |
| Filter/sort on `/design` and `/coffee` | Not enough items to need it. Principle 12 — the control must earn itself, and at this volume it can't. |
| Search | Four pages. Search is a Tier-3 answer to a problem this site doesn't have. |
| Footer nav duplicating the top bar | The top bar is 5 elements away at all times. |
| "Single Edit" / "Column Edit" strings | WordPress builder artifacts. Argued against in Phase 0 as instructed — they are UI chrome from an editor leaking into published content and mean nothing to a reader. |
| `javascript-snow` script | Auto-animating decoration. Fails Principle 14 outright ("nothing moves unless the user caused it or is waiting on it"), fails "the screen is calm at rest," and is unrelated to the job to be done. Cut. |

---

## 6. Documented extensions

Three §9 considered additions. Each states the constraint that makes it
compatible with the system, and what I'll do if the constraint can't be met.

### (a) Entrance sequence

**Grant:** page arrival is a user-caused event, so a single entrance does not
violate Principle 14. Nothing else on the site auto-animates, ever.

**Spec:**

- **Animates exactly one element:** the identity display line on `/` — the
  single most important element on the page (Principle 1). Not the wordmark, not
  a cascade.
- **Motion:** `opacity 0→1` and `translateY(6px)→0`. Composite-only. Both are on
  the permitted list.
- **Duration: 400ms** (`--d-slower`) with `--e-entrance`. No delay, no stagger.
  This is well inside your ≤1200ms ceiling, and under budget is the right place
  to be — `--e-entrance` covers ~70% of the distance in the first 130ms, so it
  reads as crisp rather than slow. **No new duration token is introduced.**
- **Never blocks:** the element is in the DOM, in final position, and hit-testable
  at 0ms. Only its paint is animated.
- **Once per session** via `sessionStorage`. Never on client-side route changes.
- **Reduced motion:** final state, immediately, no exception.

**Implementation note that matters:** an inline script in `<head>` reads
`sessionStorage` and sets `data-entrance` on `<html>` **before first paint**. CSS
keys off that attribute. Without this, the first frame shows the pre-animation
state and the fix becomes a flash — worse than no entrance at all. Reduced motion
is handled in CSS, so it wins regardless of what the script did.

**On which element:** you offered three — type settling, a rule drawing, the
wordmark resolving. I'm taking type settling because it's the one that animates
*the most important element* rather than a piece of structure next to it. A rule
drawing across is the more novel gesture and I'd happily build it instead, but it
puts the only motion on a divider while the largest type sits beside it, which
splits emphasis. **Say if you want the rule; it's a one-line change in Phase 7.**

### (b) The cursor — a drop of water

**Revised on Alex's direction.** The earlier spec was a black pill carrying a
verb. It is now an actual drop of water: transparent, refracting, deforming as
it moves, and swelling to cover whatever you can click.

**Two objects, with different jobs — this split is what keeps it usable:**

| | Job |
|---|---|
| **The dot** (5px) | The truth. Sits exactly under the pointer with **zero lag**, so precision is never in question. |
| **The drop** | The physics. Chases the dot and arrives late, stretches along its direction of travel, settles when it stops. |

Without the dot, a laggy cursor would be a usability tax — you would not know
where you were actually pointing. The dot pays that debt, which is what buys the
drop permission to be slow and physical.

**Over an interactive target,** the drop swells to *become* that target:

- **Small targets** (≤300×88 — buttons, nav links): the drop takes the element's
  exact size, position and corner radius, plus 8px of spread. **No label** — the
  element's own text refracts up through the water, and a second label on top
  would be the same word twice.
- **Large targets** (cards, tiles): covering a 370px card would be a blob, so the
  drop becomes a 96px bubble carrying a **maximum of two words** (`See project`,
  `Read review`, `Book time`). Enforced in code by `twoWords()`, not by
  discipline.

**Making it look like water rather than frosted glass.** Four things do the work,
and the first attempt failed because it only had two of them:

1. **It bends what is behind it.** An SVG `feDisplacementMap` driven by a
   generated lens map — red encodes x-offset, green y-offset, and a radial mask
   makes the bend fall to zero toward the centre. So the middle is optically
   clean and the distortion lives in the last third near the rim, which is how a
   real droplet behaves. Applied via `backdrop-filter: url(#dropletLens)`.
2. **Fresnel.** Mirror-bright seen edge-on, invisible through the middle.
3. **Total internal reflection.** Against a *light* surface a real drop shows a
   **dark** ring, not a bright one — `--water-rim-dark`. Without this the drop
   disappears on white.
4. **It deforms.** Stretch along travel, squeeze across it, volume conserved.
   Suppressed once settled over a target, which should look calm.

**The glints are deliberately outside the deforming layer.** As a real drop
rolls, its highlight stays put relative to the light rather than turning with the
body. Anchoring them is most of what sells the roll.

**Why this is not a Principle 14 violation:** nothing moves unless the pointer
moves. Stop moving and the drop settles and holds. There is no clock anywhere in
it.

**Constraints unchanged:** enhancement only — every target carries its verb
visibly at rest and in its accessible name; gated on `(any-pointer: fine)` and
`prefers-reduced-motion: no-preference`; keyboard users get the full 2px focus
ring and never need the cursor; zero layout shift, since the drop is
`position: fixed` and out of flow.

**Known gap:** Safari does not support an SVG filter reference in
`backdrop-filter`, so it gets a small blur instead of true refraction. Rim,
glints, shadow and deformation still apply.

**Tuning knobs, in the order to reach for them:** `FOLLOW` (0.16 — lower is more
lag), `MORPH` (0.22), `STRETCH` (0.055).

### (d) The typing verb in the headline — a documented deviation, not an extension

**Moved on Alex's instruction from the hero photo into the headline itself.**
The h1 now reads "Alex Woo ___ creative tools at Netflix.", with the verb
cycling designs -> builds -> codes -> creates -> pioneers -> looping. Everything
else in that sentence is fixed text; only the one word types and deletes.

**This one breaks Principle 14 and I am not going to pretend otherwise.** A
typing loop is time-driven: it moves when nobody has touched anything. That is
the exact thing the principle forbids, and it is the same objection that got the
`javascript-snow` script cut in Phase 0.

Alex asked for it directly, so it ships with the two guards that keep it from
being the worst version of itself:

1. **`prefers-reduced-motion: reduce` renders the first phrase statically** and
   never starts a timer.
2. **It stops when the hero scrolls out of view** (IntersectionObserver), so it
   is not burning frames behind the rest of the page.

It is also not announced to assistive tech — a caption rewriting itself every
70ms would flood a screen reader — so the nine phrases are exposed once, as
static text, in a visually-hidden span.

**Tried and reverted: reserving the longest word's width so the headline never
re-breaks.** An inline-block sized to "pioneers" inside wrapping text does not
just reserve space — it forces the browser to lay the rest of the line out
around a rigid box, which broke the wrap entirely (words landed on the wrong
line, one floated free of the sentence). The word is plain inline text now, and
the headline may shift by a few pixels as the word's length changes. Accepted
rather than fixed further; the alternative was worse.

**The hero photo and the on-media tokens stay in the codebase** (`--on-media-*`
in `globals.css`, the `on-media` Action variant) even though nothing currently
renders on top of the photo — Email/LinkedIn/Instagram moved to sit under the
bio instead, at Alex's direction. Removing the tokens outright would be
premature; nothing else needs deleting to make that move.

### (c) The liquid material

**Superseded by (b).** The conic-gradient edge ring was a stand-in for water on a
black pill. Now that the cursor *is* water, the material is the drop itself and
the tokens are `--water-*` — body, rim, glint, caustic, shadow, contact — defined
in the extensions block of the project's CSS. Never a raw hex in the component.

**Confinement:** the cursor pill's 1–2px border only. Not cards, not nav, not
modals, not the top bar. The page stays opaque. `--surface-chrome` remains the
system's only translucent surface and this does not touch it.

**Construction:** a `conic-gradient` on a masked pseudo-element (border-box minus
padding-box), so the gradient paints only the edge ring. `feTurbulence` /
`feDisplacementMap` is the fallback if the conic version reads as flat, but it's
a heavier filter and I'll profile before choosing.

**The reconciliation that makes it legal — and I think it's better design than
what you asked for:** you specified "subtly and slowly modulated," which is a
time-driven animation, and a time-driven animation is exactly what Principle 14
forbids. So: **the refraction phase advances as a function of pointer
displacement, not elapsed time.** The pointer moves, the light moves. The pointer
stops, the edge settles and holds. Nothing on the page is animating when nobody
is touching anything — the screen is genuinely calm at rest — and the effect
reads *more* like a material property, because real refraction responds to
motion rather than running on a clock. It also costs nothing: we're already in
the rAF loop computing displacement for the lerp.

**"Expensive" test, which is a pass/fail in Phase 8:** the effect must be
imperceptible until pointed out. If a stranger notices a shimmer, it's a
template. Restraint is the material.

---

## 7. Payments — three options, one recommendation, your call

**Do not build a payment form. Do not touch card data.** Hosted checkout via
redirect, behind an env-var-driven adapter (`lib/checkout/` with a provider
interface and one implementation per provider) so switching is a config change.

### The arithmetic that should drive the decision

At a $1 price point, **fixed per-transaction fees dominate everything else.**
This is the whole story:

| Provider | Fee structure | Net on $1 | Net on $10 one-time | Static export survives? |
|---|---|---|---|---|
| **Stripe Checkout** | ~2.9% + ~$0.30 | ~$0.67 (33% lost) | ~$9.41 (6% lost) | **No** — needs a server route to create the session |
| **Polar** | merchant of record, ~4% + ~$0.40 | ~$0.56 (44% lost) | ~$9.20 (8% lost) | Yes — static checkout links |
| **Gumroad** | flat ~10%, processing included | ~$0.90 (10% lost) | ~$9.00 (10% lost) | Yes — plain links |

**Verify current published rates before you commit** — I'm reporting the
structures I'm confident about, but rates change and I haven't fetched their
pricing pages (that would be an outbound call I don't need to make yet). The
*shape* of the table is what matters and that shape is stable: percentage-only
beats fixed-plus-percentage at $1, and loses at $10.

### Tradeoffs beyond price

- **Stripe** — most control, cleanest checkout, best subscription tooling,
  everyone trusts the page. Costs: you become the merchant of record (you handle
  VAT/sales-tax registration and remittance yourself, which for international
  digital goods is a real and recurring obligation), and it **breaks the static
  export** — you'd need one serverless function, which means a hosting target
  with functions rather than plain static files at cutover.
- **Polar** — merchant of record, so VAT/sales tax is their problem, not yours.
  Built for exactly this (developer digital products, subscriptions, license
  keys, GitHub-native benefits). Worst net at $1, good net above $5. Static-safe.
- **Gumroad** — best net at $1 by a wide margin, merchant of record, zero infra,
  works from a plain `<a href>`. Costs: least control over the checkout's look,
  Gumroad branding in the flow, and a 10% rate that becomes the worst of the
  three the moment you charge more than about $4.

### My recommendation

**Decide the strategy before the provider,** because they invert:

- **If $1/month is a signal product** — a way to make "I built this" concrete and
  filter for people who care enough to pay something — then Gumroad. It nets the
  most at $1, requires no infrastructure, keeps the site a pure static export,
  and the 10% rate never bites because you never charge more.
- **If it's a revenue product**, $1/month is the wrong price and no provider
  fixes that: you're losing 10–44% to fees on the smallest possible transaction
  while carrying the full support and churn burden of a subscription. A one-time
  **$8 unlock** nets ~$7.50 on Stripe and ~$7.20 on Gumroad, has no churn, no
  dunning, no renewal support email, and — the part that matters for this
  build — **no entitlement infrastructure that has to keep working forever.**

**I'd take the one-time unlock, on Gumroad, and revisit if volume ever justifies
Stripe.** But your note already framed this correctly as a strategy question, and
it's genuinely yours to answer.

**Open decision (D2):** provider + subscription vs. one-time. This changes
`/apps` copy, the adapter's shape, and whether the site stays a static export.
Needed before Phase 6.

### Entitlement for a paid tier — proposal only, not built

**Proposal: no accounts on ajwoo.com. Ever.**

Purchase issues a license key (Polar and Gumroad both do this natively; Stripe
needs a webhook plus somewhere to put it). **The key is redeemed inside the app,
not on the website.** The app validates against the provider's API and caches the
result locally.

Why this is the right shape:

- The website's job is to route to checkout. It never learns who bought what,
  which means no user table, no session, no auth, no password reset, no account
  page, no GDPR surface — and it stays a static export.
- The app already has a place to put a settings field and already has to work
  offline.
- Every alternative I can think of adds a database and an authenticated surface
  to a four-page personal site to service a $1 transaction. That's the step
  Principle 12 exists to delete.

Not building this until you've picked D2 and confirmed the shape.

---

## 8. Phase plan

Each phase ends in a stop. I show work and wait.

| # | Phase | Deliverable | Status |
|---|---|---|---|
| 1 | **This document** | Job, stack, IA, extensions, payment options | **Done** |
| 2 | Asset inventory | Read-only crawl of ajwoo.com + /coffee/ + /design/. Table: source URL, type, dimensions, role, keep/re-shoot/cut + one line of reasoning. Flags low-res and upscaled assets, and argues against the WP builder strings and the snow script. | **Done** — `PHASE-0-INVENTORY.md` |
| 3 | Figma design system | `search_design_system` results as a table (component, variants, which screen needs it); `get_variable_defs` reconciled against `tokens.css` with disagreements escalated, never silently resolved; existing Code Connect map; per-screen component list with rejections logged. Falls back to `tokens.json` + `components.md` and says so plainly if no published minimal library exists. | **Blocked** — discovery tools are file-scoped and need a `fileKey`. Fallback applied; nothing fabricated. |
| 4 | Foundation | `git init`, Next.js + TS + Tailwind v3.4 + preset, `tokens.css`, self-hosted font, app shell, nav, home affordance, focus states, `.env.example`, **`DEPLOY.md` starts here**. Static. No motion. | **Done** |
| 5 | `/design` and `/coffee` | Content migrated off WordPress, assets re-encoded, zero `wp-content` references. | **Done** — plus 22 `/work/<slug>` detail pages |
| 6 | `/apps` | Cards, grouping by user intent with outcome-named groups, price visible at rest, empty state, guarded purchase action, payment adapter stubbed against D2. | **Done** — renders its empty state; no app data exists |
| 7 | Polish layer | Entrance sequence, then cursor + liquid edge. Last, deliberately — building them first would distort every layout decision underneath. | **Done** |
| 8 | Verification | `reference/checklist.md` as a pass/fail table with every failure reported honestly. Contrast ratios as measured numbers, not estimates. Cursor frame rate as a measured number. Written confirmation that nothing was deployed, pushed, or published, and that `DEPLOY.md` is current. | **Done** — `VERIFICATION.md`; 2 failures + 6 gaps reported |

Figma round-trip (§4b) runs at the end of whichever phase creates or meaningfully
modifies a component, and **asks before writing to any Figma file.**

---

## 9. Risks

1. **Image quality is the binding constraint on "expensive."** Your own note is
   almost certainly right, and Phase 2 will confirm it. Upscaled 2560px PNGs that
   were never sharp will not get sharper, and a soft hero will undo the tracking,
   the whitespace, and the restraint all at once. Budget for re-export from
   originals, or for a re-shoot. **This may change the `/design` layout decision
   in §5 — a titled list of sharp type beats a grid of soft images.**
2. **The cursor may not survive contact with the site.** Kill condition is stated
   in §6(b). I'd rather tell you to cut it than tune it indefinitely.
3. **$1/month economics.** Covered in §7. It's a strategy question with a design
   consequence, so it needs answering before Phase 6.
4. **Compact chrome is at its density ceiling** (§4). Any addition needs a
   removal.
5. **Figma access is confirmed** — authenticated as Alex Woo across GG Studios
   (pro) and two starter plans. Whether a *published minimal library* exists in
   any of them is unknown until Phase 3. If it doesn't, §4b's fallback applies:
   `tokens.json` + `reference/components.md` become the source of truth, I'll say
   so plainly, and I will not fabricate a component set.

---

## 10. Open decisions

| ID | Decision | Needed by | Default if you don't answer |
|---|---|---|---|
| **D1** | Which app is the `/apps` flagship (carries the one primary)? | Phase 6 | Every card secondary; page carries no primary |
| **D2** | Payment provider + subscription vs. one-time unlock | Phase 6 | I'll ask again rather than guess — this one has no safe default |
| **D3** | Entrance animates the type (my pick) or a rule drawing across | Phase 7 | Type |
| **D4** | Typeface: Plus Jakarta alone (my recommendation) or a pairing | Phase 4 | Plus Jakarta alone |
| **D5** | `git init` locally, or leave untracked | Phase 4 | `git init`, no remote — **applied** |
| **D6** | The 9 orphaned `/work/` pages (+3 password-protected): retire with redirects, or restore? | Phase 5 | Excluded from the build; still live on WordPress |
| **D7** | Calendly books **30** min but the old copy said 20. Change the event, or keep the label "Book 30 minutes"? | Phase 4 | Label follows the link: "Book 30 minutes" |
| **D8** | Re-export the grid tiles from originals? | Phase 5 | **Resolved in build** — 11 of 22 tiles regenerated from high-res project images; 3 have no better source (Dynamics 365 800px, Netmarble 570px, Fancy Cafes Paris 1079px) |
| **D9** | The 3 animated grid GIFs | Phase 5 | Replaced with static high-res stills; no video re-encode yet |

---

**Nothing has been deployed, pushed, or published. Nothing has been written to
Figma. No code has been written. Live ajwoo.com is untouched.**
