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
 * and mobile... reduce the size of the cards"): `cardWidth`/`cardHeight`
 * describe the stack's DESKTOP size; a ResizeObserver on the wrapper reads
 * the actual space available and computes a uniform `scale` (never above
 * 1) so the whole stack — cards, spread, depth, tilt geometry — shrinks
 * together and never overflows its container, down to a `compact` (320px)
 * phone width. A single `transform: scale()` on the unscaled stack (kept
 * at its native pixel geometry so the 3D transforms inside it stay
 * correct) is simpler and more robust than re-deriving every dimension in
 * JS, and it scales the AppCard content proportionally too rather than
 * reflowing it at a size AppCard was never designed for.
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
 * are the row's only content.
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
  radius?: number;
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
  radius = 18,
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
  const wrapperRef = useRef<HTMLDivElement>(null);
  const count = items.length;

  const dirSign = tiltDirection === 'right' ? 1 : -1;
  const stackWidth = cardWidth + spread * Math.max(visibleCards - 1, 0) * 2;

  // Fit the stack to whatever width the wrapper actually has, down to a
  // floor that keeps cards legible on the smallest phones (compact, 320px)
  // rather than letting them shrink to nothing. Never scales UP past 1 —
  // this shrinks the desktop-sized geometry to fit, it doesn't magnify it
  // on a huge screen.
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const MIN_SCALE = 0.5;
    const compute = () => {
      const available = el.clientWidth;
      if (!available) return;
      const next = Math.min(1, Math.max(available / stackWidth, MIN_SCALE));
      setScale(next);
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, [stackWidth]);

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
      {/* Scaled stack: kept at its native (desktop) pixel geometry so the
          translateX/translateZ/rotateY math above stays correct, then
          shrunk as one unit via `scale`. The wrapping box is sized to the
          SCALED footprint so layout (and the controls row below) doesn't
          reserve the full unscaled width/height. */}
      <div
        className="relative mx-auto"
        style={{ width: stackWidth * scale, height: cardHeight * scale }}
      >
        <div
          className="absolute left-0 top-0"
          style={{
            width: stackWidth,
            height: cardHeight,
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
                aria-hidden={offset !== 0}
                style={{
                  position: 'absolute',
                  inset: 0,
                  margin: 'auto',
                  width: cardWidth,
                  height: cardHeight,
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
                  borderRadius: radius,
                  overflow: 'hidden',
                  backgroundColor: tint,
                  boxShadow: '0 24px 48px -12px rgba(0,0,0,0.35)',
                }}
              >
                {item}
              </div>
            );
          })}
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
                'text-fg-tertiary transition duration-fast ease-standard ' +
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
                'text-fg-tertiary transition duration-fast ease-standard ' +
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
