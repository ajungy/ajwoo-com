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
 * CARD CHROME: the per-card wrapper no longer paints its own background,
 * radius, or box-shadow — those clipped/flattened AppCard's own border,
 * corner radius, and `shadow-e1`→`shadow-e2` hover shadow (the same shadow
 * the /apps grid cards use), which is exactly the effect Alex asked this
 * carousel match ("add the shadow effect of hover like the other cards in
 * the apps page"). AppCard is already fully self-clipping (its own
 * `rounded-xl overflow-hidden`), so the wrapper only needs to carry
 * position/transform/opacity/filter — see `hoverZoom` on AppCard.tsx for
 * the other half of this (removing the carousel's own redundant zoom).
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
  /** @deprecated no longer applied — the per-card wrapper doesn't paint its
   *  own radius any more; AppCard supplies its own `rounded-xl`. Kept in the
   *  prop interface so existing callers don't need an edit. */
  radius?: number;
  /** @deprecated no longer applied — the per-card wrapper doesn't paint its
   *  own background any more; AppCard supplies its own `bg-raised`. Kept in
   *  the prop interface so existing callers don't need an edit. */
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

export function DepthCarousel({
  items,
  depth = 220,
  spread = 90,
  tilt = 22,
  tiltDirection = 'right',
  perspective = 1400,
  visibleCards = 4,
  falloff = 0.2,
  blur = 6,
  autoplay = false,
  loop = true,
  cardWidth = 300,
  cardHeight = 380,
  duration = 700,
  ease = POWER3_OUT,
  autoplayDelay = 3200,
  showControls = true,
  showIndicators = true,
  onActiveChange,
}: DepthCarouselProps) {
  const [index, setIndex] = useState(0);
  const [scale, setScale] = useState(1);
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

  useEffect(() => {
    if (!autoplay || count < 2) return;
    const id = setInterval(() => {
      setIndex((i) => (loop ? (i + 1) % count : Math.min(i + 1, count - 1)));
    }, autoplayDelay);
    return () => clearInterval(id);
  }, [autoplay, autoplayDelay, loop, count]);

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
      <div className="relative overflow-hidden" style={{ height: measuredHeight * scale }}>
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
            fanned-out side cards symmetrically off both edges. */}
        <div
          className="absolute top-0"
          style={{
            left: '50%',
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
            const cardScale = Math.max(1 - falloff * abs, 0.4);
            const cardBlur = offset === 0 ? 0 : Math.min(blur * abs, blur * visibleCards);

            return (
              <div
                key={i}
                ref={offset === 0 ? activeCardRef : undefined}
                aria-hidden={offset !== 0}
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
                  transition: `transform ${duration}ms ${ease}, opacity ${duration}ms ${ease}, filter ${duration}ms ${ease}`,
                  opacity: isVisible ? Math.max(1 - abs * 0.18, 0) : 0,
                  filter: cardBlur ? `blur(${cardBlur}px)` : undefined,
                  zIndex: count - abs,
                  pointerEvents: offset === 0 ? 'auto' : 'none',
                  // No radius/background/box-shadow here any more — AppCard
                  // is fully self-clipping (its own rounded-xl
                  // overflow-hidden, border, and shadow-e1 -> shadow-e2
                  // hover shadow), and painting a second, static shadow on
                  // this wrapper both clipped that hover shadow (this div
                  // used to be `overflow: hidden`) and flattened it to one
                  // constant look regardless of hover state.
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
