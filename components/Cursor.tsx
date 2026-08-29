'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GlassSurfaceFill } from './GlassSurfaceFill';

/**
 * CLAUDE.md §6(b)/(c) — a drop of water resting on the interface.
 *
 * Mounted site-wide (app/layout.tsx), at Alex's direction — was originally
 * landing-page-only, on the reasoning that a chasing object competes with
 * content on pages people are reading or scanning a grid. That objection
 * didn't hold up in practice: every interactive target still carries its own
 * visible affordance underneath the drop, so the water reads as decoration
 * riding on top of the real UI rather than replacing it.
 *
 * Two objects:
 *   DOT   the truth. Exactly under the pointer, zero lag. Painted with
 *         `mix-blend-mode: difference` and rendered as a SIBLING of the water
 *         drop's root, not a descendant of it (see the CSS comment on
 *         .cursor-dot in globals.css) — nesting it inside the drop's own
 *         fixed/z-indexed wrapper silently trapped its blending against that
 *         wrapper's own near-empty local paint group instead of the real
 *         page, which is why the inversion looked broken before this fix.
 *         Inverts whatever is under it: white on black, black on white, blue
 *         on orange, unconditionally, at rest, hovering, gripped, or mid-pop.
 *   DROP  the physics. Chases the dot and arrives late, deforms with speed,
 *         settles when it stops, and takes the shape of small targets it is
 *         over. Large targets are capped, not morphed — see BIG_MIN below.
 *
 * The optics are deliberately weak. A thin film of water is a *slight* zoom
 * lens, not a fisheye: the displacement is small and negative (magnifying), so
 * a button under the drop stays completely legible and merely sits a little
 * larger, surrounded by water. Nothing is ever drawn on top of it — the text
 * you read through the drop is the element's own.
 *
 * TARGETING: only elements carrying `data-cursor-label` are considered. An
 * earlier version also matched bare `a`/`button`, which broke on the app
 * cards' stretched-link pattern — the pointer's hit-test resolves to the
 * small inner `<a>` (via its `::after` overlay) no matter where on the card
 * you actually are, so a bare `a` match made the drop shrink to the size of
 * the link's own text instead of representing the whole card. Requiring an
 * explicit label and putting that label on the outer, correctly-sized element
 * (see components/AppCard.tsx) fixes it without special-casing the card.
 */

// Tuning, in the order to reach for them.
const FOLLOW = 0.18;    // lower = more lag — raised from 0.12 at Alex's direction, chases the pointer faster
const MORPH = 0.18;     // how fast it takes a target's shape — reduced to be smoother
const STRETCH = 0.05;   // how much speed deforms it
const REST_SIZE = 28;
const PAD = 10;         // how far past a small target's edge the water spreads

// A target is only "big" if it exceeds this in BOTH dimensions — Alex's own
// spec: "more than double the size of a regular button, horizontally AND
// vertically". A wide-but-short control like "Book 30 minutes" (~146x40) or
// LinkedIn/Instagram must stay in the normal exact-shape morph; only
// something like the featured app card (both dimensions well past this) gets
// capped instead of morphed. BIG_MIN is exactly double --control-h-md (40px).
const BIG_MIN = 80;
const BIG_SIZE = 80; // the capped size once a target crosses that line

// Click spring. Grip swells it, release rings and settles inside ~1s.
const GRIP = 0.34;
const SPRING = 0.20;
const DAMPING = 0.86;

// Pop: every click on a labelled link plays this, as acknowledgement. If the
// click also leaves the page, real navigation is deferred until it finishes;
// otherwise (a new tab, mailto:, a same-page anchor) the drop resets after.
// Floored to POP_MIN so a pop over a small nav link is never too small to see.
const POP_MS = 320;
const POP_MIN = 40; // = --control-h-md, so the burst is always at least "button-sized"

