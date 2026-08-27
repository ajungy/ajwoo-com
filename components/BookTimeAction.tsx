'use client';

import { useEffect, useState } from 'react';
import { Action } from './Action';
import { SpecularBorder } from './SpecularBorder';
import { site } from '@/content/site';

/**
 * "Book 15 min" wrapped in the SpecularBorder shine effect (see
 * SpecularBorder.tsx for the full reasoning) — pulled out of app/page.tsx
 * into its own client component because the shine's colors need to react
 * to the current theme, which a Server Component can't read.
 *
 * Alex's report: the shine (a white line + a gray base stroke, both
 * hardcoded) was effectively invisible in light mode — a white highlight
 * on a white page has nothing to contrast against. Two fixes:
 *   - The highlight line is black in light mode, white in dark — flipped
 *     per theme rather than a single fixed color, so it always reads
 *     against the page behind it.
 *   - The base stroke (the fainter, always-on edge the shine rides on
 *     top of) now uses the SAME hex values as this project's own
 *     `--action-secondary-border` token (`#D2D2D8` light / `#3A3A41`
 *     dark — tokens/tokens.css `--n-300`/`--d-300`) instead of one
 *     hardcoded gray, so at rest — before the shine animates across it —
 *     this button's edge reads the same as Email/LinkedIn/Instagram's
 *     real borders next to it, not a mismatched shade.
 *
 * Theme is read from `data-theme` on mount and kept in sync via a
 * MutationObserver on that attribute (same source of truth
 * ThemeToggle.tsx treats as authoritative), so toggling the theme updates
 * the shine's colors immediately — `useSpecularFx` already re-reads its
 * options every animation frame, so no extra plumbing was needed there.
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

  const lineColor = theme === 'light' ? '#000000' : '#ffffff';
  const baseColor = theme === 'light' ? '#D2D2D8' : '#3A3A41';

  return (
    <SpecularBorder
      radius={8}
      lineColor={lineColor}
      baseColor={baseColor}
      intensity={1}
      shineSize={10}
      shineFade={40}
      thickness={1}
      speed={0.5}
      followMouse
      proximity={250}
      autoAnimate
    >
      {/* !border-transparent — the static gray secondary border is
          redundant now that the shine effect draws its own animated one;
          having both at once read as two competing outlines. Scoped to
          this instance only. */}
      <Action
        href={site.calendlyUrl}
        external
        variant="secondary"
        cursorLabel="Book time"
        className="!border-transparent"
      >
        {site.ctaLabel}
      </Action>
    </SpecularBorder>
  );
}
