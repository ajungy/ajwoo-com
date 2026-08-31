import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Action } from '@/components/Action';
import { AppCard } from '@/components/AppCard';
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

  // Capped at 3, at Alex's direction — full cards (not the old plain-link
  // list) take real space, and three is the /apps grid's own row width
  // (expanded:grid-cols-3), so this reads as "the rest of that same grid"
  // rather than an open-ended list.
  const others = apps.filter((a) => a.slug !== app.slug).slice(0, 3);

  return (
    <div className="mx-auto max-w-app px-page">
      {/* No "← Apps" back link, at Alex's direction — the top bar's own
          wordmark and nav already reach Apps in one click, and the "More
          apps" list at the bottom of this same page already offers the
          other two, so a second back affordance sitting alone above the
          fold wasn't earning its space (same reasoning as the /work pages). */}
      <header className="flex flex-col gap-8 pt-12 pb-12 medium:flex-row medium:items-start">
        {/* h-28/w-28 (112px), up from 96px — bigger again at Alex's
            direction ("make the logo a little bit larger"). */}
        {app.iconImage ? (
          <img
            src={`/img/${app.iconImage}-256.webp`}
            alt=""
            width={112}
            height={112}
            className="h-28 w-28 shrink-0 rounded-xl border border-line-subtle object-contain"
          />
        ) : (
          <span className="flex h-28 w-28 shrink-0 items-center justify-center rounded-xl border border-line-subtle bg-sunken text-fg">
            <AppIcon name={app.icon} className="h-14 w-14" />
          </span>
        )}
        {/* Title/description/Waitlist compressed to fit inside the icon's
            own height, at Alex's direction — text-h2 instead of text-h1
            (30px line-height instead of 38px), and tighter still (mt-1 on
            the description, was mt-2) since Alex separately asked for
            "the top of the title and the... bottom of the button to
            align and fit the size of the app logo": `medium:items-start`
            already lines the title's top up with the icon's top, so
            closing this column's own internal gaps is what brings the
            button's bottom closer to the icon's bottom too — a beta app
            appends " Beta" here, matching the same suffix its /apps grid
            card already shows next to its name, at Alex's direction ("if
            the card has the beta... tag next to the title, can you also
            put beta inside the apps pages as well"). */}
        <div className="flex-1">
          <h1 className="text-h2 text-fg">{app.name}{app.beta ? ' Beta' : ''}</h1>
          <p className="mt-1 max-w-content text-body-lg text-fg-secondary">{app.description}</p>

          {/* The platform/trigger caption line that used to sit here is
              gone, at Alex's direction — the smallest, least load-bearing
              text on the page, replaced by the one thing worth doing this
              high up: the actual next step. Capture/Dictate/Narrate are
              pre-release, so their detail pages point at the same waitlist
              form rather than a real purchase flow. Convert (app.openUrl
              set) is different — it already exists — so its action reads
              "Open" and links straight to convert.ajwoo.com instead.
              Secondary, not primary either way — at Alex's direction, since
              neither "Waitlist" nor a plain external "Open" is the
              confident, one-primary-per-view action a real download/
              purchase would be (Principle 9: real separation, never
              default-focused, a plain navigation so it can't double-fire). */}
          <div className="mt-1.5">
            {app.openUrl ? (
              <Action href={app.openUrl} external variant="secondary" cursorLabel="Open">
                Open
              </Action>
            ) : app.downloadZip ? (
              <a
                href={app.downloadZip}
                download
                data-cursor-label="Install"
                className={
                  'inline-flex items-center justify-center h-control-md rounded-control border ' +
                  'text-label font-medium transition duration-fast ease-standard motion-safe:active:scale-press ' +
                  'bg-secondary text-secondary-fg border-secondary-line px-6 ' +
                  'can-hover:hover:bg-secondary-hover can-hover:hover:border-secondary-line-hover ' +
                  'active:bg-secondary-active'
                }
              >
                Install
              </a>
            ) : (
              <Action href={WAITLIST_FORM_URL} external variant="secondary" cursorLabel="Join waitlist">
                Waitlist
              </Action>
            )}
          </div>
        </div>
      </header>

      {/* Real demo, not another icon/screenshot — the actual thing the app
          does, between the "Waitlist"/"Open" action and the copy explaining
          it. Never autoplays (Principle 14 — nothing moves until the reader
          asks): a YouTube embed already shows a thumbnail and needs a click
          to play, same as the self-hosted video path's `controls` +
          `preload="none"` does; youtube-nocookie.com avoids setting any
          YouTube cookies until playback actually starts. demoVideoYoutube
          takes priority over the self-hosted demoVideo when both are set. */}
      {app.demoVideoYoutube ? (
        <div className="mb-12 aspect-video overflow-hidden rounded-lg border border-line-subtle bg-sunken">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${app.demoVideoYoutube}`}
            title={`${app.name} demo`}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : app.demoVideo ? (
        <div className="mb-12">
          <video
            controls
            preload="none"
            poster={`/img/${app.demoVideo}-poster.webp`}
            className="block h-auto w-full rounded-lg border border-line-subtle bg-sunken"
          >
            <source src={`/img/${app.demoVideo}.webm`} type="video/webm" />
            <source src={`/img/${app.demoVideo}.mp4`} type="video/mp4" />
          </video>
        </div>
      ) : null}

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
        {/* bg-raised + a border, not bg-sunken — at Alex's direction
            ("the tags... are more visible... the dark gray is not
            visible against the black background"): bg-sunken is a
            near-black recessed surface in dark mode, close enough to
            the page's own background that the pill barely read as a
            pill at all. bg-raised is the same lighter surface AppCard
            itself uses, with its own border for a clear edge. */}
        <ul className="flex flex-wrap gap-3 pt-2">
          {app.traits.map((t) => (
            <li key={t} className="rounded-xs border border-line-subtle bg-raised px-4 py-2 text-caption text-fg-secondary">
              {t}
            </li>
          ))}
        </ul>
      </article>

      {others.length > 0 && (
        <section className="border-t border-line-subtle pt-12 pb-12">
          <h2 className="text-h3 text-fg">More apps</h2>
          {/* Full cards — same grid as /apps itself (components/AppCard.tsx),
              not the old plain-link list, at Alex's direction: the demo
              video/thumbnail and the real Waitlist/Open action should both
              be visible here, not just a name. */}
          <div className="mt-8 grid grid-cols-1 gap-8 medium:grid-cols-2 expanded:grid-cols-3">
            {others.map((a) => (
              <AppCard key={a.slug} app={a} hoverPlay />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
