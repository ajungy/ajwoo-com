import { pageMetadata } from '@/lib/metadata';
import { Action } from '@/components/Action';
import { AppsCatalog } from '@/components/AppsCatalog';
import { apps } from '@/content/apps';
import { site } from '@/content/site';

export const metadata = pageMetadata('/apps/', 'Apps');

export default function AppsPage() {
  return (
    <div className="apps-entrance mx-auto max-w-app px-page">
      <section className="route-intro py-12">
        <h1 className="type-project-title"><span className="sr-only">Apps. </span>Useful. Personal. Minimal.</h1>
        <p className="mt-4 max-w-content type-subtitle">
          Thoughtful tools for everyday things, from creating and converting
          to sending someone a beautiful letter. Explore each app to see how
          it works and where your data stays.
        </p>
      </section>

      {apps.length === 0 ? (
        <section className="pb-12">
          <div className="mx-auto w-full max-w-app-empty rounded-lg border border-line-subtle bg-raised p-9 text-center shadow-e1">
            <h2 className="type-section-heading">No apps published yet</h2>
            <p className="mt-4 type-body">
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
          <AppsCatalog apps={apps} />
        </section>
      )}
    </div>
  );
}
