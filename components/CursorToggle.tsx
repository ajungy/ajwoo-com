'use client';

import { useEffect, useState } from 'react';

/** Fired on `window` whenever the preference changes, `detail` is the new
 *  boolean — CursorGate.tsx (a sibling with no shared parent state to lift
 *  into) listens for this to mount/unmount the actual cursor live. */
export const CURSOR_PREFERENCE_EVENT = 'cursor-preference-change';
const STORAGE_KEY = 'cursor-enabled';

/**
 * The bubble-cursor on/off switch, at Alex's direction ("make a toggle...
 * next to the dark and light mode button... where it'll show you the
 * effects of the bubble cursor... if it's off, then it's the default OS
 * cursor"). Sits right next to ThemeToggle in TopBar.tsx and matches its
 * chrome exactly (same `h/w-control-md` hit area, same `rounded-control` +
 * transparent border + `bg-tertiary-hover` on hover, same
 * `text-fg-tertiary` → hover-to-`text-fg` color) — one more icon button in
 * the same family, not a new visual system.
 *
 * One glyph, not a state swap like the sun/moon icon — a plain circle
 * ("bubble"), filled when the custom cursor is ON, outline-only when it's
 * OFF, since the button's own content already doubles as a preview of
 * what you're turning on: a solid drop when it's active, an empty ring
 * when it's just the plain OS cursor. `aria-pressed` carries the real
 * on/off state for assistive tech; the accessible name states the
 * OUTCOME of pressing it (Principle 6), not the current state.
 *
 * Off by default site-wide (app/layout.tsx's boot script never writes
 * `cursor-enabled` to localStorage on its own, only reads it — so a
 * visitor who never opens this toggle simply never gets the custom
 * cursor). `data-cursor-pref` on `<html>` is updated directly here too
 * (not just localStorage), matching the theme toggle's pattern, so the
 * boot script's synchronous read on the next load agrees with whatever
 * this button last set without waiting on an effect.
 */
export function CursorToggle() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(document.documentElement.getAttribute('data-cursor-pref') === 'on');
  }, []);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    try {
      localStorage.setItem(STORAGE_KEY, String(next));
    } catch {
      // Private-browsing/storage-disabled: the toggle still works for
      // this page view via the event below, it just won't be remembered
      // next visit — same graceful-degradation shape ThemeToggle accepts.
    }
    document.documentElement.setAttribute('data-cursor-pref', next ? 'on' : 'off');
    window.dispatchEvent(new CustomEvent<boolean>(CURSOR_PREFERENCE_EVENT, { detail: next }));
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={enabled ? 'Turn off custom cursor' : 'Turn on custom cursor'}
      title={enabled ? 'Turn off custom cursor' : 'Turn on custom cursor'}
      data-cursor-label="Toggle cursor"
      aria-pressed={enabled}
      className={
        'inline-flex h-control-md w-control-md items-center justify-center rounded-control ' +
        'border border-transparent text-fg-tertiary transition duration-fast ease-standard ' +
        'can-hover:hover:bg-tertiary-hover can-hover:hover:text-fg motion-safe:active:scale-press'
      }
    >
      <svg viewBox="0 0 20 20" aria-hidden="true" className="h-7 w-7">
        <circle
          cx="10"
          cy="10"
          r="6.5"
          fill={enabled ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    </button>
  );
}
