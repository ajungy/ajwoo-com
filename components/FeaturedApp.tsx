'use client';

import { useState } from 'react';
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
export function FeaturedApp({ apps }: { apps: App[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

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

      {/* cardWidth={400}/perspective={3000} are Alex's own spec
          ("style=\"width: 400px; height: 437px; perspective: 3000px;\"").
          cardHeight={480} (not the pasted 437): 437 was tuned to a
          357px-wide card (355px square media + ~82px footer) from an
          earlier round; DepthCarousel MEASURES the card's real rendered
          height itself and uses that over whatever's passed — see its own
          comment for why — so this is only the first-paint estimate.
          A THIRD round tried making cardWidth itself track the viewport
          (a separate `window.innerWidth`-based estimate in this file) —
          reverted: DepthCarousel's own `scale = available/cardWidth`
          ALREADY renders the card at exactly `available` width whenever
          available < cardWidth (down to a small MIN_SCALE floor for
          extreme cases), using a REAL ResizeObserver measurement of the
          actual DOM box. A second, separate, window.innerWidth-based guess
          in this file couldn't be MORE accurate than that — at best it
          matched, at worst it drifted from the true available width
          (margins, scrollbars) and was itself a plausible source of the
          "shifted right" reports. One real measurement, not two
          disagreeing estimates.
          depth/spread/tilt/falloff/blur/perspective now use
          DepthCarousel's own retuned defaults (see that file's
          "SIDE-CARD VISIBILITY" comment) rather than being overridden
          here — a fifth round asked for the neighboring cards to be
          "slightly visible on the left and right sides" (the earlier
          spread=56, tuned purely to shrink the carousel's footprint, hid
          them almost entirely behind the front card) and for perspective
          raised to 10000 specifically.
          hoverZoom={false} hoverShadow={false} on each AppCard: the
          carousel's own wrapper now owns the hover zoom + shadow treatment
          directly (see DepthCarousel.tsx's "CARD CHROME, reversed again"),
          so AppCard's native versions of both are switched off here to
          avoid two competing/stacking effects on the same card.
          No horizontal padding (was px-4, then px-2): a fourth round asked
          to remove it entirely ("padding-left and padding-right to 0px...
          remove as much margins as possible... so that the card scale can
          be bigger and as closer to 100%") — the page's own `px-page` (the
          ancestor `mx-auto max-w-app px-page` in page.tsx) is the only
          edge margin now; every pixel of it goes to DepthCarousel's own
          ResizeObserver-measured `available` width, maximizing scale. */}
      <div className="mt-12">
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
          tiltDirection="right"
          perspective={10000}
          visibleCards={4}
          autoplay
          loop
          cardWidth={400}
          cardHeight={480}
          radius={20}
          duration={700}
          autoplayDelay={5000}
          showControls
          showIndicators
          onActiveChange={setActiveIndex}
        />
      </div>

      {/* mt-6 (was mt-16 — Tailwind's own default 64px, since 16 isn't in
          this project's custom 0-15 spacing scale and silently fell back
          to Tailwind's stock value): far too much air between this link
          and the chevron/dot controls row directly above it, at Alex's
          direction ("the all apps arrow button [should be] closer to the
          navigation row with the left and right chevrons... much
          closer"). */}
      <p className="mt-6 text-center">
        <Link
          href="/apps/"
          data-cursor-label="All apps"
          className={
            'inline-flex items-center rounded-control px-2 -mx-2 py-1.5 -my-1.5 text-label ' +
            'font-semibold text-fg-secondary transition duration-fast ease-standard ' +
            'can-hover:hover:bg-tertiary-hover can-hover:hover:text-fg'
          }
        >
          All apps →
        </Link>
      </p>
    </section>
  );
}
