'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * CLAUDE.md §6(b)/(c) — a drop of water that follows the pointer.
 *
 * Two objects, with different jobs:
 *   DOT   the truth. Exactly under the pointer, zero lag, so precision is
 *         never in question — this is what keeps the effect from being a
 *         usability tax.
 *   DROP  the physics. Chases the dot and arrives late, stretches along its
 *         direction of travel, and settles when it stops. Over anything
 *         clickable it swells to cover the target: the water finding the
 *         thing you can press IS the affordance.
 *
 * Held constraints:
 *  - ENHANCEMENT ONLY. Every target carries its own visible label and
 *    accessible name. This echoes; it never reveals.
 *  - Gated on (any-pointer: fine) AND prefers-reduced-motion: no-preference.
 *  - Composite-only per frame: transform, plus width/height/radius on a
 *    position:fixed out-of-flow element, so no page content can move.
 *  - No layout reads inside the loop. Target geometry is cached on
 *    pointerover and refreshed on scroll/resize only.
 */

// Tuning. If it ever reads as busy, these three are the knobs — in this order.
const FOLLOW = 0.16;   // lower = more lag = more "a drop chasing you"
const MORPH = 0.22;    // how fast the drop takes the shape of a target
const STRETCH = 0.055; // how much speed deforms it

const REST_SIZE = 26;      // resting droplet diameter
const BUBBLE_SIZE = 96;    // size used over large targets, where it carries a word
const PAD = 8;             // how far past a small target's edge the water spreads
const MAX_MORPH_W = 300;   // past this, cover-the-element becomes a huge blob,
const MAX_MORPH_H = 88;    // so we use a labelled bubble instead

/** A displacement map shaped like a lens: neutral in the middle, bending hard
 *  at the rim. Red encodes x-offset, green y-offset, and the radial mask makes
 *  the bend fall off toward the centre — which is exactly how a real droplet
 *  refracts what is behind it. */
const LENS_MAP = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128">
<defs>
<linearGradient id="gx" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#f00"/></linearGradient>
<linearGradient id="gy" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#0f0"/></linearGradient>
<radialGradient id="fall" cx="0.5" cy="0.5" r="0.5">
<stop offset="0" stop-color="#fff" stop-opacity="0"/>
<stop offset="0.58" stop-color="#fff" stop-opacity="0.02"/>
<stop offset="0.82" stop-color="#fff" stop-opacity="0.34"/>
<stop offset="0.95" stop-color="#fff" stop-opacity="0.88"/>
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

const twoWords = (s: string) => s.trim().split(/\s+/).slice(0, 2).join(' ');

export function Cursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState('');
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia('(any-pointer: fine)');
    const calm = window.matchMedia('(prefers-reduced-motion: no-preference)');
    if (!fine.matches || !calm.matches) return;
    setEnabled(true);
    document.documentElement.setAttribute('data-cursor', 'on');

    const pointer = { x: innerWidth / 2, y: innerHeight / 2 };
    const drop = { x: pointer.x, y: pointer.y, w: REST_SIZE, h: REST_SIZE, r: REST_SIZE / 2 };
    // What the drop is currently trying to become.
    const want = { x: pointer.x, y: pointer.y, w: REST_SIZE, h: REST_SIZE, r: REST_SIZE / 2 };

    let active: Element | null = null;
    let rect: DOMRect | null = null;
    let covering = false; // true when the drop is wearing a target's shape
    let visible = false;
    let raf = 0;

    const measure = () => {
      if (!active) return;
      rect = active.getBoundingClientRect();
      const small = rect.width <= MAX_MORPH_W && rect.height <= MAX_MORPH_H;
      covering = small;
      if (small) {
        const cs = getComputedStyle(active);
        const radius = parseFloat(cs.borderTopLeftRadius) || 0;
        want.w = rect.width + PAD * 2;
        want.h = rect.height + PAD * 2;
        want.r = Math.min(radius + PAD, want.h / 2);
      } else {
        want.w = BUBBLE_SIZE;
        want.h = BUBBLE_SIZE;
        want.r = BUBBLE_SIZE / 2;
      }
    };

    const release = () => {
      active = null;
      rect = null;
      covering = false;
      want.w = REST_SIZE;
      want.h = REST_SIZE;
      want.r = REST_SIZE / 2;
      setLabel('');
    };

    const onOver = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.(
        'a, button, [role="button"], [data-cursor-label]',
      );
      if (!el) {
        if (active) release();
        return;
      }
      if (el === active) return;
      active = el;
      measure();
      // A word only where the drop is NOT already wearing the target's shape.
      // Over a button, the button's own label refracts through the water and a
      // second label on top would just be the same thing twice.
      const raw = el.getAttribute('data-cursor-label') ?? '';
      setLabel(covering || !raw ? '' : twoWords(raw));
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

    const tick = () => {
      // Where the drop wants to be: centred on a target it has found,
      // otherwise on the pointer itself.
      if (active && rect) {
        want.x = rect.left + rect.width / 2;
        want.y = rect.top + rect.height / 2;
      } else {
        want.x = pointer.x;
        want.y = pointer.y;
      }

      const dx = want.x - drop.x;
      const dy = want.y - drop.y;
      drop.x += dx * FOLLOW;
      drop.y += dy * FOLLOW;
      drop.w += (want.w - drop.w) * MORPH;
      drop.h += (want.h - drop.h) * MORPH;
      drop.r += (want.r - drop.r) * MORPH;

      // Speed deforms it: a falling drop is a teardrop, a still one is a bead.
      // Suppressed once it has settled over a target, which should look calm.
      const speed = Math.hypot(dx * FOLLOW, dy * FOLLOW);
      const k = covering ? 0 : Math.min(speed * STRETCH, 0.34);
      const angle = speed > 0.4 ? (Math.atan2(dy, dx) * 180) / Math.PI : 0;

      if (dropRef.current) {
        const s = dropRef.current.style;
        s.width = `${drop.w}px`;
        s.height = `${drop.h}px`;
        s.borderRadius = `${drop.r}px`;
        s.transform = `translate3d(${drop.x - drop.w / 2}px, ${drop.y - drop.h / 2}px, 0)`;
      }
      if (bodyRef.current) {
        // Stretch along travel, squeeze across it — volume is conserved, which
        // is why it reads as liquid rather than as a scaling circle.
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
    addEventListener('scroll', measure, { passive: true });
    addEventListener('resize', measure, { passive: true });
    document.addEventListener('pointerleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('pointermove', onMove);
      removeEventListener('pointerover', onOver);
      removeEventListener('scroll', measure);
      removeEventListener('resize', measure);
      document.removeEventListener('pointerleave', onLeave);
      document.documentElement.removeAttribute('data-cursor');
    };
  }, []);

  if (!enabled) return null;

  return (
    <div ref={rootRef} className="cursor-root" aria-hidden="true" data-visible="false">
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter
            id="dropletLens"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
            colorInterpolationFilters="sRGB"
          >
            <feImage
              href={`data:image/svg+xml;utf8,${encodeURIComponent(LENS_MAP)}`}
              result="map"
              preserveAspectRatio="none"
              x="0%"
              y="0%"
              width="100%"
              height="100%"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="map"
              scale="38"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <div ref={dropRef} className="cursor-drop">
        <div ref={bodyRef} className="cursor-drop-body" />
        <div className="cursor-drop-gloss" />
        {label && <div className="cursor-drop-label">{label}</div>}
      </div>

      <div ref={dotRef} className="cursor-dot" />
    </div>
  );
}
