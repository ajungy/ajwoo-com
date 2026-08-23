import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Action } from '@/components/Action';
import { AppIcon } from '@/components/AppIcon';
import { apps, WAITLIST_FORM_URL } from '@/content/apps';

export function generateStaticParams() {
  return apps.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const a = apps.find((x) => x.slug === params.slug);
  return { title: a?.name ?? 'Apps', description: a?.description };
}

export default function AppPage({ params }: { params: { slug: string } }) {
  const app = apps.find((a) => a.slug === params.slug);
  if (!app) notFound();

  const others = apps.filter((a) => a.slug !== app.slug);

  return (
    <div className="mx-auto max-w-app px-page">
      {/* No "← Apps" back link, at Alex's direction — the top bar's own
          wordmark and nav already reach Apps in one click, and the "More
          apps" list at the bottom of this same page already offers the
          other two, so a second back affordance sitting alone above the
          fold wasn't earning its space (same reasoning as the /work pages). */}
      <header className="flex flex-col gap-8 pt-12 pb-12 medium:flex-row medium:items-start">
        {app.iconImage ? (
          <img
            src={`/img/${app.iconImage}-256.webp`}
            alt=""
            width={64}
            height={64}
            className="h-16 w-16 shrink-0 rounded-xl border border-line-subtle object-contain"
          />
        ) : (
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-line-subtle bg-sunken text-fg">
            <AppIcon name={app.icon} className="h-8 w-8" />
          </span>
        )}
        <div className="flex-1">
          <h1 className="text-h1 text-fg">{app.name}</h1>
          <p className="mt-4 max-w-content text-body-lg text-fg-secondary">{app.description}</p>
          <p className="mt-4 text-caption text-fg-tertiary">
            {app.platform} · {app.trigger}
          </p>

          {/* Every app is pre-release right now, so every detail page points
              at the same waitlist form rather than a real purchase flow —
              no price badge, no disabled "not yet available" state to
              maintain, just one honest next step (Principle 9: ≥24px of
              separation, never default-focused, a plain navigation so it
              can't double-fire). */}
          <div className="mt-9">
            <Action href={WAITLIST_FORM_URL} external variant="primary" cursorLabel="Join waitlist">
              Waitlist
            </Action>
          </div>
        </div>
      </header>

      <article className="max-w-content space-y-8 pb-12">
        {app.detail.map((para) => (
          <p key={para} className="text-body-lg text-fg-secondary">{para}</p>
        ))}
        <ul className="flex flex-wrap gap-3 pt-2">
          {app.traits.map((t) => (
            <li key={t} className="rounded-xs bg-sunken px-4 py-2 text-caption text-fg-secondary">
              {t}
            </li>
          ))}
        </ul>
      </article>

      {others.length > 0 && (
        <section className="border-t border-line-subtle pt-12 pb-12">
          <h2 className="text-h3 text-fg">More apps</h2>
          <ul className="mt-8 grid grid-cols-1 gap-8 medium:grid-cols-2">
            {others.map((a) => (
              <li key={a.slug}>
                <Action href={`/apps/${a.slug}/`} variant="secondary" cursorLabel={a.name}>
                  {a.name}
                </Action>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
