'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * CLAUDE.md §6(b)/(c) — a drop of water resting on the interface.
 *
 * Mounted on the landing page ONLY. Everywhere else the native cursor applies,
 * unmodified: on pages people are reading or scanning a grid, a chasing object
 * competes with the content instead of decorating it.
 *
 * Two objects:
 *   DOT   the truth. Exactly under the pointer, zero lag. Painted with
 *         `mix-blend-mode: difference`, so it inverts whatever is beneath it —
 *         white on black, black on white, blue on orange. Legible everywhere
 *         without knowing anything about the background.
 *   DROP  the physics. Chases the dot and arrives late, deforms with speed,
 *         settles when it stops, and takes the shape of whatever it is over.
 *
 * The optics are deliberately weak. A thin film of water is a *slight* zoom
 * lens, not a fisheye: the displacement is small and negative (magnifying), so
 * a button under the drop stays completely legible and merely sits a little
 * larger, surrounded by water. Nothing is ever drawn on top of it — the text
 * you read through the drop is the element's own.
 */

// Tuning, in the order to reach for them.
const FOLLOW = 0.16;    // lower = more lag
const MORPH = 0.22;     // how fast it takes a target's shape
const STRETCH = 0.05;   // how much speed deforms it
const REST_SIZE = 28;
const PAD = 10;         // how far past a target's edge the water spreads

// Click spring. Grip swells it, release rings and settles inside ~1s.
const GRIP = 0.34;
const SPRING = 0.20;
const DAMPING = 0.86;

/** Displacement map shaped like a lens: optically clean through the middle,
 *  bending only near the rim. Red encodes x-offset, green y-offset; the radial
 *  mask makes the bend fall to zero toward the centre.
 *
 *  NOTE ON THE HEX VALUES — the one place in this codebase where a raw hex is
 *  correct, and they must NOT be swapped for design tokens. They are not
 *  colours anyone sees: they are vector data for feDisplacementMap. #808000
 *  means "displace by zero"; the #f00/#0f0 ramps encode x and y offsets;
 *  #fff/#000 are mask luminance. Tokens here would silently break the lens. */
