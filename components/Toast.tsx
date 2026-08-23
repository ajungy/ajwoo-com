'use client';

import { useEffect, useState } from 'react';
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

  if (!mounted) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-toast pointer-events-none">
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
    </div>
  );
}
