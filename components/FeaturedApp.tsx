'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Laurel } from './Laurel';
import { AppCard } from './AppCard';
import { DepthCarousel } from './DepthCarousel';
import type { App } from '@/content/apps';

/**
 * The featured-apps row on the landing page, announced between laurels —
 * now a stacked depth carousel over all four apps (Convert, Capture Beta,
 * Dictate Beta, Narrate Beta), at Alex's direction, replacing the single
 * static Capture card this used to show. See components/DepthCarousel.tsx
 * for the carousel mechanics themselves; this file wires it to real
 * AppCard content and to which card's demo video autoplays.
 *
 * The laurels are the only ornament on the site, and they are load-bearing
 * rather than decorative: they say "these are the things being singled
 * out", which is what lets a small set of cards sit alone without reading
 * as an accident. Everything inside is the same Card the /apps grid uses,
 * so the pattern is learned once (Principle 16).
 *
 * "Video should autoplay [when] the card is on top of the stack": handled
 * via AppCard's `playing` prop (new — see that file) rather than its
 * existing `hoverPlay`, since this needs to react to the carousel's own
 * active index, not the pointer. `onActiveChange` from DepthCarousel keeps
 * local state in sync with whichever card is currently centered/on top.
 */
// DESKTOP_CARD_WIDTH is Alex's own spec ("style=\"width: 400px; ...\"") — the
// ceiling this never exceeds. Below that, the card's BASE width tracks the
// viewport directly (viewport minus ~40px of breathing room, floored at
// 280px) rather than staying pinned at 400 and leaning on DepthCarousel's
// post-hoc CSS `scale()` alone to shrink it — a second round asked for the
// carousel to render "closer to scale 1 even on mobile and smaller
// screens", and a fixed 400px base can only ever get partway there by
// scaling down: on a 375px phone, DepthCarousel's own scale-to-fit still
// caps out around 0.84 (335px rendered) since 400px never fits regardless
// of how tight the scale gets. Sizing the BASE itself to the viewport
// means DepthCarousel's internal scale lands at (or near) 1 on every
// width up to 440px-ish, with its existing scale-to-fit logic still
// acting as a safety net for anything narrower or for browser-chrome
// edge cases, not as the primary size lever any more.
const DESKTOP_CARD_WIDTH = 400;
const MIN_CARD_WIDTH = 280;
const VIEWPORT_MARGIN = 40;

function useResponsiveCardWidth() {
  const [width, setWidth] = useState(DESKTOP_CARD_WIDTH);
  useEffect(() => {
    const compute = () => {
      const fit = window.innerWidth - VIEWPORT_MARGIN;
      setWidth(Math.min(DESKTOP_CARD_WIDTH, Math.max(MIN_CARD_WIDTH, fit)));
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, []);
  return width;
}

export function FeaturedApp({ apps }: { apps: App[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const cardWidth = useResponsiveCardWidth();
  // AppCard's real aspect (square media + fixed footer) is ~1.2x its width
  // at this size — see DepthCarousel.tsx's "cardHeight IS MEASURED"
  // comment; this is only the first-paint estimate, corrected once the
  // real card mounts.
  const cardHeightEstimate = Math.round(cardWidth * 1.2);

  // No bottom padding on the section below — the gap to whatever follows
  // (the Experience/Education/Featured/Worked-with sections on `/`) is
  // that consumer's call, not this component's.
  return (
    <section>
      <div className="flex flex-col items-center">
        {/* Single row — leaves, text, leaves — matching Alex's Figma reference
            (node 300:253) as closely as the system's tokens allow: gap-2
            (8px) mirrors the source's gap-[8px], text-title/bold
            approximates its 18px Plus Jakarta Sans Bold (17px is the
            system's nearest token), and the leaves are set to their native
            38.6276px height (this reference's leaves are shorter and
            proportionally fuller than the previous one) rather than rounded
            to a token, since Figma's own size is itself the spec here.
            FLIP SIDES, not orientation: in the source, the LEFT copy is the
            one built from `scaleY(-1) rotate(180deg)` (Group 2) and the
            RIGHT copy is the plain, untransformed artwork (Group 4) — i.e.
            the rounded ends point outward on both sides, away from the
            text. `flip` sits on the left one to match. */}
        <div className="flex items-center gap-2 text-fg">
          <Laurel flip className="h-[38.6276px] w-auto" />
          <p className="text-title font-bold text-fg whitespace-nowrap">Alex's choice</p>
          <Laurel className="h-[38.6276px] w-auto" />
        </div>
      </div>

      {/* cardWidth/cardHeightEstimate come from useResponsiveCardWidth
          above, not a fixed 400/480 any more — see that hook's own comment
          for why. perspective=3000 is Alex's own spec ("style=\"width:
          400px; height: 437px; perspective: 3000px;\""). cardHeightEstimate
          (not a literal 437): 437 was tuned to a 357px-wide card (355px
          square media + ~82px footer) from an earlier round; AppCard's
          real height is always ~1.2x whatever width it's actually given,
          and DepthCarousel MEASURES the card's real rendered height itself
          and uses that over whatever's passed — see its own comment for
          why — so this is only the first-paint estimate (close enough
          that there's no visible resize once the real number lands).
          spread=56 (was 90): a second round asked to "reduce the width of
          the carousel" — a tighter fan between cards, at every scale.
          hoverZoom={false} hoverShadow={false} on each AppCard: the
          carousel's own wrapper now owns the hover zoom + shadow treatment
          directly (see DepthCarousel.tsx's "CARD CHROME, reversed again"),
          so AppCard's native versions of both are switched off here to
          avoid two competing/stacking effects on the same card.
          px-2 (was px-4): DepthCarousel's own responsive scaling does the
          real work now; this padding only keeps the stack off the very
          edge of the viewport on the smallest phones, and the page's own
          `px-page` (the ancestor `mx-auto max-w-app px-page` in page.tsx)
          already adds edge padding on top of it — trimmed to reclaim a
          little more width for the scale-toward-1 fix on mobile rather
          than stacking two paddings. */}
      <div className="mt-12 px-2">
        <DepthCarousel
          items={apps.map((app) => (
            <AppCard
              key={app.slug}
              app={app}
              playing={apps[activeIndex]?.slug === app.slug}
              hoverZoom={false}
              hoverShadow={false}
            />
          ))}
          depth={220}
          spread={56}
          tilt={22}
          tiltDirection="right"
          perspective={3000}
          visibleCards={4}
          falloff={0.2}
          blur={6}
          autoplay={false}
          loop
          cardWidth={cardWidth}
          cardHeight={cardHeightEstimate}
          radius={20}
          duration={700}
          autoplayDelay={3200}
          showControls
          showIndicators
          onActiveChange={setActiveIndex}
        />
      </div>

      <p className="mt-16 text-center">
        <Link
          href="/apps/"
          data-cursor-label="All apps"
          className="text-label font-semibold text-fg-secondary transition-colors duration-fast ease-standard can-hover:hover:text-fg"
        >
          All apps →
        </Link>
      </p>
    </section>
  );
}
