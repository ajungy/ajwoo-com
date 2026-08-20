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
    <section className="pb-12">
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-6 text-fg-tertiary">
          <Laurel className="h-14 w-auto" />
          <div className="text-center">
            <p className="text-micro uppercase text-fg-tertiary">Featured</p>
            <h2 className="mt-2 text-h1 text-fg">{app.name}</h2>
          </div>
          <Laurel flip className="h-14 w-auto" />
        </div>
        <p className="mt-6 max-w-content text-center text-body-lg text-fg-secondary">
          {app.description}
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-content">
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
