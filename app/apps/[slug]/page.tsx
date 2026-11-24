import { pageMetadata } from '@/lib/metadata';
import { CaptureInstallButton } from '@/components/CaptureInstallButton';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Action, actionClassName } from '@/components/Action';
import { WorkProjectActions } from '@/components/WorkProjectActions';
import { apps, WAITLIST_FORM_URL } from '@/content/apps';

export function generateStaticParams() {
  return apps.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const a = apps.find((x) => x.slug === params.slug);
  return pageMetadata(`/apps/${params.slug}/`, a?.name ?? 'Apps', a?.description);
}

export default function AppPage({ params }: { params: { slug: string } }) {
  const app = apps.find((a) => a.slug === params.slug);
  if (!app) notFound();
  const firstFeature = app.detail.findIndex(item => typeof item !== 'string' && 'label' in item);
  const highlightsStart = firstFeature >= 0 ? firstFeature : 1;

  // Capped at 3, at Alex's direction — full cards (not the old plain-link
  // list) take real space, and three is the /apps grid's own row width
  // (expanded:grid-cols-3), so this reads as "the rest of that same grid"
  // rather than an open-ended list.

  return (
    <div className="detail-entrance portfolio-media work-reading-column">
      {/* No "← Apps" back link, at Alex's direction — the top bar's own
          wordmark and nav already reach Apps in one click, and the "More
          apps" list at the bottom of this same page already offers the
          other two, so a second back affordance sitting alone above the
          fold wasn't earning its space (same reasoning as the /work pages). */}
      <header className={`pt-[30px] ${app.demoVideoYoutube || app.demoVideo || app.demoImage ? 'pb-[60px]' : 'pb-[var(--section-gap)]'}`}>
        <h1 className="type-project-title">{app.name}{app.beta ? ' Beta' : ''}</h1>
        <p className="mt-4 max-w-content type-subtitle">{app.description}</p>

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
        <div className="mt-6">
          {app.openUrl ? (
            <Action href={app.openUrl} external variant="secondary" cursorLabel="Open">
              Open
            </Action>
          ) : app.downloadZip ? (
            app.slug === 'capture' ? <CaptureInstallButton href={app.downloadZip} /> : (
              <a href={app.downloadZip} download data-cursor-label="Install" className={actionClassName()}>
                Install
              </a>
            )
          ) : (
            <Action href={WAITLIST_FORM_URL} external variant="secondary" cursorLabel="Join waitlist">
              Waitlist
            </Action>
          )}
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
        <div className="detail-hero-media mb-[var(--detail-media-gap)] aspect-video overflow-hidden rounded-lg border border-line-subtle bg-sunken">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${app.demoVideoYoutube}`}
            title={`${app.name} demo`}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : app.demoVideo ? (
        <div className="detail-hero-media mb-[var(--detail-media-gap)]">
          <video
            controls
            playsInline
            aria-label={`${app.name} demo`}
            preload="none"
            poster={`/img/${app.demoVideo}-poster.webp`}
            className="block h-auto w-full rounded-lg border border-line-subtle bg-sunken"
          >
            <source src={`/img/${app.demoVideo}.webm`} type="video/webm" />
            <source src={`/img/${app.demoVideo}.mp4`} type="video/mp4" />
          </video>
        </div>
      ) : app.demoImage ? (
        <figure className="detail-hero-media mb-[var(--detail-media-gap)] overflow-hidden rounded-lg border border-line-subtle bg-sunken">
          <img src={app.demoImage.src} alt={app.demoImage.alt} width={app.demoImage.width} height={app.demoImage.height} className="block h-auto w-full" />
        </figure>
      ) : null}

      <article className="max-w-content space-y-8">
        {app.detail.slice(0, highlightsStart).map((item, i) =>
          typeof item === 'string' ? <p key={i} className="type-body">{item}</p>
            : 'lead' in item && <p key={i} className="type-section-heading">{item.lead}</p>
        )}
        <section aria-labelledby="app-highlights" className="!mt-[var(--section-gap)]">
          <h2 id="app-highlights" className="type-section-heading">Highlights</h2>
          <div className="mt-8 space-y-8">
            {app.detail.slice(highlightsStart).map((item, i) =>
              typeof item === 'string' ? <p key={i} className="type-body">{item}</p>
                : 'label' in item && (
                  <div key={item.label}>
                    <h3 className="type-decision">{item.label}</h3>
                    <p className="mt-4 type-body">{item.body}</p>
                  </div>
                )
            )}
          </div>
        </section>
        {/* bg-raised + a border, not bg-sunken — at Alex's direction
            ("the tags... are more visible... the dark gray is not
            visible against the black background"): bg-sunken is a
            near-black recessed surface in dark mode, close enough to
            the page's own background that the pill barely read as a
            pill at all. bg-raised is the same lighter surface AppCard
            itself uses, with its own border for a clear edge. */}
        <ul className="flex flex-wrap gap-3 pt-2">
          {app.traits.map((t) => (
            <li key={t} className="rounded-xs border border-line-subtle bg-raised px-4 py-2 type-caption">
              {t}
            </li>
          ))}
        </ul>
      </article>

      <WorkProjectActions section="Apps" />
    </div>
  );
}
