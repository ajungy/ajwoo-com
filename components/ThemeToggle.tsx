'use client';

import { useEffect, useRef, useState } from 'react';

import { SolarSwitch } from './ui/animated-theme-toggle';

/** Keep the existing saved theme and page fade; the icon follows the applied theme. */
const FADE_MS = 500;

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark' | null>(null);
  const fadeTimer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(fadeTimer.current), []);
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
    clearTimeout(fadeTimer.current);
    if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
      document.documentElement.setAttribute('data-theme-transition', 'true');
      // Install the shared transition before changing any theme colors.
      void document.documentElement.offsetWidth;
      fadeTimer.current = setTimeout(() => document.documentElement.removeAttribute('data-theme-transition'), FADE_MS + 34);
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
      <SolarSwitch />
    </button>
  );
}
