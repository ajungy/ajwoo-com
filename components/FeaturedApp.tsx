import Link from 'next/link';
import { Laurel } from './Laurel';
import { AppCard } from './AppCard';
import type { App } from '@/content/apps';

/**
 * One featured app on the landing page, announced between laurels.
 *
 * The laurels are the only ornament on the site, and they are load-bearing
 * rather than decorative: they say "this is the thing being singled out",
 * which is what lets a single card sit alone without reading as an accident.
 * Everything inside is the same Card the /apps grid uses, so the pattern is
 * learned once (Principle 16).
 */
export function FeaturedApp({ app }: { app: App }) {
  return (
    // No bottom padding here — the gap to whatever follows (the Education/
    // Clients/Featured columns on `/`) is that consumer's call, not this
    // component's. See app/page.tsx, which gives it a deliberately large
    // mt-24 (96px) — more than the 48px between "Alex's choice" and the
    // thumbnail above, at Alex's direction.
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

      {/* Deliberately narrower than max-w-content (720px): once the card's
          media went 1:1, a 720px-wide card meant a 720px-TALL square — the
          card ballooned on this full-bleed landing-page placement in a way
          it never did inside the /apps grid's ~380px columns. max-w-[420px]
          keeps it close to a single grid column's width instead. */}
      <div className="mx-auto mt-12 max-w-[420px]">
        <AppCard app={app} />
      </div>

      <p className="mt-8 text-center">
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
