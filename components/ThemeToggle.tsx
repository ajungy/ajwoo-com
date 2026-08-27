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
 * system's actual white/black surfaces. `data-theme-transition` is set on
 * `<html>` for exactly that 500ms, which fades every foreground AND
 * background color (text, icons, card surfaces, the page background
 * itself, the hero photo — see `[data-theme-transition]` and
 * `.hero-light`/`.hero-dark` in globals.css) at the same pace instead of
 * snapping instantly.
 *
 * THE ICON — ported from toggles.dev's "Classic" toggle (toggles.dev/
 * toggles/classic; the actual open-source project behind it is Alfie
 * Jones's `theme-toggles`, github.com/alfiejones/theme-toggles, MIT). Two
 * earlier rounds tried to reproduce a sun/moon animation by hand — one
 * ported jolyui's AnimatedThemeToggle (scale+opacity crossfade of two
 * icon layers), one was a from-scratch mask-based morph. Alex pointed at
 * this specific one and asked for it directly, so this is a port of its
 * actual source (fetched from the GitHub repo, not re-derived), not
 * another attempt at approximating the idea.
 *
 * How it actually works, since it's a genuinely different technique than
 * either earlier attempt: the circle is SOLID (`fill: currentColor`), not
 * a stroked ring, and it's reshaped by an animated `clip-path` — a <path>
 * inside a <clipPath>, whose own `d` attribute transitions between two
 * strings that share the same command sequence (M/h/a/v/Z in both), which
 * is what makes a `d` transition valid at all: CSS can only interpolate
 * between two path strings with matching command types and counts, not
 * arbitrary shapes. The circle ALSO scales up 1.7x at the same time, so
 * the crescent effect comes from a growing solid disc being progressively
 * clipped, not from a hole being cut into a fixed one. The 8 rays scale
 * to 0 and fade out, `transform-box: view-box` (not `fill-box` — the
 * actual cross-browser bug from two rounds ago) staggered by a 15%-of-
 * duration delay that's only applied when they're COMING BACK (light
 * mode), not going away, so darkening feels immediate and lightening
 * feels like the rays sprout back after the circle's already reshaped.
 *
 * The library ships its own fallback for browsers that can't animate the
 * `d` property at all (checked via `@supports (d: path(...))`): the clip
 * path just translates into roughly the right position instead of
 * morphing. Reproduced here too, since this was raised specifically
 * because of an older-browser report.
 *
 * Color is a deliberate, explicit override, at Alex's direction: black in
 * light mode, white in dark mode, not this project's usual
 * `text-fg-secondary`/hover-to-`text-fg` token pair — a flat, maximum-
 * contrast icon rather than a muted secondary one.
 */
const FADE_MS = 500;

const RAYS = [
  'M12 1.4v2.4',
  'm20.3 3.7-2.5 2.5',
  'M22.6 12h-2.4',
  'M12 22.6v-2.4',
  'M1.4 12h2.4',
  'm20.3 20.3-2.5-2.5',
  'm3.7 20.3 2.5-2.5',
  'm3.7 3.7 2.5 2.5',
];

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark' | null>(null);

  useEffect(() => {
    // The actual APPLIED theme (set by the boot script in app/layout.tsx,
    // which defaults new visitors to dark) is the source of truth, not a
    // fresh read of localStorage/matchMedia — those two can disagree with
    // what's already on <html> (e.g. a first-time visitor on a light-OS
    // machine: boot script applies data-theme="dark", but matchMedia still
    // reports light), which left this control's icon and "Switch to ___
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
        'border border-transparent transition duration-fast ease-standard ' +
        'can-hover:hover:bg-tertiary-hover motion-safe:active:scale-press'
      }
    >
      {/* theme-icon-classic carries the explicit black/white color — see
          the class comment above and .theme-icon-classic in globals.css. */}
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="theme-icon-classic h-7 w-7">
        <defs>
          <clipPath id="theme-icon-classic-clip">
            <path className="theme-icon-classic-clip-path" d="M0 0h25a1 1 0 0010 10v14H0Z" />
          </clipPath>
        </defs>
        <g stroke="currentColor" strokeLinecap="round">
          <circle
            className="theme-icon-classic-circle"
            cx="12"
            cy="12"
            r="5"
            fill="currentColor"
            clipPath="url(#theme-icon-classic-clip)"
          />
          {RAYS.map((d) => (
            <path
              key={d}
              className="theme-icon-classic-ray"
              d={d}
              fill="none"
              strokeWidth={2}
              strokeLinejoin="round"
              strokeMiterlimit={0}
              paintOrder="stroke markers fill"
            />
          ))}
        </g>
      </svg>
    </button>
  );
}