const LENS_MAP = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128">
<defs>
<linearGradient id="gx" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#f00"/></linearGradient>
<linearGradient id="gy" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#0f0"/></linearGradient>
<radialGradient id="fall" cx="0.5" cy="0.5" r="0.5">
<stop offset="0" stop-color="#fff" stop-opacity="0"/>
<stop offset="0.70" stop-color="#fff" stop-opacity="0"/>
<stop offset="0.88" stop-color="#fff" stop-opacity="0.35"/>
<stop offset="1" stop-color="#fff" stop-opacity="1"/>
</radialGradient>
<mask id="mk"><rect width="128" height="128" fill="#000"/><circle cx="64" cy="64" r="64" fill="url(#fall)"/></mask>
</defs>
<rect width="128" height="128" fill="#808000"/>
<g mask="url(#mk)">
<rect width="128" height="128" fill="#000"/>
<rect width="128" height="128" fill="url(#gx)" style="mix-blend-mode:screen"/>
<rect width="128" height="128" fill="url(#gy)" style="mix-blend-mode:screen"/>
</g>
</svg>`;

export function Cursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!window.matchMedia('(any-pointer: fine)').matches) return;
    if (!window.matchMedia('(prefers-reduced-motion: no-preference)').matches) return;
    setEnabled(true);
    document.documentElement.setAttribute('data-cursor', 'on');

    const pointer = { x: innerWidth / 2, y: innerHeight / 2 };
    const drop = { x: pointer.x, y: pointer.y, w: REST_SIZE, h: REST_SIZE, r: REST_SIZE / 2 };
    const want = { ...drop };

    let active: Element | null = null;
    let rect: DOMRect | null = null;
    let covering = false;
    let visible = false;
    let bounce = 0;      // current swell, 0 at rest
    let bounceV = 0;     // its velocity — this is what makes it ring
    let gripped = false;
    let raf = 0;

    const measure = () => {
      if (!active) return;
      rect = active.getBoundingClientRect();
      const cs = getComputedStyle(active);
      const radius = parseFloat(cs.borderTopLeftRadius) || 0;
      want.w = rect.width + PAD * 2;
      want.h = rect.height + PAD * 2;
      want.r = Math.min(radius + PAD, Math.min(want.w, want.h) / 2);
      covering = true;
    };

    const release = () => {
      active = null;
      rect = null;
      covering = false;
      want.w = REST_SIZE;
      want.h = REST_SIZE;
      want.r = REST_SIZE / 2;
    };

    const onOver = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.(
        'a, button, [role="button"], [data-cursor-label]',
      );
      if (!el) { if (active) release(); return; }
      if (el === active) return;
      active = el;
      measure();
    };

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      if (!visible) {
        visible = true;
        rootRef.current?.setAttribute('data-visible', 'true');
      }
    };
    const onLeave = () => {
      visible = false;
      rootRef.current?.setAttribute('data-visible', 'false');
    };
    // Touching the water: it grips and swells, then rings back to size.
    const onDown = () => { gripped = true; };
    const onUp = () => {
      if (gripped) bounceV += 0.10; // the flick that starts the oscillation
      gripped = false;
    };

    const tick = () => {
      want.x = active && rect ? rect.left + rect.width / 2 : pointer.x;
      want.y = active && rect ? rect.top + rect.height / 2 : pointer.y;

      const dx = want.x - drop.x;
      const dy = want.y - drop.y;
      drop.x += dx * FOLLOW;
      drop.y += dy * FOLLOW;
      drop.w += (want.w - drop.w) * MORPH;
      drop.h += (want.h - drop.h) * MORPH;
      drop.r += (want.r - drop.r) * MORPH;

      // Critically underdamped spring: overshoots, rings, settles in ~1s.
      bounceV += ((gripped ? GRIP : 0) - bounce) * SPRING;
      bounceV *= DAMPING;
      bounce += bounceV;

      const speed = Math.hypot(dx * FOLLOW, dy * FOLLOW);
      const k = covering ? 0 : Math.min(speed * STRETCH, 0.30);
      const angle = speed > 0.4 ? (Math.atan2(dy, dx) * 180) / Math.PI : 0;

      const w = drop.w * (1 + bounce);
      const h = drop.h * (1 + bounce);

      if (dropRef.current) {
        const s = dropRef.current.style;
        s.width = `${w}px`;
        s.height = `${h}px`;
        s.borderRadius = `${drop.r * (1 + bounce)}px`;
        s.transform = `translate3d(${drop.x - w / 2}px, ${drop.y - h / 2}px, 0)`;
      }
      if (bodyRef.current) {
        // Stretch along travel, squeeze across it: volume is conserved, which
        // is what reads as liquid rather than as a scaling circle.
        bodyRef.current.style.transform =
          `rotate(${angle}deg) scale(${1 + k}, ${1 - k * 0.72}) rotate(${-angle}deg)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    addEventListener('pointermove', onMove, { passive: true });
    addEventListener('pointerover', onOver, { passive: true });
    addEventListener('pointerdown', onDown, { passive: true });
    addEventListener('pointerup', onUp, { passive: true });
    addEventListener('scroll', measure, { passive: true });
    addEventListener('resize', measure, { passive: true });
    document.addEventListener('pointerleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('pointermove', onMove);
      removeEventListener('pointerover', onOver);
      removeEventListener('pointerdown', onDown);
      removeEventListener('pointerup', onUp);
      removeEventListener('scroll', measure);
      removeEventListener('resize', measure);
      document.removeEventListener('pointerleave', onLeave);
      // Leaving the landing page must give the native cursor back.
      document.documentElement.removeAttribute('data-cursor');
    };
  }, []);

  if (!enabled) return null;

  return (
    <div ref={rootRef} className="cursor-root" aria-hidden="true" data-visible="false">
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id="dropletLens" x="-50%" y="-50%" width="200%" height="200%" colorInterpolationFilters="sRGB">
            <feImage
              href={`data:image/svg+xml;utf8,${encodeURIComponent(LENS_MAP)}`}
              result="map"
              preserveAspectRatio="none"
              x="0%" y="0%" width="100%" height="100%"
            />
            {/* Negative scale magnifies rather than shrinks — a thin film of
                water is a slight zoom lens. Small, so text stays legible. */}
            <feDisplacementMap in="SourceGraphic" in2="map" scale="-9"
              xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <div ref={dropRef} className="cursor-drop">
        <div ref={bodyRef} className="cursor-drop-body" />
        <div className="cursor-drop-gloss" />
      </div>

      <div ref={dotRef} className="cursor-dot" />
    </div>
  );
}
