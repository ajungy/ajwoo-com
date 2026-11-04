'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Laurel } from './Laurel';
import { AppCard } from './AppCard';
import { DepthCarousel } from './DepthCarousel';
import type { App } from '@/content/apps';

/** Independent products, presented after the homepage design principles. */
export function FeaturedApp({ apps }: { apps: App[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  // No bottom padding on the section below — the gap to whatever follows
  // (the Experience/Education/Featured/Worked-with sections on `/`) is
  // that consumer's call, not this component's.
  return (
    <section className="mt-[245px]" aria-labelledby="independent-apps">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 text-fg">
          <Laurel flip className="h-[38.6276px] w-auto" />
          <h2 id="independent-apps" className="text-h3">Personal Apps</h2>
          <Laurel className="h-[38.6276px] w-auto" />
        </div>
        <p className="mt-4 text-body text-fg-secondary">Small tools I design and build to make everyday tasks easier.</p>
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
      <div className="mt-6">
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
          autoplay={false}
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
