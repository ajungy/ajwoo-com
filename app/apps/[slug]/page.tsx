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
        {/* h-24/w-24 (96px), up from 64px — bigger at Alex's direction, now
            that this is the ONLY visual identity in the header (the
            platform/trigger caption line that used to sit here is gone). */}
        {app.iconImage ? (
          <img
            src={`/img/${app.iconImage}-256.webp`}
            alt=""
            width={96}
            height={96}
            className="h-24 w-24 shrink-0 rounded-xl border border-line-subtle object-contain"
          />
        ) : (
          <span className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl border border-line-subtle bg-sunken text-fg">
            <AppIcon name={app.icon} className="h-12 w-12" />
          </span>
        )}
        {/* Title/description/Waitlist compressed to fit inside the icon's
            own 96px height, at Alex's direction — text-h2 instead of
            text-h1 (30px line-height instead of 38px) and tight mt-2 gaps
            throughout, rather than the looser mt-4/mt-6 this used to use. */}
        <div className="flex-1">
          <h1 className="text-h2 text-fg">{app.name}</h1>
          <p className="mt-2 max-w-content text-body-lg text-fg-secondary">{app.description}</p>

          {/* The platform/trigger caption line that used to sit here is
              gone, at Alex's direction — the smallest, least load-bearing
              text on the page, replaced by the one thing worth doing this
              high up: the actual next step. Every app is pre-release right
              now, so every detail page points at the same waitlist form
              rather than a real purchase flow. Secondary, not primary — at
              Alex's direction, since "Waitlist" is an interim state, not
              the confident, one-primary-per-view action a real download
              would be (Principle 9: real separation, never default-focused,
              a plain navigation so it can't double-fire). */}
          <div className="mt-2">
            <Action href={WAITLIST_FORM_URL} external variant="secondary" cursorLabel="Join waitlist">
              Waitlist
            </Action>
          </div>
        </div>
      </header>

      <article className="max-w-content space-y-8 pb-12">
        {app.detail.map((para, i) => {
          if (typeof para === 'string') {
            return <p key={i} className="text-body-lg text-fg-secondary">{para}</p>;
          }
          if ('lead' in para) {
            // The opening statement — bolded and set apart from the plain
            // paragraphs that follow, at Alex's direction. Same size/family
            // as everything else, only the weight changes.
            return <p key={i} className="text-body-lg font-semibold text-fg">{para.lead}</p>;
          }
          // Feature-list entry: label on its OWN line, bolded, body directly
          // below it on the next line — not inline in one paragraph, at
          // Alex's direction. `pt-4` on top of the container's own
          // `space-y-8` gives each entry a bit more air above it than a
          // plain paragraph-to-paragraph gap, so the list reads as a run of
          // small sections rather than one continuous block.
          return (
            <div key={i} className="pt-4">
              <p className="text-body-lg font-semibold text-fg">{para.label}</p>
              <p className="mt-1 text-body-lg text-fg-secondary">{para.body}</p>
            </div>
          );
        })}
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
