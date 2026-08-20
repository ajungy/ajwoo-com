'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

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
 *         without knowing anything about the background, and drawn the same
 *         way at all times: resting, hovering, gripped, mid-pop. There is no
 *         state in which it stops inverting.
 *   DROP  the physics. Chases the dot and arrives late, deforms with speed,
 *         settles when it stops, and takes the shape of small targets it is
 *         over. Large targets (the featured app card) are capped — see
 *         MAX_TARGET below — rather than morphed into a giant blob.
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
const PAD = 10;         // how far past a small target's edge the water spreads

// A target bigger than this in either dimension does not get morphed to its
// exact shape — covering the whole featured-app card would be a giant static
// blob, not water. Instead the drop caps at BIG_SIZE and keeps following the
// pointer, the same way it does over empty space, just larger. BIG_SIZE is
// exactly double --control-h-md (40px), Alex's own reference point for "a
// standard button".
const MAX_TARGET = 80;
const BIG_SIZE = 80;

// Click spring. Grip swells it, release rings and settles inside ~1s.
const GRIP = 0.34;
const SPRING = 0.20;
const DAMPING = 0.86;

// Pop, on navigating away. The drop only exists on `/`, so any internal link
// to another page is a click after which it must not simply vanish.
const POP_MS = 240;

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
  const router = useRouter();

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
    let covering = false;   // morphed exactly to a small target's shape
    let bigTarget = false;  // over a large target: capped size, still tracks the pointer
    let visible = false;
    let bounce = 0;      // current swell, 0 at rest
    let bounceV = 0;     // its velocity — this is what makes it ring
    let gripped = false;
    let popping = false; // mid pop-and-navigate; the tick loop hands off to popTick
    let raf = 0;

    const measure = () => {
      if (!active) return;
      rect = active.getBoundingClientRect();
      const big = rect.width > MAX_TARGET || rect.height > MAX_TARGET;
      bigTarget = big;
      if (big) {
        covering = false;
        want.w = BIG_SIZE;
        want.h = BIG_SIZE;
        want.r = BIG_SIZE / 2;
      } else {
        const cs = getComputedStyle(active);
        const radius = parseFloat(cs.borderTopLeftRadius) || 0;
        want.w = rect.width + PAD * 2;
        want.h = rect.height + PAD * 2;
        want.r = Math.min(radius + PAD, Math.min(want.w, want.h) / 2);
        covering = true;
      }
    };

    const release = () => {
      active = null;
      rect = null;
      covering = false;
      bigTarget = false;
      want.w = REST_SIZE;
      want.h = REST_SIZE;
      want.r = REST_SIZE / 2;
    };

    const onOver = (e: PointerEvent) => {
      if (popping) return;
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
    const onDown = () => { if (!popping) gripped = true; };
    const onUp = () => {
      if (gripped) bounceV += 0.10; // the flick that starts the oscillation
      gripped = false;
    };

    // Pop-and-navigate: the drop exists only on `/`, so a click that leaves
    // this page must not just vanish under it. Intercepted on the capture
    // phase so it runs before Next's own Link handler, then the actual
    // navigation is deferred until the pop has fully played.
    const onClickCapture = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
      const href = a.getAttribute('href') || '';
      if (!href.startsWith('/') || href === '/') return; // same page: nothing to pop for
      e.preventDefault();
      e.stopPropagation();
      pop(() => router.push(href));
    };

    const pop = (after: () => void) => {
      if (popping) return;
      popping = true;
      cancelAnimationFrame(raf);
      const startW = drop.w * (1 + bounce);
      const startH = drop.h * (1 + bounce);
      const cx = drop.x;
      const cy = drop.y;
      const start = performance.now();

      // Navigation is guarded to fire exactly once, from whichever completes
      // first: the animation frame or the timer. A backgrounded tab throttles
      // or fully pauses rAF (the visual pop just would not play), so the
      // click must never depend on rAF alone to actually leave the page.
      let navigated = false;
      const go = () => { if (!navigated) { navigated = true; after(); } };
      setTimeout(go, POP_MS);

      const popTick = (now: number) => {
        const t = Math.min((now - start) / POP_MS, 1);
        // A quick swell then a snap to nothing — a bubble bursting, not
        // fading away. Both stages use only transform (via width/height on a
        // fixed, out-of-flow element) and opacity.
        const scale = t < 0.35 ? 1 + (t / 0.35) * 0.4 : 1.4 - ((t - 0.35) / 0.65) * 1.4;
        const opacity = t < 0.55 ? 1 : Math.max(0, 1 - (t - 0.55) / 0.45);
        const w = Math.max(startW * scale, 0);
        const h = Math.max(startH * scale, 0);
        if (dropRef.current) {
          const s = dropRef.current.style;
          s.width = `${w}px`;
          s.height = `${h}px`;
          s.opacity = String(opacity);
          s.transform = `translate3d(${cx - w / 2}px, ${cy - h / 2}px, 0)`;
        }
        if (dotRef.current) dotRef.current.style.opacity = String(opacity);
        if (t < 1) requestAnimationFrame(popTick);
        else go();
      };
      requestAnimationFrame(popTick);
    };

    const tick = () => {
      if (popping) return;
      // Where the drop wants to be: the pointer itself at rest, over a large
      // target (bigTarget), or covering the exact target for a small one.
      const followPointer = !active || bigTarget;
      want.x = followPointer ? pointer.x : rect!.left + rect!.width / 2;
      want.y = followPointer ? pointer.y : rect!.top + rect!.height / 2;

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
    document.addEventListener('click', onClickCapture, true);

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('pointermove', onMove);
      removeEventListener('pointerover', onOver);
      removeEventListener('pointerdown', onDown);
      removeEventListener('pointerup', onUp);
      removeEventListener('scroll', measure);
      removeEventListener('resize', measure);
      document.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('click', onClickCapture, true);
      // Leaving the landing page must give the native cursor back.
      document.documentElement.removeAttribute('data-cursor');
    };
  }, [router]);

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

      {/* Painted with mix-blend-mode: difference in CSS, unconditionally — see
          .cursor-dot in globals.css. There is no code path, state, or event
          in this component that turns that off. */}
      <div ref={dotRef} className="cursor-dot" />
    </div>
  );
}
