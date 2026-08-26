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
 * A TRUE MORPH, not a fade — Alex's explicit ask, after two rounds that
 * ported jolyui.dev's AnimatedThemeToggle (jolyui.dev/docs/components/
 * inputs/animated-theme-toggle) as closely as possible. Worth being
 * precise about what that reference actually does, since it matters for
 * why this version is a genuinely different design: jolyui's own
 * animation is ALSO a scale+opacity crossfade of two separate icon
 * layers (plus a stroke-draw flourish) — not a line-morph. A hamburger↔X
 * toggle works as a morph because both shapes are 3 lines that map onto
 * each other 1:1; a sun (a ring + 8 separate rays) and a moon (one
 * unbroken crescent outline) have no such correspondence, so nothing
 * that actually ships as "the jolyui component" morphs sun into moon —
 * that effect had to be designed from scratch here.
 *
 * The design: the ring is ONE element in both states — never faded,
 * never swapped — reshaped from a full circle into a crescent by an
 * animated SVG mask (see `.theme-icon-cutout` in globals.css), the same
 * technique already proven out for the earlier Figma pill-toggle knob.
 * The 8 rays retract via `transform: scale + rotate` around a fixed
 * pixel `transform-origin` (deliberately NOT `transform-box: fill-box`
 * — the previous round's actual bug, and a real cross-browser risk on
 * grouping elements specifically). A per-ray transition-delay staggers
 * the retraction so they visibly sweep in one after another rather than
 * vanishing in lockstep — real motion, not a crossfade.
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

  // Ray order sets the stagger direction (see --ray-i on each path below,
  // consumed by the transition-delay formula in globals.css) — top ray
  // first, then clockwise, so the retraction visibly sweeps around the
  // ring rather than firing in an arbitrary order.
  const rays = [
    'M12.4058 1.76251V3.76251',
    'M18.7656 6.40248L20.1856 4.98248',
    'M21.4058 12.7625H23.4058',
    'M18.7656 19.1225L20.1856 20.5425',
    'M12.4058 21.7625V23.7625',
    'M4.62598 20.5425L6.04598 19.1225',
    'M1.40576 12.7625H3.40576',
    'M4.62598 4.98248L6.04598 6.40248',
  ];

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
      <svg viewBox="0 0 25 25" fill="none" aria-hidden="true" className="h-7 w-7">
        <defs>
          {/* The cutout stays put; it's the ring (below) that's masked by
              it. Off-canvas (cx=30) at rest = no overlap = a full circle.
              Sliding to cx=8.5 on data-theme="dark" (globals.css) brings
              it over the ring's own edge, carving the crescent — animated
              via `cx`, not `transform`: a mask's cutout is resolved
              against an element's real geometry before any CSS transform
              on it (confirmed by testing directly, in the pill-toggle
              build two rounds ago), so `cx` is what actually moves the
              cut, continuously, not just at two fixed keyframes. */}
          <mask id="theme-icon-mask">
            <rect x="0" y="0" width="25" height="25" fill="white" />
            <circle className="theme-icon-cutout" cx="30" cy="10" r="5.5" fill="black" />
          </mask>
        </defs>
        {/* One ring, always mounted, never faded — reshaped, not swapped. */}
        <circle
          cx="12.4058"
          cy="12.7625"
          r="5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          mask="url(#theme-icon-mask)"
        />
        {rays.map((d, i) => (
          <path
            key={d}
            className="theme-icon-ray"
            style={{ '--ray-i': i } as React.CSSProperties}
            d={d}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </svg>
    </button>
  );
}
