# Phase 8 — verification

`reference/checklist.md` run against the build, with every failure and every
unverified item reported. Measured numbers are measured, not estimated.

**Nothing has been deployed, pushed, or published.** `git remote -v` returns
nothing, the branch is `main`, there is 1 local commit, `.env.local` is not
tracked, and no Figma file was written. Live ajwoo.com is untouched.

---

## Failures and gaps — read this section first

| # | Item | Status | Detail |
|---|---|---|---|
| 1 | **Cursor sustained frame rate** | **NOT MEASURED** | CLAUDE.md §6(b) promised a real 10-second DevTools trace at 60fps. `requestAnimationFrame` is throttled in the headless browser pane, so a sustained-fps trace could not be produced. What I *did* measure: the rAF loop body costs **0.0014 ms/frame** against a 16.67 ms budget (20,000 iterations, 27.5 ms total) with **zero layout reads** in the loop. That is scripting headroom, **not** a frame-rate measurement. The promise in §6(b) is unfulfilled and must be run on real hardware before launch. |
| 2 | **Secondary button border, dark mode** | **FAIL, escalated** | Measured **1.71:1** against the page — below the 3:1 the checklist requires for UI boundaries. The token is the system's own `--action-secondary-border`, and the control is not identified by its boundary alone (its label measures 17.24:1). Per the brief I have **not** silently retuned a system token — this is a system-level question for you. |
| 3 | **`/apps` pricing and downloads** | **NEEDS YOU** | Capture, Dictate and Narrate are populated from Alex's own description. Prices render "Pricing TBD" and the download links are `#`, because neither was given and §6 says a wrong cost is worse than a missing one. |
| 4 | **Figma inventory (Phase 3)** | **NOT COMPLETED** | Authenticated fine as Alex Woo, but `search_design_system` and `get_libraries` are **file-scoped** — both require a `fileKey` I do not have. §4b's fallback applied: `tokens.json` + `reference/components.md` are the source of truth. No component set was fabricated. Send a Figma file URL and this runs properly. |
| 5 | **Top bar height** | **DEVIATION** | The app-shell spec says 56px. There is no 56px token (the scale jumps 48 → 64). Used **64px** (`h-12`), on the 8px grid. |
| 6 | **Card press scale** | **NOTED** | `components.md` specifies `scale(0.995)` for cards; the preset carries no token. Defined once in `globals.css` as `.card-press` rather than as a bracket value in a component. |
| 7 | **Hero alt text** | **NEEDS YOU** | Set to `"Alex Woo"` after seeing it is a portrait. Confirm that is the right description. |
| 8 | **Reduced motion, real device** | **CODE-VERIFIED ONLY** | Entrance and cursor are both gated in CSS and JS, but I did not toggle the OS setting on real hardware. |
| 9 | **Water cursor, live behaviour** | **PARTIALLY VERIFIED** | The water material, the lens refraction, the rim on light and dark, and the morph-to-element shape were all verified by screenshot. The *chase and settle* could not be captured: `requestAnimationFrame` pauses whenever the browser pane is hidden between my tool calls, so every screenshot catches the drop mid-flight or frozen. The physics is verified by code, not by eye — look at it yourself and tell me if `FOLLOW` needs to change. |
| 10 | **Raw hex in `components/Cursor.tsx`** | **DOCUMENTED EXCEPTION** | 10 hex values, all inside the `LENS_MAP` SVG. They are displacement-vector data, not colour — `#808000` means "displace by zero". Swapping them for tokens would break the lens. Commented in place. |
| 11 | **Safari refraction** | **DEGRADED** | Safari does not support an SVG filter reference in `backdrop-filter`; it gets a 0.4px blur instead. Rim, glints, shadow and deformation still apply. |
| 12 | **App icons** | **PLACEHOLDER** | The three app marks are glyphs I drew in the system's icon language (1.5px stroke, 24px grid). They are not Alex's shipped icons — swap the glyph in `components/AppIcon.tsx` when real artwork exists. |
| 13 | **CORRECTION — detail-page prose** | **FIXED** | I previously reported that the `/work/` pages "carry no prose, only image stacks". That was wrong: my extractor cut each page at the wrong offset. The pages actually hold **337 lines of prose, 89 images and 21 video embeds**, all of which are now migrated. The coffee reviews also carry scores (`Environment: 4/5`), which is what the mono face was reserved for. |
| 14 | **Cursor scope** | **CHANGED** | The water cursor now mounts on `/` only. Every other page uses the native cursor: on pages people are reading or scanning, a chasing object competes with the content. |

---

## The job

| Check | Result |
|---|---|
| Job stated in one sentence | **Pass** — CLAUDE.md §0 |
| Every element serves the job | **Pass** — awards/clients/education sit below the decision, not in it |
| No removable step | **Pass** — booking is one click from every page |
| Nothing asked that could be inferred | **Pass** — no forms on the site |

## Hierarchy & gaze

