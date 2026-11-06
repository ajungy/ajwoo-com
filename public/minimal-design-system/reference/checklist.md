# Minimal — Pre-ship Design Review

Every question is pass/fail. A "sort of" is a fail. Run this before any UI ships,
and run it against Figma mocks before they get built.

---

## The job

- [ ] I can state the user's job to be done in one sentence.
- [ ] Every element on this screen serves that job. Nothing is here out of habit.
- [ ] There is no step, field, click, or confirmation that could be removed.
- [ ] Nothing is asked of the user that could have been inferred or defaulted.

## Hierarchy & gaze

- [ ] A stranger names the most important element in under two seconds.
- [ ] Exactly one element is emphasized — one primary button, one focal point.
- [ ] Identity and home are top-left. Global actions are top-right.
- [ ] The commit action sits at the end of the reading path, not before it.
- [ ] The eye never has to backtrack to find the next step.
- [ ] Related things are near each other; unrelated things are visibly apart.
- [ ] Section gaps are visibly larger than the gaps inside a section.

## Stability

- [ ] Every control occupies the same position in every state.
- [ ] Loading does not change any element's size. Widths are locked.
- [ ] An appearing error or badge does not push anything else. Space is reserved.
- [ ] Buttons sit in the same place here as in every other screen of the product.
- [ ] The only transform on interaction is `scale(0.98)` on press.

## Visibility & comprehension

- [ ] Nothing interactive is invisible at rest. No hover-only discovery.
- [ ] Every interactive element is visually distinguishable from static content.
- [ ] Icon-only controls have both a tooltip and an accessible name.
- [ ] Every label is a plain verb phrase naming its outcome. No "OK" or "Submit".
- [ ] No jargon the user didn't bring with them.
- [ ] This works without a tutorial, tour, or coach mark.

## No dead ends

- [ ] Every state — including empty, loading, and error — has a way forward.
- [ ] Every state has a way back.
- [ ] The empty state names what's missing and offers the action that fills it.
- [ ] Errors say what happened, what state the data is in, and what to do next.
- [ ] There is a retry, and it's a real button.

## Reversibility & data safety

- [ ] Reversible actions offer undo rather than a confirmation dialog.
- [ ] Multi-step flows have a working back affordance.
- [ ] In-progress input survives navigation, refresh, and accidental close.
- [ ] Nothing the user typed can be lost by a single misclick.

## Guarding the irreversible

- [ ] Destructive actions are ≥24px from their neighbors.
- [ ] The destructive confirm is not the auto-focused control.
- [ ] Irreversible actions require a deliberate second act.
- [ ] A rapid double-click cannot fire the action twice.
- [ ] The consequence is stated honestly, including what cannot be recovered.

## Feedback & honesty

- [ ] Visible response to every input within 100ms.
- [ ] Waits are matched to the right affordance (nothing / spinner / percentage).
- [ ] No fake progress. No bar parked at 99%.
- [ ] No disabled control without a visible reason for being disabled.
- [ ] Success is confirmed exactly once — not by a toast *and* a button state.
- [ ] Nothing important is communicated only by a toast.

## Color & motion

- [ ] Green, amber, and red appear only as success, warning, and error.
- [ ] Every colored status is also carried by a word or an icon.
- [ ] No hex values in the code. Every color is a semantic token.
- [ ] Nothing moves unless the user caused it or is waiting on it.
- [ ] Only `opacity`, `transform`, and color properties animate.
- [ ] The screen is calm at rest.

## System consistency

- [ ] One line weight: 1px, everywhere.
- [ ] Radius follows the system: 4 chips/checkboxes, 8 controls, 16 cards/
      modals/popovers. No 10, 14, or 20 anywhere — those belong to the old scale.
- [ ] Every spacing value is a multiple of 4, preferably 8.
- [ ] Type comes from the scale. No arbitrary sizes, no bracket values.
- [ ] No text set in all caps, anywhere on the screen — except a proper noun,
      acronym, or file name (`SKILL.md`, API), which is spelled that way
      regardless of case.
- [ ] No orphaned single word or single letter on the last line of a
      paragraph, heading, button label, or wrapped title.
- [ ] Font size, weight, and color are drawn only from the named tokens —
      never a size, weight, or gray invented for one screen.
