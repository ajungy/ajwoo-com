import { Picture } from './Picture';
import type { siteData as SiteData } from '@/content/projects';

type HeroImg = NonNullable<typeof SiteData['hero']>;

/**
 * The landing-page portrait, theme-aware: the light photo in light mode, a
 * separate dark-background shot in dark mode — not a filter or overlay, two
 * real photos, at Alex's direction.
 *
 * Both `<picture>` elements are in the DOM at all times; which one is VISIBLE
 * is decided entirely by CSS (see `.hero-light`/`.hero-dark` in globals.css),
 * following the same OS-default-then-explicit-override pattern the water
 * cursor's tokens already use:
 *   - `@media (prefers-color-scheme: dark)` picks the dark photo when the OS
 *     is dark and the user hasn't overridden the toggle.
 *   - `:root[data-theme="dark"]` / `[data-theme="light"]` picks it (or not)
 *     once the user HAS used the toggle, regardless of the OS.
 * Doing this in CSS rather than JS means no client-side check-then-swap after
 * hydration — the correct photo is already the one that gets requested and
 * painted, no flash of the wrong one.
 *
 * The two images stack in the same grid cell (`grid` + shared area) so
 * swapping which is visible never changes the section's height — no layout
 * shift, matching Principle 4.
 *
 * The `col-start-1 row-start-1` placement has to live on a WRAPPER div
 * around each `<Picture>`, not on `<Picture>`'s own `className` prop —
 * that prop lands on the inner `<img>` (see Picture.tsx), not the
 * `<picture>` element that's actually this grid's direct child. Passing it
 * to Picture directly left both `<picture>` elements with no explicit grid
 * position, so ordinary grid auto-flow stacked them into two separate rows
 * instead of one shared cell — invisible while the hidden photo was
 * `display: none` (which removes a box from grid sizing entirely), but as
 * soon as visibility swapped to `visibility: hidden` for the crossfade
 * (still present for sizing purposes), the section rendered roughly DOUBLE
 * its real height, and that height differed by theme depending on which
 * photo happened to be visible.
 */
export function HeroPhoto({ light, dark }: { light: HeroImg; dark: HeroImg | null }) {
  if (!dark) {
    // No dark photo supplied — just the one image, in every theme.
    return (
      <Picture img={light} alt="Alex Woo" priority sizes="100vw" className="block h-auto w-full" />
    );
  }
  return (
    <div className="grid">
      <div className="hero-light col-start-1 row-start-1">
        <Picture img={light} alt="Alex Woo" priority sizes="100vw" className="block h-auto w-full" />
      </div>
      <div className="hero-dark col-start-1 row-start-1">
        <Picture img={dark} alt="Alex Woo" priority sizes="100vw" className="block h-auto w-full" />
      </div>
    </div>
  );
}
