import type { Metadata } from 'next';
import { Action } from '@/components/Action';
import { apps, type Price } from '@/content/apps';
import { resolveCheckout } from '@/lib/checkout';
import { site } from '@/content/site';

export const metadata: Metadata = { title: 'Apps' };

/**
 * Cost is never disclosed behind an interaction — it renders on the card, at
 * rest, always (reference/disclosure.md). Where no price has been set yet the
 * card says so rather than implying "free".
 */
function PriceBadge({ price }: { price: Price }) {
  const label =
    price.kind === 'free' ? 'Free' : price.kind === 'paid' ? price.label : 'Pricing TBD';
  return (
    <span className="shrink-0 rounded-xs bg-neutral-bg px-4 py-1 text-caption font-medium text-neutral">
      {label}
    </span>
  );
}

function AppCard({ app }: { app: (typeof apps)[number] }) {
  const checkout = app.price.kind === 'paid' ? resolveCheckout(app.price.checkoutId) : null;
  const buyable = app.price.kind === 'paid' && !!checkout;
  return (
    <article className="flex flex-col rounded-lg border border-line-subtle bg-raised p-8 shadow-e1">
      <div className="flex items-start justify-between gap-6">
        <h3 className="text-h3 text-fg">{app.name}</h3>
        <PriceBadge price={app.price} />
      </div>

      <p className="mt-5 text-body text-fg-secondary">{app.description}</p>

      <p className="mt-6 text-caption text-fg-tertiary">{app.trigger}</p>

      {/* The two claims that decide it: native, and on-device. Neutral tokens —
          these are properties, not a success state, so they are never green. */}
      <ul className="mt-6 flex flex-wrap gap-3">
        {app.traits.map((t) => (
          <li key={t} className="rounded-xs bg-sunken px-4 py-2 text-caption text-fg-secondary">
            {t}
          </li>
        ))}
      </ul>

      {/* Purchase is guarded (Principle 9): ≥24px from its neighbours, never
          default-focused, and a plain navigation so it cannot double-fire. */}
      <div className="mt-9">
        {app.price.kind === 'free' ? (
          <Action href={app.action.href} external variant="secondary" cursorLabel="Download">
            {app.action.label}
          </Action>
        ) : buyable ? (
          <Action href={checkout!} external variant="secondary" cursorLabel="Buy now">
            {app.action.label}
          </Action>
        ) : (
          <p className="text-caption text-fg-tertiary">
            Not yet available to download.
          </p>
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
