'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle } from './Icons';

/**
 * Bottom-center confirmation toast (Share, CopyEmailButton).
 *
 * CONTRAST BUG FIXED: this used to pair `bg-fg` (the strong, theme-flipping
 * near-black/near-white token) with `text-bg` — but there is no `bg` color in
 * the token set (only `page`, `raised`, `sunken`, ...), so `text-bg` silently
 * produced no class at all and the text fell back to inheriting the page's
 * own text color. In light mode that meant near-black text on a near-black
 * box; in dark mode, near-white on near-white. The fix pairs `bg-fg` with
 * `text-page` — the page's own background color, which is deliberately the
 * opposite end of the palette from `fg` in both themes, so it always reads.
 *
 * Animates in from below on mount and back out before unmounting, rather
 * than snapping in and out — a real transition, not the inert
 * `animate-in`/`fade-in` classes the previous version had (this codebase
 * doesn't have the tailwindcss-animate plugin installed, so those were
 * silently doing nothing).
 *
 * Rendered via a portal straight into <body>, at Alex's direction, after
 * "the toast isn't centered at the bottom" — a caller like CopyEmailButton
 * lives inside the hero's `.entrance-target`, which carries a CSS
 * `animation` (the one-time entrance) during its first second on screen;
 * any element with an active transform/animation establishes a new
 * containing block for its `position: fixed` descendants, which silently
 * repositions this toast relative to that ancestor instead of the real
 * viewport if it's ever triggered while that's active (or from inside any
 * future transformed/filtered wrapper this doesn't know about). Portaling
 * to `document.body` sidesteps the whole class of bug rather than chasing
 * every ancestor that might one day carry a transform.
 */
export function Toast({ message, duration = 3000 }: { message: string; duration?: number }) {
  const [entered, setEntered] = useState(false);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    const EXIT_MS = 250;
    const raf = requestAnimationFrame(() => setEntered(true));
    const exitTimer = setTimeout(() => setEntered(false), duration - EXIT_MS);
    const removeTimer = setTimeout(() => setMounted(false), duration);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(exitTimer);
      clearTimeout(removeTimer);
    };
  }, [duration]);

  if (!mounted || typeof document === 'undefined') return null;

  // bottom offset is the safe-area inset (notch/home-indicator) plus a small
  // 12px margin, not a fixed bottom-6 — Alex asked for this to sit right at
  // the bottom edge on every device, not floating partway up the screen,
  // while still clearing a phone's home-indicator bar.
  return createPortal(
    <div className="fixed inset-x-0 bottom-[calc(var(--safe-bottom)+12px)] z-toast flex justify-center pointer-events-none">
      <div
        className={
          'flex items-center gap-3 px-5 py-4 bg-fg text-page rounded-lg shadow-e2 ' +
          'transition-all duration-300 ease-standard motion-reduce:transition-none ' +
          (entered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3')
        }
      >
        <CheckCircle className="w-5 h-5 shrink-0" />
        <span className="text-label font-medium">{message}</span>
      </div>
    </div>,
    document.body
  );
}
