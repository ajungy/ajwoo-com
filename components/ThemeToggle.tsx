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
 * THE SWITCH — ported from the Figma reference (node 395:299, "Dark and
 * light mode toggle"), at Alex's explicit direction to use "the exact
 * component." A 44x26 pill with a 22px white knob that slides from left
 * (dark) to right (light). Figma's own layer for the knob is named
 * "Subtract" and ships as 3 flattened keyframe SVGs (dark/mid/light) — the
 * knob is a boolean subtraction between two circles, thinning from a deep
 * crescent (dark) through a shallow one (mid-drag) to a plain full circle
 * (light). Reproduced here as a live SVG mask (`.switch-knob`/
 * `.switch-cutout` in globals.css) rather than swapped artwork: the cutout
 * circle stays fixed at the knob's dark/left position while the knob slides
 * across it via `transform`, so the crescent thins continuously over the
 * whole 500ms trip — not just at the two endpoints — landing on a full
 * circle exactly where Figma's "light" keyframe has one. Every color
 * (the icy-blue glow, the warm-orange one, the ambient shadow, the track's
 * own gray) was read directly off the reference SVGs' filter primitives,
 * not eyeballed — see the token comments in globals.css.
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
    // reports light), which left this control's position and "Switch to
    // ___ mode" label backwards from the page's actual appearance until the
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
      role="switch"
      aria-checked={theme === 'light'}
      // Icon-only, so it carries a real accessible name that states the
      // OUTCOME, not the current state (Principle 6) — role="switch" above
      // separately exposes the actual on/off state to assistive tech.
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
      data-cursor-label="Switch theme"
      // p-1 pads the hit area slightly past the 44x26 visual track (the
      // exact Figma size) without changing how it looks — a bare 26px-tall
      // target is under this project's usual control heights.
      className="inline-flex shrink-0 items-center rounded-full p-1 motion-safe:active:scale-press"
    >
      <span className="switch-track">
        <svg className="switch-knob-svg" viewBox="0 0 44 26" aria-hidden="true">
          <defs>
            <mask id="theme-switch-mask">
              <rect x="0" y="0" width="44" height="26" fill="white" />
              {/* Fixed at the knob's own dark/left rest position, offset
                  up-left — never animated. The knob (below) is what moves;
                  the shrinking overlap between a moving circle and this
                  still one is what thins the crescent as it travels. */}
              <circle cx="8" cy="11" r="11" fill="black" />
            </mask>
          </defs>
          {/* The knob slides by animating its `cx` (see .switch-knob in
              globals.css), not `transform` — a mask's cutout is resolved
              against an element's geometry BEFORE that element's (or any
              ancestor's) CSS transform is applied, confirmed by testing
              both ways directly in the browser, so a merely-transformed
              circle left the mask seeing the exact same (untransformed)
              overlap forever. `cx` is real geometry, so the mask sees the
              actual new position and the crescent genuinely thins as it
              travels.

              `filter`, on the other hand, DOES need to be one level up, on
              this <g> — an element's own `mask` resolves AFTER its own
              `filter` (filter samples the pre-mask shape), but resolves
              BEFORE a filter set on an ancestor (the ancestor's filter
              samples the child's already-masked output). Filter directly
              on the circle was drawing the glow from the full pre-mask
              circle, which the fixed cutout then clipped a chunk out of
              even once the circle had genuinely moved clear. Split across
              two elements like this, both are true at once: the mask sees
              the real position, and the glow traces the real
              (already-masked) result. */}
          <g className="switch-knob-fx">
            <circle className="switch-knob" cx="13" cy="13" r="11" mask="url(#theme-switch-mask)" />
          </g>
        </svg>
      </span>
    </button>
  );
}
