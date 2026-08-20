import type { Metadata } from 'next';
import { Action } from '@/components/Action';
import { AppCard } from '@/components/AppCard';
import { apps } from '@/content/apps';
import { site } from '@/content/site';

export const metadata: Metadata = { title: 'Apps' };

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
