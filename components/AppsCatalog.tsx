'use client';

import { useState } from 'react';
import { AppCard } from '@/components/AppCard';
import { StaggerReveal } from '@/components/StaggerReveal';
import type { App } from '@/content/apps';

const featuredSlugs = ['convert', 'capture', 'dictate', 'narrate', 'letter', 'request'];
const gridClassName = 'grid grid-cols-1 gap-8 medium:grid-cols-2 expanded:grid-cols-3';

export function AppsCatalog({ apps }: { apps: App[] }) {
  const [expanded, setExpanded] = useState(false);
  const featured = featuredSlugs.flatMap((slug) => apps.filter((app) => app.slug === slug));
  const remaining = apps.filter((app) => !featuredSlugs.includes(app.slug));

  return (
    <>
      <StaggerReveal className={gridClassName} durationMs={400} delayMs={100}>
        {featured.map((app) => <AppCard key={app.slug} app={app} hoverPlay />)}
      </StaggerReveal>
      {remaining.length > 0 && (
        <>
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              aria-expanded={expanded}
              aria-controls="more-apps"
              onClick={() => setExpanded((value) => !value)}
              data-cursor-label={expanded ? 'Less' : 'More'}
              className="inline-flex h-control-md items-center justify-center gap-4 rounded-control border border-secondary-line bg-secondary px-6 text-label font-medium text-secondary-fg transition duration-fast ease-standard can-hover:hover:border-secondary-line-hover can-hover:hover:bg-secondary-hover active:bg-secondary-active motion-safe:active:scale-press"
            >
              {expanded ? 'Less' : 'More'}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-5 w-5">
                <path d={expanded ? 'm6 15 6-6 6 6' : 'm6 9 6 6 6-6'} />
              </svg>
            </button>
          </div>
          <div id="more-apps" hidden={!expanded}>
            {expanded && (
              <div className="mt-10 border-t border-line pt-10">
                <StaggerReveal className={gridClassName} durationMs={400} delayMs={100}>
                  {remaining.map((app) => <AppCard key={app.slug} app={app} hoverPlay />)}
                </StaggerReveal>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
