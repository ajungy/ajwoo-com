'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * CLAUDE.md §6(b) + §6(c) — the pointer cursor and its refracting edge.
 *
 * Constraints this implementation holds to:
 *  - ENHANCEMENT ONLY. Every target already carries its verb visibly at rest and
 *    in its accessible name. This echoes; it never reveals.
 *  - Gated on (any-pointer: fine) AND prefers-reduced-motion: no-preference.
 *    Coarse pointers and reduced-motion users get the native cursor untouched.
 *  - Composite-only: transform and opacity. One rAF loop, one lerp, and ZERO
 *    layout reads per frame — target geometry is cached on pointerenter.
 *  - Zero layout shift: position:fixed, out of flow, affects no page content.
 *  - The liquid edge advances on POINTER DISPLACEMENT, not elapsed time, so the
 *    screen is genuinely still when nobody is moving (Principle 14).
 */
const LERP = 0.25;          // the first knob to turn if it reads as busy
const PHASE_PER_PX = 0.6;   // degrees of refraction per pixel travelled

export function Cursor() {
  const layer = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(any-pointer: fine)');
    const mo = window.matchMedia('(prefers-reduced-motion: no-preference)');
    const on = mq.matches && mo.matches;
    setEnabled(on);
    if (!on) return;

    document.documentElement.setAttribute('data-cursor', 'on');

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { ...target };
    let phase = 0;
    let raf = 0;
    let visible = false;

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!visible) {
        visible = true;
        layer.current?.setAttribute('data-visible', 'true');
      }
    };
    const onLeave = () => {
      visible = false;
      layer.current?.setAttribute('data-visible', 'false');
    };
    // Label swaps on pointerover — instant, no transition on the text.
    const onOver = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.('[data-cursor-label]');
      setLabel(el ? el.getAttribute('data-cursor-label') : null);
    };

    const tick = () => {
      const dx = target.x - pos.x;
      const dy = target.y - pos.y;
      pos.x += dx * LERP;
      pos.y += dy * LERP;
      // Refraction is driven by distance travelled, never by a clock.
      const moved = Math.hypot(dx * LERP, dy * LERP);
      if (moved > 0.01) {
        phase = (phase + moved * PHASE_PER_PX) % 360;
        layer.current?.style.setProperty('--edge-phase', `${phase}deg`);
      }
      if (layer.current) {
        layer.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerleave', onLeave);
      document.documentElement.removeAttribute('data-cursor');
    };
  }, []);

  if (!enabled) return null;

  return (
    <div ref={layer} className="cursor-layer" aria-hidden="true" data-visible="false">
      {label ? <div className="cursor-pill">{label}</div> : <div className="cursor-dot" />}
    </div>
  );
}
