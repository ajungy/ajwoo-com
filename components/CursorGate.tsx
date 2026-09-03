'use client';

import { useEffect, useState } from 'react';
import { Cursor } from './Cursor';
import { CURSOR_PREFERENCE_EVENT } from './CursorToggle';

/**
 * Mounts/unmounts the actual bubble cursor (Cursor.tsx, unchanged by this)
 * based on the on/off preference CursorToggle.tsx controls — off by
 * default, at Alex's direction ("by default on this website, can you turn
 * off this bubble cursor").
 *
 * Mount/unmount, not a prop toggling something inside Cursor itself:
 * Cursor.tsx's own effect attaches every pointer/click listener once on
 * mount and cleans them all up (including removing `data-cursor` from
 * `<html>`) on unmount — reusing that existing cleanup by conditionally
 * rendering the component at all is simpler and more robust than trying
 * to thread a live on/off flag through that effect's own logic.
 *
 * Initial state comes from `data-cursor-pref`, set synchronously by the
 * boot script in app/layout.tsx before first paint (same pattern as the
 * theme attribute) — so there's no frame where this guesses "off" and
 * then corrects to "on" for a returning visitor who turned it on, which
 * would flash the real cursor swapped out from under them.
 *
 * CursorToggle.tsx and this component are siblings (the button lives in
 * TopBar.tsx, this lives in the root layout) with no shared parent state
 * to lift into, so they talk via a plain `window` CustomEvent
 * (CURSOR_PREFERENCE_EVENT) rather than prop-drilling through a Server
 * Component layout — the same shape localStorage + an event already have
 * to take for cross-component client state with no obvious lifting point.
 */
export function CursorGate() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(document.documentElement.getAttribute('data-cursor-pref') === 'on');
    const onChange = (e: Event) => setEnabled((e as CustomEvent<boolean>).detail);
    window.addEventListener(CURSOR_PREFERENCE_EVENT, onChange);
    return () => window.removeEventListener(CURSOR_PREFERENCE_EVENT, onChange);
  }, []);

  return enabled ? <Cursor /> : null;
}
