'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * A stacked, 3D-depth card carousel — at Alex's direction, for the landing
 * page's featured-apps row (see FeaturedApps.tsx, which wraps this around
 * four AppCard instances). Built as plain CSS 3D transforms
 * (translateX/translateZ/rotateY on `perspective`), not the WebGL/GSAP
 * stack the pasted reference implies — same reasoning as this session's
 * other React Bits ports (GlowCursor, BorderGlow, GlassSurfaceFill):
 * CLAUDE.md's stack decisions reject a new animation library outright, and
 * this exact depth-stack look is fully achievable with CSS transforms and
 * transitions alone, so that's what this is.
 *
 * `items` is generic ReactNode, not image data — the pasted reference's own
 * `items` prop took `{ image, alt }` for a plain image carousel, but this
 * needs to carry a full interactive AppCard (icon, video, Waitlist/Open/
 * Install button) per slide, so each item is just "the thing to render at
 * this position in the stack", full stop.
 *
 * `onActiveChange(index)` fires whenever the top-of-stack card changes —
 * FeaturedApps.tsx uses it to flip AppCard's `playing` prop so only the
 * card currently on top autoplays its demo video, per Alex's spec ("video
 * should autoplay [when] the card is on top of the stack").
 *
 * RESPONSIVE SCALING, at Alex's direction ("optimize on all window sizes
 * and mobile... reduce the size of the cards" then, in a second pass,
 * "make sure... the scale of the cards [is] bigger now on mobile and
 * smaller windows"): `cardWidth`/`cardHeight` describe the stack's DESKTOP
 * size; a ResizeObserver on the wrapper reads the actual space available
 * and computes a uniform `scale` (never above 1) applied to the whole
 * stack via a single `transform: scale()`. The scale is sized against the
 * FRONT CARD ALONE (`cardWidth`), not the full multi-card stack footprint
 * (`cardWidth + spread * (visibleCards-1) * 2`) — sizing against the full
 * footprint (the first pass) meant a 4-visible-card stack had to shrink
 * enough that its widest possible extent fit the viewport, which crushed
 * the front card far smaller than it needed to be on a phone. The wrapper
 * clips horizontal overflow (`overflow-hidden`), so the fanned-out side
 * cards that now spill past the viewport at this larger scale are cropped
 * symmetrically rather than causing page-level horizontal scroll — the
 * front card (the only one meant to be fully readable at rest) stays
 * centered and large. A single transform (kept at native pixel geometry
 * so the 3D transforms inside it stay correct) is simpler and more robust
 * than re-deriving every dimension in JS, and it scales the AppCard
 * content proportionally too rather than reflowing it at a size AppCard
 * was never designed for.
 *
 * CONTROLS, at Alex's direction: previously prev/next sat as bordered,
 * filled circular buttons floating over the card stack's left/right edges,
 * with the dot indicators separately below. Now all three live in one row
 * BELOW the card (`showControls`/`showIndicators` render into that row,
 * not inside the scaled stack), and the arrows drop the button chrome
 * entirely — no border, no fill, just a bare chevron icon at the same
 * "plain icon" treatment ThemeToggle.tsx/HeaderMenu.tsx use elsewhere in
 * the chrome (text-fg-tertiary, hover:text-fg, no border/background),
 * sized up from the header's 28px to 32px since these have more room and
 * are the row's only content. A second pass adds the SAME `bg-tertiary-hover`
 * hover fill ThemeToggle.tsx/the TopBar nav links use, at Alex's direction
 * ("add hover button highlights like the darkmode button").
 *
 * CARD CHROME, reversed again: an earlier pass moved the hover zoom/shadow
 * onto AppCard itself (its own native `shadow-e1`→`shadow-e2` + card-press
 * grow). At Alex's direction ("remove the zoom and shadow effect [on
 * AppCard]... add the zoom... as well as the shadow effect [on the
 * wrapper]"), that's reversed back: AppCard renders here with
 * `hoverZoom={false} hoverShadow={false}` (see AppCard.tsx), and this
 * wrapper owns the full effect instead — a static `box-shadow` at rest,
 * `border-radius: 20px` (matching AppCard's own `rounded-xl` elsewhere),
 * `overflow: hidden`, and a JS-driven hover state (`frontHovered`) on the
 * FRONT card only that boosts both `transform: scale()` and `box-shadow`
 * together. JS-driven, not a CSS `:hover` rule, because this element's
 * `transform` is already an inline style computed from the stack's own
 * offset/depth/tilt math — inline styles beat any CSS class in
 * specificity, so a `:hover { transform: ... }` rule could never win
 * against it; multiplying the hover state directly into the SAME computed
 * transform string is the only way to combine "hover zoom" with "this
 * card's position in the stack" without one silently overriding the
 * other.
 *
 * SIDE-CARD VISIBILITY: at Alex's direction ("I'm unable to see the
 * cards on the back, and I only see the first card... I want the other
 * cards... to be slightly visible on the left and right sides"), the
 * defaults for `spread`/`depth`/`tilt`/`falloff`/`blur` are retuned —
 * the previous `spread=56` (tuned in an earlier round purely to shrink
 * the carousel's overall footprint) translated neighboring cards only
 * 56px, which is nothing against a ~400px-wide card: they sat almost
 * entirely BEHIND the front card, technically rendered but invisible in
 * practice. `spread=150` gives them a real, legible peek; `falloff`
 * lowered (0.2 -> 0.15) and `blur` lowered (6 -> 4) so they read as
 * "slightly visible neighboring cards" rather than "nearly gone".
 * `perspective` also raised (callers now pass 10000, Alex's own number) —
 * a higher perspective value flattens the 3D foreshortening, which keeps
 * the peeking side cards a consistent, readable size instead of
 * dramatically shrinking away.
 *
 * `cardHeight` IS MEASURED, NOT TAKEN LITERALLY: AppCard's own height is a
 * function of its width (a 1:1 square media block plus a fixed-height
 * icon/title/button footer row, ~80px, independent of card width) — it
 * isn't a value this component gets to pick. A `cardHeight` prop that
 * disagrees with what AppCard actually renders at `cardWidth` used to mean
 * either the footer got clipped (when the wrapper was `overflow: hidden`)
 * or the card silently overflowed its box (once that was removed for the
 * hover-shadow fix above) — both worse than just finding out the real
 * number. A ResizeObserver on the active (offset === 0) card's own
 * rendered box measures its true height once mounted and on every resize,
 * and that measurement — not the `cardHeight` prop — is what every card's
 * box and the stack container actually use. `cardHeight` still sets the
 * FIRST-PAINT estimate (so there's no 0-height flash before the real
 * measurement lands) and is the fallback if measurement is somehow
 * unavailable, but once a real number comes back, that wins.
 */
export interface DepthCarouselProps {
  items: ReactNode[];
  depth?: number;
  spread?: number;
  tilt?: number;
  tiltDirection?: 'left' | 'right';
  perspective?: number;
  visibleCards?: number;
  falloff?: number;
  blur?: number;
  autoplay?: boolean;
  loop?: boolean;
  cardWidth?: number;
  cardHeight?: number;
  /** Per-card wrapper's corner radius (px). Matches AppCard's own
   *  `rounded-xl` by default so the two don't visibly disagree. */
  radius?: number;
  /** Per-card wrapper's background — shows only in the sliver between the
   *  wrapper's radius and AppCard's own (identical) radius, and while
   *  AppCard's video/image is still loading in. */
  tint?: string;
  duration?: number;
  ease?: string;
  autoplayDelay?: number;
  showControls?: boolean;
  showIndicators?: boolean;
  onActiveChange?: (index: number) => void;
}

// Approximates GSAP's power3.out, the eased curve the pasted reference asks
// for, as a standard CSS cubic-bezier — no GSAP dependency needed for one
// easing curve.
const POWER3_OUT = 'cubic-bezier(0.215, 0.61, 0.355, 1)';

// Extra room around the front card's clip region, at Alex's direction
// ("because there's no padding on the top and the bottom, the... zoom
// gets cropped and cut") — the front card's hover boost (scale(1.02),
// see `hoverBoost` below) plus its shadow's own blur/spread need real
// pixels of slack beyond the card's own box, or the clip region's
// `overflow: hidden` (needed to crop the fanned-out side cards) clips the
// hover effect too. Vertical only, per Alex's report — horizontal
// clipping is the intended peek-crop look for the side cards.
const HOVER_PAD_Y = 48;

export function DepthCarousel({
  items,
  depth = 260,
  spread = 150,
  tilt = 26,
  tiltDirection = 'right',
  perspective = 1400,
  visibleCards = 4,
  falloff = 0.15,
  blur = 4,
  autoplay = false,
  loop = true,
  cardWidth = 300,
  cardHeight = 380,
  radius = 20,
  tint = '#05060a',
  duration = 700,
  ease = POWER3_OUT,
  autoplayDelay = 3200,
  showControls = true,
  showIndicators = true,
  onActiveChange,
}: DepthCarouselProps) {
  const [index, setIndex] = useState(0);
  const [scale, setScale] = useState(1);
  // Hover state for the front card's own zoom+shadow boost — see the
  // "CARD CHROME, reversed again" comment above for why this is JS state
  // rather than a CSS :hover rule.
  const [frontHovered, setFrontHovered] = useState(false);
  // Starts as the caller's estimate so first paint has no 0-height flash;
  // replaced with the active card's real measured height once mounted.
  const [measuredHeight, setMeasuredHeight] = useState(cardHeight);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const activeCardRef = useRef<HTMLDivElement>(null);
  const count = items.length;

  const dirSign = tiltDirection === 'right' ? 1 : -1;
  const stackWidth = cardWidth + spread * Math.max(visibleCards - 1, 0) * 2;

  // Fit the FRONT CARD to whatever width the wrapper actually has (not the
  // full fanned-out stack — see the class comment above for why), down to
  // a floor that keeps it legible on the smallest phones (compact, 320px)
  // rather than letting it shrink to nothing. Never scales UP past 1 —
  // this shrinks the desktop-sized geometry to fit, it doesn't magnify it
  // on a huge screen.
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const MIN_SCALE = 0.6;
    const compute = () => {
      const available = el.clientWidth;
      if (!available) return;
      const next = Math.min(1, Math.max(available / cardWidth, MIN_SCALE));
      setScale(next);
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, [cardWidth]);

  // Measures the active card's own natural (unscaled) height — see the
  // "cardHeight IS MEASURED" comment above for why this exists at all.
  useEffect(() => {
    const el = activeCardRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const h = el.scrollHeight;
      if (h > 0) setMeasuredHeight(h);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [index, cardWidth]);

  useEffect(() => {
    onActiveChange?.(index);
  }, [index, onActiveChange]);

  // Pauses on `frontHovered` (the same hover state driving the front
  // card's own zoom/shadow boost above) and resumes automatically once it
  // clears — at Alex's direction ("once the user is hovering over a
  // card, the automatic moving... pauses so that the user can focus...
  // but once users stop hovering again, then it also activates"). No
  // separate pause/resume bookkeeping needed: `frontHovered` flipping to
  // true fails this effect's guard, whose cleanup already clears the
  // running interval; flipping back to false re-runs the effect and
  // starts a fresh one.
  useEffect(() => {
    if (!autoplay || count < 2 || frontHovered) return;
    const id = setInterval(() => {
      setIndex((i) => (loop ? (i + 1) % count : Math.min(i + 1, count - 1)));
    }, autoplayDelay);
    return () => clearInterval(id);
  }, [autoplay, autoplayDelay, loop, count, frontHovered]);

  const go = (dir: 1 | -1) => {
    setIndex((i) => {
      const next = i + dir;
      return loop ? (next + count) % count : Math.min(Math.max(next, 0), count - 1);
    });
  };

  return (
    <div ref={wrapperRef} className="mx-auto w-full">
      {/* Clip region: ONLY the stack lives inside this — `overflow-hidden`
          here (not on `wrapperRef` above) so the controls row further down
          stays in normal flow beneath it rather than being clipped by the
          same box that crops the stack's fanned-out side cards. `relative`
          + an explicit height gives the stack's `position: absolute` child
          below a sized containing block (an absolutely positioned child
          contributes nothing to its parent's own auto height, so without
          this the clip region would collapse to 0 and the controls row
          would ride up over the cards). */}
      <div
        className="relative overflow-hidden"
        style={{ height: measuredHeight * scale + HOVER_PAD_Y * 2 }}
      >
        {/* Scaled stack: kept at its native (desktop) pixel geometry so the
            translateX/translateZ/rotateY math above stays correct, then
            shrunk as one unit via `scale`. `left: 50%` + `translateX(-50%)`,
            not `mx-auto` — `margin: auto` only centers a box that's
            NARROWER than its container; at this card-based scale (see the
            class comment above) the stack's scaled footprint is routinely
            WIDER than the wrapper, and an overflowing block's auto margins
            just collapse to 0, which left-aligned the whole stack instead
            of centering it — the front card was landing dead center of the
            STACK, not of the wrapper/viewport, visibly off-center on every
            phone width. `left/translateX` centers correctly either way,
            and this clip region's `overflow-hidden` then crops the
            fanned-out side cards symmetrically off both edges. `top:
            HOVER_PAD_Y`, not 0 — the clip region above is now taller than
            this box by `HOVER_PAD_Y` on each side, so this offset keeps
            the stack itself centered within that extra room rather than
            pinned to the top of it. */}
        <div
          className="absolute"
          style={{
            left: '50%',
            top: HOVER_PAD_Y,
            transform: 'translateX(-50%)',
            width: stackWidth * scale,
            height: measuredHeight * scale,
          }}
        >
          <div
            className="absolute left-0 top-0"
            style={{
              width: stackWidth,
              height: measuredHeight,
              perspective: `${perspective}px`,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
            }}
          >
            {items.map((item, i) => {
            let offset = i - index;
            // Shortest-path offset so looping wraps the short way around the
            // stack instead of visibly sliding all the way across it.
            if (loop) {
              if (offset > count / 2) offset -= count;
              if (offset < -count / 2) offset += count;
            }
            const abs = Math.abs(offset);
            const isVisible = abs < visibleCards;
            const isFront = offset === 0;
            const hoverBoost = isFront && frontHovered;
            const cardScale = Math.max(1 - falloff * abs, 0.4) * (hoverBoost ? 1.02 : 1);
            const cardBlur = isFront ? 0 : Math.min(blur * abs, blur * visibleCards);

            return (
              <div
                key={i}
                ref={isFront ? activeCardRef : undefined}
                aria-hidden={!isFront}
                onMouseEnter={isFront ? () => setFrontHovered(true) : undefined}
                onMouseLeave={isFront ? () => setFrontHovered(false) : undefined}
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 0,
                  margin: '0 auto',
                  width: cardWidth,
                  height: 'auto',
                  transform:
                    `translateX(${offset * spread * dirSign}px) ` +
                    `translateZ(${-abs * depth}px) ` +
                    `rotateY(${offset * -tilt * dirSign}deg) ` +
                    `scale(${cardScale})`,
                  transition:
                    `transform ${duration}ms ${ease}, opacity ${duration}ms ${ease}, ` +
                    `filter ${duration}ms ${ease}, box-shadow 500ms ${ease}`,
                  opacity: isVisible ? Math.max(1 - abs * 0.18, 0) : 0,
                  filter: cardBlur ? `blur(${cardBlur}px)` : undefined,
                  zIndex: count - abs,
                  pointerEvents: isFront ? 'auto' : 'none',
                  borderRadius: radius,
                  overflow: 'hidden',
                  backgroundColor: tint,
                  // AppCard renders with hoverZoom/hoverShadow both off
                  // inside this carousel (see FeaturedApp.tsx), so this is
                  // the only place the "hover" look lives — a static
                  // resting shadow, boosted on the front card's own hover
                  // (frontHovered, set via onMouseEnter/Leave above) to a
                  // larger, softer one. Same 500ms box-shadow fade
                  // `.card-press` uses elsewhere, at Alex's original
                  // direction on that ("0.5s fade to see the shadow").
                  boxShadow: hoverBoost
                    ? '0 32px 64px -12px rgba(0,0,0,0.45)'
                    : '0 24px 48px -12px rgba(0,0,0,0.35)',
                }}
              >
                {item}
              </div>
            );
          })}
        </div>
        </div>
      </div>

      {/* Controls row: prev arrow, dots, next arrow — one line, centered,
          directly under the card. Arrows are bare icons (no border/fill),
          matching the chrome's own plain-icon treatment (ThemeToggle.tsx)
          rather than the filled/bordered circular buttons this used to
          have floating over the stack's edges. */}
      {(count > 1 && (showControls || showIndicators)) && (
        <div className="mt-6 flex items-center justify-center gap-4">
          {showControls && (
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous"
              data-cursor-label="Previous"
              className={
                'inline-flex h-control-md w-control-md shrink-0 items-center justify-center ' +
                'rounded-control border border-transparent text-fg-tertiary transition ' +
                'duration-fast ease-standard can-hover:hover:bg-tertiary-hover ' +
                'can-hover:hover:text-fg motion-safe:active:scale-press'
              }
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-8 w-8">
                <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}

          {showIndicators && (
            <div className="flex items-center gap-2">
              {items.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show slide ${i + 1}`}
                  data-cursor-label={`Slide ${i + 1}`}
                  className={
                    'h-2 rounded-full transition-all duration-base ease-standard ' +
                    (i === index ? 'w-6 bg-fg' : 'w-2 bg-fg-tertiary')
                  }
                />
              ))}
            </div>
          )}

          {showControls && (
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next"
              data-cursor-label="Next"
              className={
                'inline-flex h-control-md w-control-md shrink-0 items-center justify-center ' +
                'rounded-control border border-transparent text-fg-tertiary transition ' +
                'duration-fast ease-standard can-hover:hover:bg-tertiary-hover ' +
                'can-hover:hover:text-fg motion-safe:active:scale-press'
              }
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-8 w-8">
                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
