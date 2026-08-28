'use client';

import { useEffect, useState } from 'react';
import { Action } from './Action';
import { BorderGlow } from './BorderGlow';
import { site } from '@/content/site';

/**
 * "Book 15 min" wrapped in the BorderGlow effect (see BorderGlow.tsx /
 * BorderGlow.module.css for the full reasoning — a React Bits component
 * trimmed to just its edge-light glow ring) — at Alex's direction,
 * replacing the SpecularBorder shine that used to wrap this button.
 *
 * The button itself is the very original plain secondary <Action>,
 * unmodified — no `!border-transparent` override, no second animated
 * border competing with it, just a glow riding outside the button's own
 * existing border.
 *
 * Light mode gets a BLACK glow instead of the warm gold, at Alex's direct
 * follow-up request. This can't be done by just swapping `glowColor`: the
 * ring's default blend mode is `plus-lighter`, which is purely additive —
 * it can only brighten a surface, never darken it, so a black glow under
 * it is invisible against a light page (this is exactly why the original
 * gold reads fine in dark mode but would vanish in light). BorderGlow's
 * `blendMode` prop exists for this: light mode passes `multiply` with a
 * black glowColor so the ring actually reads as a dark line; dark mode
 * keeps the original gold + `plus-lighter` untouched.
 *
 * Theme is read from `data-theme` on mount and kept in sync via a
 * MutationObserver on that attribute (same source of truth ThemeToggle.tsx
 * treats as authoritative, and the same pattern this component used before
 * BorderGlow replaced SpecularBorder) — needed again now that the glow's
 * color/blend mode is theme-dependent.
 */
export function BookTimeAction() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const read = () => {
      setTheme(document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark');
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  const glowColor = theme === 'light' ? '0 0 0' : '40 80 80';
  const blendMode = theme === 'light' ? 'multiply' : 'plus-lighter';

  return (
    <BorderGlow
      edgeSensitivity={40}
      glowColor={glowColor}
      blendMode={blendMode}
      borderRadius={8}
      glowRadius={80}
      glowIntensity={2}
      coneSpread={8}
      animated
    >
      <Action href={site.calendlyUrl} external variant="secondary" cursorLabel="Book time">
        {site.ctaLabel}
      </Action>
    </BorderGlow>
  );
}
