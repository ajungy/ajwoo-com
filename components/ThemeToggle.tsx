'use client';

import { useEffect, useRef, useState } from 'react';

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
 * THE ICON — back to jolyui.dev's AnimatedThemeToggle (jolyui.dev/docs/
 * components/inputs/animated-theme-toggle), at Alex's direction, after a
 * detour through a from-scratch line-morph and a port of toggles.dev's
 * "Classic". The exact sun (circle + 8 rays) and moon (single crescent)
 * SVG paths from jolyui's registry source, copied verbatim, animated as
 * two whole stacked <svg> elements (not one <svg> with inner groups —
 * `transform-box: fill-box` on a grouping element is the actual bug that
 * silently broke this in Safari two rounds ago; a whole SVG's own
 * `transform-origin: center` needs nothing browser-specific to resolve).
 * The reference drives this with the `motion` npm package and reads theme
 * state via `next-themes`; neither is used here — `scale`/`opacity`/
 * `stroke-dasharray` are all this project already leans on for motion
 * elsewhere, and `next-themes` would mean replacing this project's own
 * hand-tuned theme system for a component that only needed new artwork.
 *
 * Color is a flat black (light mode) / white (dark mode) pair, at Alex's
 * explicit direction — not this project's usual text-fg-secondary/
 * hover-to-text-fg tokens.
 */
const FADE_MS = 500;

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark' | null>(null);
  const iconRef = useRef<HTMLSpanElement>(null);

  // The reference's "stroke draws in" flourish. Framer's `pathLength`
  // motion value is a 0–1 FRACTION of each path's own length; the CSS
  // equivalent is `stroke-dasharray`/`stroke-dashoffset`, but those need
  // each path's real rendered length in pixels, which only the browser
  // can measure (`getTotalLength()`) — there's no way to know it from the
  // `d` string alone, and the 10 paths here (9 sun + 1 moon) are all
  // different lengths. Measured once after mount (the artwork is static;
  // nothing here ever resizes) and written as a `--path-length` custom
  // property per element, which the CSS in globals.css turns into the
  // actual draw-in/draw-out transition.
  useEffect(() => {
    const els = iconRef.current?.querySelectorAll<SVGGeometryElement>('path, circle');
    els?.forEach((el) => {
      el.style.setProperty('--path-length', String(el.getTotalLength()));
    });
  }, []);

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
        'border border-transparent text-fg-tertiary transition duration-fast ease-standard ' +
        'can-hover:hover:bg-tertiary-hover can-hover:hover:text-fg motion-safe:active:scale-press'
      }
    >
      {/* Relative wrapper the same 20px box as both icons — the box never
          resizes between states (Principle 4); only which <svg> is
          visible changes. Color comes from text-fg-tertiary above (same
          gray the nav's own unselected Design/Coffee/Apps links use), not
          a dedicated class — see the comment on .theme-icon-sun in
          globals.css. */}
      <span ref={iconRef} className="relative inline-block h-7 w-7">
        <svg viewBox="0 0 25 25" fill="none" aria-hidden="true" className="theme-icon-sun absolute inset-0 h-7 w-7">
          <circle cx="12.4058" cy="12.7625" r="5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12.4058 1.76251V3.76251" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12.4058 21.7625V23.7625" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4.62598 4.98248L6.04598 6.40248" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M18.7656 19.1225L20.1856 20.5425" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M1.40576 12.7625H3.40576" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M21.4058 12.7625H23.4058" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4.62598 20.5425L6.04598 19.1225" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M18.7656 6.40248L20.1856 4.98248" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <svg viewBox="0 0 25 25" fill="none" aria-hidden="true" className="theme-icon-moon absolute inset-0 h-7 w-7">
          <path
            d="M21.1918 13.2013C21.0345 14.9035 20.3957 16.5257 19.35 17.8781C18.3044 19.2305 16.8953 20.2571 15.2875 20.8379C13.6797 21.4186 11.9398 21.5294 10.2713 21.1574C8.60281 20.7854 7.07479 19.9459 5.86602 18.7371C4.65725 17.5283 3.81774 16.0003 3.4457 14.3318C3.07367 12.6633 3.18451 10.9234 3.76526 9.31561C4.346 7.70783 5.37263 6.29868 6.72501 5.25307C8.07739 4.20746 9.69959 3.56862 11.4018 3.41132C10.4052 4.75958 9.92564 6.42077 10.0503 8.09273C10.175 9.76469 10.8957 11.3364 12.0812 12.5219C13.2667 13.7075 14.8384 14.4281 16.5104 14.5528C18.1823 14.6775 19.8435 14.1979 21.1918 13.2013Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </button>
  );
}
