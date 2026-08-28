import { Action } from './Action';
import { BorderGlow } from './BorderGlow';
import { site } from '@/content/site';

/**
 * "Book 15 min" wrapped in the BorderGlow effect (see BorderGlow.tsx /
 * BorderGlow.module.css for the full reasoning — a React Bits component
 * trimmed to just its edge-light glow ring) — at Alex's direction,
 * replacing the SpecularBorder shine that used to wrap this button.
 *
 * The button itself is back to the very original plain secondary
 * <Action>, unmodified — no `!border-transparent` override this time,
 * since there's no second animated border competing with it anymore, just
 * a glow riding outside the button's own existing border.
 *
 * No longer a 'use client' component with theme-reactive color state (the
 * way the SpecularBorder version was) — BorderGlow's glowColor is a fixed
 * value per Alex's supplied prop block, not theme-dependent, so there's
 * nothing here that needs to read `data-theme`.
 */
export function BookTimeAction() {
  return (
    <BorderGlow
      edgeSensitivity={40}
      glowColor="40 80 80"
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
