import type { Metadata } from 'next';
import Link from 'next/link';
import { Action } from '@/components/Action';
import { AppIconTile } from '@/components/AppIcon';
import { PriceBadge } from '@/components/PriceBadge';
import { apps, type App } from '@/content/apps';
import { site } from '@/content/site';

export const metadata: Metadata = { title: 'Apps' };

/**
 * Same card contract as Design and Coffee: the whole card is the link and the
 * name is its accessible label, so there are no competing buttons inside it.
 * Hover raises e1 → e2 with no lift transform.
 */
function AppCard({ app }: { app: App }) {
  return (
    <Link
      href={`/apps/${app.slug}/`}
      data-cursor-label={app.name}
      className={
        'group flex flex-col rounded-lg border border-line-subtle bg-raised p-8 shadow-e1 card-press ' +
        'can-hover:hover:border-line can-hover:hover:shadow-e2'
      }
    >
      <div className="flex items-start gap-6">
        <AppIconTile name={app.icon} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-5">
            <h3 className="text-title text-fg">{app.name}</h3>
            <PriceBadge price={app.price} />
          </div>
          <p className="mt-1 text-caption text-fg-tertiary">{app.platform}</p>
        </div>
      </div>

      <p className="mt-6 text-body text-fg-secondary">{app.description}</p>

      <ul className="mt-6 flex flex-wrap gap-3">
        {app.traits.map((t) => (
          <li key={t} className="rounded-xs bg-sunken px-4 py-2 text-caption text-fg-secondary">
            {t}
          </li>
        ))}
      </ul>
    </Link>
  );
}

export default function AppsPage() {
  return (
    <div className="mx-auto max-w-app px-page">
      <section className="pt-12 pb-9">
        <h1 className="text-h1 text-fg">Apps</h1>
        <p className="mt-6 max-w-content text-body-lg text-fg-secondary">
          Native macOS tools that do their work on your machine. Nothing you record,
          say, or read is sent anywhere.
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
          <div className="grid grid-cols-1 gap-8 medium:grid-cols-2 expanded:grid-cols-3">
            {apps.map((a) => (
              <AppCard key={a.slug} app={a} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
