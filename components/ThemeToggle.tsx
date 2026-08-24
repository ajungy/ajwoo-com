'use client';

import { useEffect, useState } from 'react';

/**
 * Light/dark toggle.
 *
 * CLAUDE.md §5 originally rejected this: the system says omit `data-theme` and
 * follow the OS, and a toggle is a control that changes a preference the OS
 * already knows. Alex asked for it explicitly, so it is built — and the
 * rejection log is updated rather than left contradicting the code.
 *
 * It starts from the OS and only writes `data-theme` once the user chooses, so
 * someone who never touches it still gets the OS behaviour the system intends.
 * `tokens.css` maps `data-theme` to `color-scheme`, so every `light-dark()`
 * token flips underneath with no per-component work.
 *
 * The flip itself is a plain 500ms `ease` crossfade, not a color sweep — an
 * earlier version played a multi-stage white→orange→navy→black animation;
 * Alex asked for that removed in favor of a simple fade back to the
 * system's actual white/black surfaces. Duration has moved twice since
 * (300ms, then 1000ms — which read as too slow — now 500ms).
 * `data-theme-transition` is set on `<html>` for exactly that 500ms, which
 * fades every foreground AND background color (text, icons, card surfaces,
 * the page background itself, the hero photo — see the
 * `[data-theme-transition]` rule and `.hero-light`/`.hero-dark` in
 * globals.css) at the same pace instead of snapping instantly.
 */
const FADE_MS = 500;

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark' | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') setTheme(stored);
    else setTheme(matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }, []);

  const next = theme === 'dark' ? 'light' : 'dark';
  const apply = () => {
    if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
      document.documentElement.setAttribute('data-theme-transition', 'true');
      setTimeout(() => document.documentElement.removeAttribute('data-theme-transition'), FADE_MS);
    }
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    setTheme(next);
  };

  return (
    <>
      <button
        type="button"
        onClick={apply}
        // Icon-only, so it carries a real accessible name that states the
        // OUTCOME, not the current state (Principle 6).
        aria-label={`Switch to ${next} mode`}
        title={`Switch to ${next} mode`}
        data-cursor-label="Switch theme"
        className={
          'inline-flex h-control-md w-control-md items-center justify-center rounded-control ' +
          'border border-transparent text-fg-secondary transition duration-fast ease-standard ' +
          'can-hover:hover:bg-tertiary-hover can-hover:hover:text-fg ' +
          'motion-safe:active:scale-press'
        }
      >
        {/* Both glyphs are always in the DOM at the same size, so the box never
            resizes between states (Principle 4). Sized up one step on this
            project's custom spacing scale (h-6→h-7, 16px→20px — NOT
            Tailwind's default rem scale, see tokens/tailwind.preset.js),
            at Alex's direction — the button itself stays h-control-md
            (matching HeaderMenu.tsx exactly), only the glyph inside grows,
            to close the gap between this icon's visual weight and the
            hamburger/X's own 18px bar span next to it. Stroke stays 1.5px,
            the system's one line weight for every icon
            (icons-and-illustrations.md), so it still reads as the same
            family rather than a heavier one. */}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
          strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-7 w-7">
          {theme === 'dark' ? (
            <>
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
            </>
          ) : (
            <path d="M20 13.5A8.5 8.5 0 1 1 10.5 4a6.5 6.5 0 0 0 9.5 9.5Z" />
          )}
        </svg>
      </button>
    </>
  );
}
