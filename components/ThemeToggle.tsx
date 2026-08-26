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
 *
 * The icon itself is a moon-to-sun morph, not two swapped glyphs, at Alex's
 * direction — one orb, one overlapping "cutout" circle that masks a bite out
 * of it. In dark mode the cutout overlaps the orb, leaving a crescent; on
 * toggle it slides clear via `transform: translateX()` (see `.theme-cutout`
 * in globals.css), progressively unmasking the orb into a full circle. Both
 * states also carry a soft colored glow — icy blue for the moon, warm orange
 * for the sun — via `drop-shadow`, plus one shared specular highlight
 * ellipse for the "inner light." Same 500ms as the rest of this component's
 * crossfade, all through CSS custom properties (`--theme-toggle-*` in
 * globals.css), never a raw color in this file.
 */
const FADE_MS = 500;

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark' | null>(null);

  useEffect(() => {
    // The actual APPLIED theme (set by the boot script in app/layout.tsx,
    // which defaults new visitors to dark) is the source of truth, not a
    // fresh read of localStorage/matchMedia — those two can disagree with
    // what's already on <html> (e.g. a first-time visitor on a light-OS
    // machine: boot script applies data-theme="dark", but matchMedia still
    // reports light), which left this button's icon and "Switch to ___
    // mode" label backwards from the page's actual appearance until the
    // first click. Reading the DOM attribute keeps this in sync with
    // whatever's actually rendered, in every case.
    const applied = document.documentElement.getAttribute('data-theme');
    if (applied === 'light' || applied === 'dark') {
      setTheme(applied);
      return;
    }
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
      {/* overflow: visible — the drop-shadow glow extends past the 24x24
          viewBox, and clipping it would cut the "outer light" off flat at
          the box edge instead of letting it fall off softly. Sized up one
          step (h-7/w-7, 20px) to match the previous icon's visual weight
          next to the hamburger's 18px bar span. */}
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7 overflow-visible">
        <mask id="theme-toggle-mask">
          <rect x="0" y="0" width="24" height="24" fill="white" />
          {/* Positioned over the orb's upper-left by default (dark/moon);
              globals.css slides it clear on data-theme="light". Black in a
              luminance mask = "cut this out." */}
          <circle className="theme-cutout" cx="8.5" cy="10" r="5.5" fill="black" />
        </mask>
        <circle className="theme-orb" cx="12" cy="12" r="5.5" mask="url(#theme-toggle-mask)" />
        {/* The one shared "inner light" specular highlight — present on
            both moon and sun, unrecolored, the way a real lit sphere always
            carries one highlight regardless of its own color. Placed on the
            orb's upper-RIGHT, not upper-left — the cutout circle (above)
            sits over the upper-left in dark mode, and a highlight placed
            there would fall inside the masked-out crescent bite and
            disappear entirely in that state. */}
        <ellipse cx="14.4" cy="9.8" rx="1.6" ry="1.1" fill="var(--theme-toggle-highlight)" mask="url(#theme-toggle-mask)" />
      </svg>
    </button>
  );
}
