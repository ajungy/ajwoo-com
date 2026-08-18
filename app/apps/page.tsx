import type { Metadata } from 'next';
import { Action } from '@/components/Action';
import { apps, appGroups } from '@/content/apps';
import { resolveCheckout } from '@/lib/checkout';
import { site } from '@/content/site';

export const metadata: Metadata = { title: 'Apps' };

/**
 * Cost is never disclosed behind an interaction — the price renders on the card,
 * at rest, always (reference/disclosure.md: "never disclosed, at any density").
 */
function PriceBadge({ price }: { price: (typeof apps)[number]['price'] }) {
  const label = price.kind === 'free' ? 'Free' : price.label;
  return (
    <span className="inline-flex h-6 items-center rounded-xs border border-neutral-line bg-neutral-bg px-4 text-caption font-medium text-neutral">
      {label}
    </span>
  );
}

function AppCard({ app }: { app: (typeof apps)[number] }) {
  const checkout = app.price.kind === 'paid' ? resolveCheckout(app.price.checkoutId) : null;
  const unconfigured = app.price.kind === 'paid' && !checkout;
  return (
    <article className="flex flex-col rounded-lg border border-line-subtle bg-raised p-7 shadow-e1">
      <div className="flex items-start justify-between gap-6">
        <h3 className="text-title text-fg">{app.name}</h3>
        <PriceBadge price={app.price} />
      </div>
      <p className="mt-4 text-body text-fg-secondary">{app.description}</p>
      <p className="mt-4 text-caption text-fg-tertiary">{app.platform}</p>
      {/* Purchase is guarded (Principle 9): ≥24px from its neighbours, never
          default-focused, and it cannot double-fire because it is a plain
          navigation to a hosted checkout. */}
      <div className="mt-8 pt-2">
        {app.price.kind === 'free' ? (
          <Action href={app.action.href} external variant="secondary" cursorLabel={app.action.label}>
            {app.action.label}
          </Action>
        ) : unconfigured ? (
          <p className="text-caption text-fg-tertiary">
            Checkout provider not configured — see <code>.env.example</code>.
          </p>
        ) : (
          <Action href={checkout!} external variant="secondary" cursorLabel={app.action.label}>
            {app.action.label}
          </Action>
        )}
      </div>
    </article>
  );
}

export default function AppsPage() {
  return (
    <div className="mx-auto max-w-app px-page">
      <section className="pt-12 pb-9">
        <h1 className="text-h1 text-fg">Apps</h1>
        <p className="mt-6 max-w-content text-body-lg text-fg-secondary">
          Small tools I&apos;ve built and shipped.
        </p>
      </section>

      {apps.length === 0 ? (
        /* Empty state: name what is missing, offer the action that fills it.
           An empty state without an action is a dead end (Principle 7). */
        <section className="pb-12">
          {/* components.md: centred in the content area, max-width 360, title,
              ONE line of body, one primary action. Never centre more than two
              lines of text (SKILL.md §2). */}
          <div className="mx-auto w-full max-w-app-empty rounded-lg border border-line-subtle bg-raised p-9 text-center shadow-e1">
            <h2 className="text-title text-fg">No apps published yet</h2>
            <p className="mt-4 text-body text-fg-secondary">
              Tools I ship will appear here, with the price shown up front.
            </p>
            <div className="mt-8">
              <Action href={site.calendlyUrl} external variant="primary" cursorLabel={site.ctaLabel}>
                {site.ctaLabel}
              </Action>
            </div>
          </div>
        </section>
      ) : (
        <div className="space-y-12 pb-12">
          {appGroups.map((g) => {
            const inGroup = apps.filter((a) => a.group === g.id);
            if (inGroup.length === 0) return null;
            return (
              <section key={g.id}>
                <h2 className="text-h3 text-fg">{g.title}</h2>
                <p className="mt-2 text-caption text-fg-secondary">{g.blurb}</p>
                <div className="mt-8 grid grid-cols-1 gap-8 medium:grid-cols-2 expanded:grid-cols-3">
                  {inGroup.slice(0, 7).map((a) => (
                    <AppCard key={a.slug} app={a} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