| Check | Result |
|---|---|
| Most important element nameable in 2s | **Pass** — the display line is the only 48px element on `/` |
| Exactly one emphasis | **Pass** — one primary per view; the nav CTA is secondary, the hero CTA is primary |
| Identity top-left, global actions top-right | **Pass** — identical at every canvas class |
| Section gaps larger than internal gaps | **Pass** — 64px between regions, 32/16/8 within |

## Stability

| Check | Result |
|---|---|
| Controls hold position in every state | **Pass** — hover changes colour only |
| No layout shift from images | **Pass** — every `<img>` carries explicit `width`/`height` |
| Only transform on interaction is press scale | **Pass** — 0.98 controls, 0.995 cards |
| Cursor causes no CLS | **Pass** — `position: fixed`, out of flow, no page content laid out against it |

## Visibility & comprehension

| Check | Result |
|---|---|
| Nothing interactive invisible at rest | **Pass** — and this is a **fix**: the WordPress grid put project titles in a hover overlay |
| Labels are outcome-naming verb phrases | **Pass** — "Book 30 minutes", "See the project", "Read the review" |
| Cursor label never the only source of a verb | **Pass** — `cursorLabel` defaults to the visible text |
| Works without a tutorial | **Pass** |

## No dead ends

| Check | Result |
|---|---|
| Every state has a way forward and back | **Pass** — detail pages carry a back affordance in the content area |
| Empty state names what's missing + offers the action | **Pass** — `/apps` |
| 404 exists | **Pass** — Next.js `not-found` inherits the shell |

## Colour & motion

| Check | Result |
|---|---|
| Green/amber/red only as status | **Pass** — no status colour appears anywhere; the site is monochrome |
| No hex in components | **Pass, with one documented exception** — 0 in any styling context; 10 in the cursor's displacement map, which is vector data, not colour (item 10) |
| No bracket values | **Pass** — **0** occurrences |
| Nothing moves unless user-caused | **Pass** — one entrance (arrival), one cursor (pointer). The liquid edge advances on pointer displacement, so it is static when the pointer is still |
| Only opacity/transform/colour animate | **Pass** |
| Screen calm at rest | **Pass** — and this is the biggest behavioural fix: the old site auto-played **8.5 MB of GIF** on every detail page plus a snow script |

## System consistency

| Check | Result |
|---|---|
| One line weight, 1px | **Pass** |
| Radius follows the system | **Pass** — 10 controls, 14 cards |
| Spacing multiples of 4/8 | **Pass** — the preset's scale is the only source |
| Type from the scale | **Pass** |
| Light and dark both verified | **Pass** — screenshotted and measured in both |
| Dark elevation by surface lightness | **Pass** — `#18181B` raised on `#0E0E10` page |

## Access — measured contrast

Computed from live `getComputedStyle` values, not estimated.

| Element | Light | Dark | Floor | Result |
|---|---|---|---|---|
| Identity display (48px) | **19.28:1** | **17.24:1** | 3:1 | Pass |
| Body / bio (17px) | **7.29:1** | **7.51:1** | 4.5:1 | Pass |
| Nav inactive (14px) | **7.29:1** | **7.51:1** | 4.5:1 | Pass |
| Footer caption (13px) | **4.83:1** | **5.63:1** | 4.5:1 | Pass |
| Primary button label | **19.28:1** | **19.28:1** | 4.5:1 | Pass |
| Secondary button border | — | **1.71:1** | 3:1 | **Fail — item 2 above** |

| Check | Result |
|---|---|
| Focus visible everywhere | **Pass** — 2px ring, 2px offset; `outline: none` appears nowhere in project code |
| Skip link | **Pass** |
| `prefers-color-scheme` respected | **Pass** — no toggle, follows the OS |
| Pinch-zoom allowed | **Pass** — the old site's `maximum-scale=1.0` is gone |

## Surfaces

| Check | Result |
|---|---|
| Dragged through every canvas class | **Pass** — compact 375 and desktop verified by screenshot |
| Class changes rearrange, not stretch | **Pass** — 1 → 2 → 3 column grid; nav reflows to a second row |
| Hover gated behind hover-capable query | **Pass** — **0** bare `hover:` in the codebase |
| Coarse pointer gets native behaviour | **Pass** — cursor layer `display: none` under `(any-pointer: coarse)` |

## Migration completeness

Grepped across the exported `out/` HTML:

| Pattern | Occurrences |
|---|---|
| `wp-content` | **0** |
| `wp-includes` | **0** |
| `i0.wp.com` | **0** |
| `googlecode` (the dead http:// shim) | **0** |
| `Single Edit` / `Column Edit` | **0** |
| `snow` / `free-web-tools` | **0** |
| `maximum-scale` | **0** |

## Weight

| | WordPress | This build |
|---|---|---|
| HTML per page | 155–191 KB | **32–34 KB** |
| Frontend JS | 45 Gutenberg bundles + jQuery + MediaElement | **94.3 KB** First Load |
| `srcset` | none | every image |
| Auto-playing GIF per detail page | up to 8.5 MB | **0** |
| Image formats | PNG/JPEG/GIF, 1x | AVIF → WebP → JPEG, 1x + 2x |
