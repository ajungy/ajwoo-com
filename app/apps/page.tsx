import type { Metadata } from 'next';
import { Action } from '@/components/Action';
import { AppCard } from '@/components/AppCard';
import { StaggerReveal } from '@/components/StaggerReveal';
import { apps } from '@/content/apps';
import { site } from '@/content/site';

export const metadata: Metadata = { title: 'Apps' };

export default function AppsPage() {
  return (
    <div className="mx-auto max-w-app px-page">
      {/* h1 is sr-only, matching /design and /coffee: the nav already marks
          "Apps" as current. The subtitle stays visible here, unlike the
          other two: it's not restating the page's name, it's the one claim
          that actually earns a visitor's trust before they install anything,
          local-only, on-device, no cloud round-trip. */}
      <h1 className="sr-only">Apps</h1>
      {/* pt-12 header-to-title is the same visual weight the other pages'
          old header-to-title gap had, but pb-16 (paragraph-to-cards) is
          deliberately bigger than that — the header is the same color as
          the page here, so it doesn't read as a boundary the way the cards'
          edge does; the gap that actually needs to feel generous is the one
          before real content starts. */}
      <section className="pt-12 pb-16">
        <p className="text-title font-bold text-fg">Local. Functional. Minimal.</p>
        <p className="mt-4 max-w-content text-body-lg text-fg-secondary">
          Every app runs entirely on your Mac, with no cloud connection. Nothing
          you record, say, or read ever leaves your machine, so there is nothing
          to intercept. That constraint is what keeps them fast and fully capable.
        </p>
      </section>

      {apps.length === 0 ? (
        <section className="pb-12">
          <div className="mx-auto w-full max-w-app-empty rounded-lg border border-line-subtle bg-raised p-9 text-center shadow-e1">
            <h2 className="text-title text-fg">No apps published yet</h2>
            <p className="mt-4 text-body text-fg-secondary">
              Tools I ship will appear here, with the price shown up front.
            </p>
            <div className="mt-8">
              <Action href={site.calendlyUrl} external variant="primary" cursorLabel="Book time">
                {site.ctaLabel}
              </Action>
            </div>
          </div>
        </section>
      ) : (
        <section className="pb-12">
          {/* Back to 3 columns at Alex's direction — a brief 2-column pass
              made cards bigger but 3 across matches the Design/Coffee grids'
              own density, which won out. */}
          <StaggerReveal className="grid grid-cols-1 gap-8 medium:grid-cols-2 expanded:grid-cols-3">
            {apps.map((a) => (
              <AppCard key={a.slug} app={a} />
            ))}
          </StaggerReveal>
        </section>
      )}
    </div>
  );
}