export function Cursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const isFine = window.matchMedia('(any-pointer: fine)').matches;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    // No fine pointer AND no touch (rare, but covers keyboard-only/switch
    // access) — nothing to relocate to, so skip the whole effect.
    if (!isFine && !isTouch) return;
    if (!window.matchMedia('(prefers-reduced-motion: no-preference)').matches) return;
    setEnabled(true);
    document.documentElement.setAttribute('data-cursor', isFine ? 'on' : 'touch');
    // Touch mode: there's no hover to chase, so the drop only relocates on
    // tap — appearing at the tap point, settling there via the same
    // follow/morph physics, then fading after a hold rather than lingering
    // (nothing to signal "still under the finger" once it's lifted).
    const touchMode = !isFine;
    let hideTimer: ReturnType<typeof setTimeout> | null = null;

    // BUG FIX ("sometimes I don't see the cursor at all until I leave the
    // window and come back"): this used to default to the viewport CENTER
    // and rely on a real pointermove to correct it. If the mouse was
    // already sitting still somewhere else the instant this mounted — the
    // common case right after a page load, since nothing requires the user
    // to jiggle the mouse — the drop sat inertly at dead-center, nowhere
    // near the real cursor, until the user's mouse actually moved. That's
    // exactly what reads as "I don't see the cursor": something IS
    // rendered, just nowhere near where they're looking.
    //
    // There's no synchronous JS API for "where is the mouse right now"
    // without a prior event, but `:hover` IS live and synchronous —
    // `document.querySelectorAll(':hover')` returns whatever the pointer is
    // currently sitting over even though no JS listener has fired yet. Its
    // deepest match's center is a real, on-screen approximation of the
    // actual cursor position (rather than an arbitrary guess), and the
    // FOLLOW lerp glides it the rest of the way the instant a genuine
    // pointermove arrives. Falls back to viewport center only when nothing
    // is hovered at all (pointer outside the document — over browser
    // chrome, or a touch device with no persistent pointer).
    const hovered = document.querySelectorAll(':hover');
    const bestGuess = hovered.length ? hovered[hovered.length - 1].getBoundingClientRect() : null;
    const start = bestGuess
      ? { x: bestGuess.left + bestGuess.width / 2, y: bestGuess.top + bestGuess.height / 2 }
      : { x: innerWidth / 2, y: innerHeight / 2 };

    const pointer = { x: start.x, y: start.y };
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
    let popping = false; // mid pop; tick() hands off to the pop's own raf chain
    let raf = 0;

    const setVisible = (v: boolean) => {
      visible = v;
      const attr = v ? 'true' : 'false';
      rootRef.current?.setAttribute('data-visible', attr);
      dotRef.current?.setAttribute('data-visible', attr);
    };

    const measure = () => {
      if (!active) return;
      rect = active.getBoundingClientRect();
      const big = rect.width > BIG_MIN && rect.height > BIG_MIN;
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
      const el = (e.target as Element | null)?.closest?.('[data-cursor-label]');
      if (!el) { if (active) release(); return; }
      if (el === active) return;
      active = el;
      measure();
    };

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      if (!visible) setVisible(true);
      // Touch has no hover, but it DOES fire pointermove while a finger is
      // actively dragging across the screen — that's exactly the gesture
      // Alex asked the drop to follow, so a touch move re-targets whatever
      // is now under the finger and pushes the auto-hide timer back, same
      // as a fresh tap would.
      if (touchMode) {
        const el = (e.target as Element | null)?.closest?.('[data-cursor-label]');
        if (el !== active) { if (el) { active = el; measure(); } else { release(); } }
        if (hideTimer) clearTimeout(hideTimer);
        hideTimer = setTimeout(() => setVisible(false), 900);
      }
    };
    const onLeave = () => setVisible(false);

    // The real bug behind "the bubble disappears when I come back to this
    // tab": switching tabs (or apps) usually moves the real pointer up out
    // of the page into browser chrome first, which fires the pointerleave
    // above and hides the drop — correctly, at that instant. The problem is
    // what happens on RETURN: if the user doesn't happen to jiggle the
    // mouse over the page content again, nothing ever calls setVisible(true)
    // — onMove only runs on an actual pointermove, and there isn't
    // necessarily one. The drop stays invisible indefinitely with a real
    // cursor sitting right there on the page. `visibilitychange` (tab
    // switch) and `focus` (window/app switch) are both events that fire
    // reliably on return, with no dependency on the mouse having moved, so
    // both re-show the drop immediately rather than waiting for movement
    // that might not come.
    const onReturn = () => {
      if (!touchMode && document.visibilityState !== 'hidden') setVisible(true);
    };
    document.addEventListener('visibilitychange', onReturn);
    addEventListener('focus', onReturn);

    // Touching the water: it grips and swells, then rings back to size.
    const onDown = (e: PointerEvent) => {
      if (popping) return;
      gripped = true;
      if (!touchMode) return;
      // Relocate to the tap point, pick up whatever's under the finger (if
      // it carries a label) exactly like hover would on a fine pointer, and
      // show the drop. The auto-hide timer now starts on lift (onUp), not
      // here — while the finger is down and dragging, onMove above keeps
      // pushing it back, so the drop stays put and tracks the finger for as
      // long as the gesture continues.
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      const el = (e.target as Element | null)?.closest?.('[data-cursor-label]');
      if (el) { active = el; measure(); } else { release(); }
      setVisible(true);
      if (hideTimer) clearTimeout(hideTimer);
    };
    const onUp = () => {
      if (gripped) bounceV += 0.10; // the flick that starts the oscillation
      gripped = false;
      // A tap has no pointerleave to hide on — queue the fade once the
      // finger actually lifts, rather than on a fixed delay from touchdown,
      // so a long drag doesn't get cut off mid-gesture.
      if (touchMode) {
        if (hideTimer) clearTimeout(hideTimer);
        hideTimer = setTimeout(() => setVisible(false), 900);
      }
    };

    // Click handling: bubble stays present at all times, no pop animation.
    // Navigation proceeds immediately without any bubble expansion effect.
    const onClickCapture = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.('a[data-cursor-label]') as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute('href') || '';
      if (href === '/' || href === '') return;
      // A `download` anchor (e.g. "Download SKILL.md") must trigger the
      // browser's native save, not an SPA route push — router.push() was
      // silently swallowing the download attribute and just navigating to
      // the file's content instead of saving it.
      if (a.hasAttribute('download')) return;

      const opensElsewhere = a.target === '_blank' || /^(mailto:|tel:|#)/.test(href);
      const leavesPage = !opensElsewhere && href.startsWith('/');

      if (leavesPage) {
        e.preventDefault();
        e.stopPropagation();
        router.push(href);
      }
      // All other clicks proceed normally without any bubble animation
    };

    const finishPop = () => {
      popping = false;
      drop.w = REST_SIZE; drop.h = REST_SIZE; drop.r = REST_SIZE / 2;
      want.w = REST_SIZE; want.h = REST_SIZE; want.r = REST_SIZE / 2;
      drop.x = pointer.x; drop.y = pointer.y;
      bounce = 0; bounceV = 0;
      // Clear BOTH inline opacities the pop set, rather than reassigning one
      // from `visible` — that was a real bug: `visible` is read at the exact
      // instant finishPop runs, which can be stale relative to a pointermove
      // that arrives a moment later, leaving a permanent inline override that
      // fights the CSS `[data-visible]` rule forever after. Clearing defers
      // back to that rule, the same source of truth setVisible() already
      // keeps in sync via the data-visible attribute.
      if (dropRef.current) dropRef.current.style.opacity = '';
      if (dotRef.current) dotRef.current.style.opacity = '';
      raf = requestAnimationFrame(tick);
    };

    const pop = (after: () => void) => {
      if (popping) return;
      popping = true;
      cancelAnimationFrame(raf);
      const startW = Math.max(drop.w * (1 + bounce), POP_MIN);
      const startH = Math.max(drop.h * (1 + bounce), POP_MIN);
      const cx = drop.x;
      const cy = drop.y;
      const start = performance.now();

      // Navigation/reset fires from whichever completes first: the animation
      // frame or a timer. A backgrounded tab throttles or fully pauses rAF —
      // the visual pop just wouldn't play — so leaving the page (or resetting
      // the cursor) must never depend on rAF alone.
      let done = false;
      const finish = () => { if (!done) { done = true; after(); } };
      setTimeout(finish, POP_MS);

      const popTick = (now: number) => {
        const t = Math.min((now - start) / POP_MS, 1);
        // Expand to fill viewport, then shrink while fading: the bubble bursts
        // outward explosively in the first half, then the membrane gets thinner
        // (shrinks and fades) as it dissipates. Reaches ~3x viewport size at peak.
        const maxDim = Math.max(window.innerWidth, window.innerHeight) * 3;
        const scale = t < 0.5
          ? 1 + (t / 0.5) * (maxDim / Math.max(startW, startH) - 1)
          : (maxDim / Math.max(startW, startH)) * (1 - (t - 0.5) / 0.5);
        const opacity = t < 0.5 ? 1 : Math.max(0, 1 - (t - 0.5) / 0.5);
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
        else finish();
      };
      requestAnimationFrame(popTick);
    };

    const tick = () => {
      if (popping) return;
      // Where the drop wants to be: the pointer itself at rest, over a large
      // target (bigTarget), or covering the exact target for a small one.
      const followPointer = !active || bigTarget;
      want.x = followPointer ? pointer.x : rect!.left + rect!.width / 2;
      // For small targets, center on the bbox center exactly.
      want.y = followPointer ? pointer.y : rect!.top + rect!.height / 2;

      // Hidden: collapse toward a point rather than just fading the finished
      // shape out. Reusing the same MORPH interpolation that already handles
      // target-shape changes, so appearing/disappearing is the same physics
      // as everything else the drop does — shrinks to nothing while hidden,
      // grows back the moment it's visible again.
      //
      // BUG FIX: this used to write straight into `want.w/h/r` (the same
      // object measure()/release() maintain as "the real target size"). On a
      // page with no `data-cursor-label` elements anywhere near the pointer,
      // release() never runs again after the first hide — nothing calls it —
      // so `want` stayed permanently zeroed even once `visible` flipped back
      // to true, and the drop never regrew: only the dot (which doesn't read
      // `want` at all) kept showing. This is almost certainly the "sometimes
      // I only see the dot" Alex reported. Fix: collapse a LOCAL copy of the
      // target size instead, so `want` itself is never corrupted and the
      // drop always has a real size to grow back to.
      const targetW = visible ? want.w : 0;
      const targetH = visible ? want.h : 0;
      const targetR = visible ? want.r : 0;

      const dx = want.x - drop.x;
      const dy = want.y - drop.y;
      drop.x += dx * FOLLOW;
      drop.y += dy * FOLLOW;
      drop.w += (targetW - drop.w) * MORPH;
      drop.h += (targetH - drop.h) * MORPH;
      drop.r += (targetR - drop.r) * MORPH;

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
    // Fine pointer: the drop is standing in for the OS cursor, so it should
    // be there from the first frame, not only once the mouse first moves —
    // a stationary mouse (the common case right after a page load) would
    // otherwise never fire a pointermove to trigger it. Deferred one frame
    // rather than called synchronously here: `enabled` (the state flip that
    // actually mounts rootRef/dotRef's DOM nodes) hasn't committed yet at
    // this point in the effect, so the refs setVisible relies on are still
    // null and the call would silently no-op. By the first rAF callback,
    // React has committed that render and the refs are live. Starts at the
    // real `:hover`-derived position seeded above (or viewport center if
    // nothing was hovered) and glides the rest of the way via the same
    // FOLLOW lerp as everything else, the moment a move event arrives.
    // Touch is unaffected: there's no persistent OS cursor concept to stand
    // in for on a touchscreen, so it still only appears on contact.
    raf = requestAnimationFrame(() => {
      if (!touchMode) {
        // Also seed the target SHAPE, not just position, if the pointer
        // happened to already be sitting over a labelled target at mount —
        // otherwise the drop briefly shows as a plain circle at that
        // target's center before snapping to its shape a frame later.
        const label = hovered.length
          ? (hovered[hovered.length - 1] as Element).closest('[data-cursor-label]')
          : null;
        if (label) { active = label; measure(); }
        setVisible(true);
      }
      tick();
    });

    // pointermove is registered unconditionally — touch fires it too, for
    // as long as a finger is down and dragging, which is exactly the
    // gesture the touch branch inside onMove above is there to handle. Only
    // pointerover/pointerleave stay fine-pointer only: touch has no hover
    // state and no "the pointer left the window" event worth acting on.
    addEventListener('pointermove', onMove, { passive: true });
    if (!touchMode) {
      addEventListener('pointerover', onOver, { passive: true });
      document.addEventListener('pointerleave', onLeave);
    }
    addEventListener('pointerdown', onDown, { passive: true });
    addEventListener('pointerup', onUp, { passive: true });
    addEventListener('scroll', measure, { passive: true });
    addEventListener('resize', measure, { passive: true });
    document.addEventListener('click', onClickCapture, true);

    return () => {
      cancelAnimationFrame(raf);
      if (hideTimer) clearTimeout(hideTimer);
      removeEventListener('pointermove', onMove);
      removeEventListener('pointerover', onOver);
      removeEventListener('pointerdown', onDown);
      removeEventListener('pointerup', onUp);
      removeEventListener('scroll', measure);
      removeEventListener('resize', measure);
      document.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('visibilitychange', onReturn);
      removeEventListener('focus', onReturn);
      document.removeEventListener('click', onClickCapture, true);
      // Leaving the landing page must give the native cursor back.
      document.documentElement.removeAttribute('data-cursor');
    };
  }, [router]);

  if (!enabled) return null;

  return (
    <>
      <div ref={rootRef} className="cursor-root" aria-hidden="true" data-visible="false">
        <div ref={dropRef} className="cursor-drop">
          <div ref={bodyRef} className="cursor-drop-body">
            {/* React Bits' GlassSurface (see GlassSurfaceFill.tsx) — a
                dynamic SVG feDisplacementMap lens with per-channel
                chromatic-aberration offsets, replacing BOTH the old static
                `dropletLens` filter that used to live here AND the WebGL
                FluidGlass attempt that briefly replaced it, at Alex's
                direction ("the React bit is not really working... try to
                use this other one instead"). Clipped to this element's own
                shape via the CSS `overflow: hidden; border-radius: inherit`
                already on .cursor-drop-body, so it always exactly fills
                whatever the drop currently is, at rest or morphed over a
                target. Prop values are the exact ones from Alex's own
                pasted "Advanced Glass Distortion" example. */}
            <GlassSurfaceFill
              displace={0}
              distortionScale={-180}
              redOffset={0}
              greenOffset={10}
              blueOffset={20}
              brightness={50}
              opacity={1}
              mixBlendMode="screen"
            />
          </div>
        </div>
      </div>

      {/* A sibling of .cursor-root, not a descendant — see the CSS comment on
          .cursor-dot for why that placement is load-bearing for the blend. */}
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" data-visible="false" />
    </>
  );
}
