'use client';

import { useEffect, useState, type ReactNode } from 'react';

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
  const count = items.length;

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

  const dirSign = tiltDirection === 'right' ? 1 : -1;
  const stackWidth = cardWidth + spread * Math.max(visibleCards - 1, 0) * 2;

  return (
    <div
      className="relative mx-auto"
      style={{ width: stackWidth, height: cardHeight, perspective: `${perspective}px` }}
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
        const scale = Math.max(1 - falloff * abs, 0.4);
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
                `scale(${scale})`,
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

      {showControls && count > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous"
            data-cursor-label="Previous"
            className={
              'absolute top-1/2 z-20 flex h-control-md w-control-md -translate-y-1/2 items-center justify-center ' +
              'rounded-full border border-line-subtle bg-raised text-fg shadow-e1 transition ' +
              'duration-fast ease-standard can-hover:hover:bg-secondary-hover motion-safe:active:scale-press'
            }
            style={{ left: -20 }}
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next"
            data-cursor-label="Next"
            className={
              'absolute top-1/2 z-20 flex h-control-md w-control-md -translate-y-1/2 items-center justify-center ' +
              'rounded-full border border-line-subtle bg-raised text-fg shadow-e1 transition ' +
              'duration-fast ease-standard can-hover:hover:bg-secondary-hover motion-safe:active:scale-press'
            }
            style={{ right: -20 }}
          >
            ›
          </button>
        </>
      )}

      {showIndicators && count > 1 && (
        <div className="absolute inset-x-0 flex justify-center gap-2" style={{ bottom: -32 }}>
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
    </div>
  );
}