- [ ] Light and dark both verified. Page is pure white / very dark gray.
- [ ] Dark mode expresses elevation by surface lightness, not shadow.
- [ ] A user who knows another one of my products already knows this screen.
- [ ] Every component is a library instance — nothing was redrawn freehand.

## Grouping & space

- [ ] Every divider earns its place — a table's rows, a dense settings list —
      not decorating a gap that's already visibly a gap.
- [ ] Every solid grouping box (card/panel) holds exactly one real object,
      not a cluster of unrelated controls boxed "to be safe."
- [ ] Grouping boxes show their edge with a fill difference (or a blur, over
      background content) — not an outline, unless the grouping itself is
      deliberately meant to draw the eye.
- [ ] No container nests inside another container more than one level.
- [ ] Covering every line and border with a thumb, the groups are still
      readable from spacing alone.
- [ ] Every dropdown/select/input near another one on this page shares the
      same width — none has shrunk to fit its own value.
- [ ] Sliders and other room-hungry controls use the full width available to
      them on canvases that have the room.
- [ ] No dead whitespace at the bottom or trailing edge of the window unless
      the surface is a fixed-viewport app shell that intentionally fills it.
      Widgets, popovers, and panels hug their content.

## Filled controls, not outlined

- [ ] Inputs, selects, and search fields are identified by a fill difference
      (`--surface-control`) at rest — not a border.
- [ ] `--border-control` appears only on the documented exceptions: an
      unchecked checkbox/radio/switch, a Secondary button, or a control
      forced to sit on a surface sharing its own fill.
- [ ] Primary and Danger buttons carry no visible border in any state.
- [ ] Focus is shown with a ring, not by adding a border to the control.

## Surfaces

- [ ] Every target meets its modality's minimum: pointer 32, touch 44×44, TV 56.
- [ ] Hit areas grew; visible boxes did not.
- [ ] Nothing is discoverable only by hover, only by gesture, or only in a tooltip.
- [ ] Hover states are wrapped in a hover-capable query so they can't latch after
      a tap.
- [ ] I dragged the window through every canvas class and nothing broke.
- [ ] Class changes add or rearrange content — they don't merely stretch it.
- [ ] Safe-area insets respected on every edge; nothing interactive under a
      notch, home indicator, rounded corner, or outside TV safe area.
- [ ] Nothing important sits across a fold.
- [ ] Type never drops below its distance floor: 13 wrist, 12 desk, 18 at 3m.
- [ ] Fold, rotate, resize, detach, and input switch each preserve scroll,
      selection, input, playback, and focus.
- [ ] Directional navigation reaches every element, with no traps or dead corners.
- [ ] Glanceable surfaces show stale data with a timestamp instead of a spinner.
- [ ] The product is recognisably the same on the smallest and largest surface.

## Disclosure & density

- [ ] Every element is assigned to a tier, deliberately.
- [ ] Tier 1 is within the density budget for the *smallest* supported canvas.
- [ ] Exactly one primary action — at every canvas class.
- [ ] Every disclosure's trigger is visible at rest and clearly labeled.
- [ ] No cost, consequence, permission, data use, current state, required field,
      or error is hidden behind a disclosure.
- [ ] Nothing is hidden because it's unflattering.
- [ ] Groups are named for outcomes. No "Other", no "Misc".
- [ ] Groups hold ≤7 items, nested at most one level, in stable order.
- [ ] Menus don't reorder themselves by recency or usage.
- [ ] Search and deep links reach every tier, including Tier 3.
- [ ] A problem inside a closed control is badged on the closed trigger.
- [ ] Reveal motion moves the content; the trigger stays put.

## Access

- [ ] Body text ≥ 4.5:1. Large text and UI boundaries ≥ 3:1. Measured, not guessed.
- [ ] Fully operable by keyboard, in a logical order.
- [ ] Focus is visible on every focusable element. `outline: none` appears nowhere.
- [ ] Modals trap focus and return it to the trigger on close.
- [ ] Escape closes. Enter commits.
- [ ] `prefers-reduced-motion` and `prefers-color-scheme` respected.

## The last look

- [ ] Nothing here is decoration.
- [ ] If I removed one more element, the screen would get worse — not better.
- [ ] I would be happy to have my name on this.
