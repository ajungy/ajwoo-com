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
 * Colors tuned a second time, at Alex's direction, after the first pass
 * (base stroke = the exact `--action-secondary-border` hex) still read as
 * too dim:
 *   - Dark mode base stroke stays `#3A3A41` (Alex re-confirmed this
 *     value directly — "slightly brighter than what it is now" was about
 *     the render overall, not this particular channel).
 *   - Light mode base stroke moves to `#525252` (mid-gray, darker/more
 *     visible than the `#D2D2D8` border-token match from the first
 *     pass) — Alex's own follow-up code block superseded the earlier
 *     "#D2D2D8" mention with this value once the two were compared side
 *     by side.
 *   - Light mode highlight line is `#000000` and its intensity goes to
 *     1.6 (dark mode stays 1) — a stronger, more legible flash against a
 *     light page than the base 1.0 intensity reads as.
 *   - Stroke thickness goes from 1 to 1.6 for both themes — not a
 *     theme-dependent value, just an across-the-board bump alongside the
 *     color tuning.
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
  const baseColor = theme === 'light' ? '#525252' : '#3A3A41';
  const intensity = theme === 'light' ? 1.6 : 1;

  return (
    <SpecularBorder
      radius={8}
      lineColor={lineColor}
      baseColor={baseColor}
      intensity={intensity}
      shineSize={10}
      shineFade={40}
      thickness={1.6}
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
