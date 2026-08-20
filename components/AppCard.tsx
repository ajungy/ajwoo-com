import Link from 'next/link';
import { Action } from './Action';
import { AppIcon } from './AppIcon';
import type { App } from '@/content/apps';

/**
 * Same shape as the Design and Coffee cards — media on top, title block below —
 * so all three grids read as one system.
 *
 * Footer, per Alex's spec: icon and name share a row (icon circular, like a
 * phone home-screen icon — the one deliberate departure from the system's
 * rounded-square icon tiles, because "install this" is exactly the context
 * where a circular mark reads as an app). Install sits on the same row, right
 * side. The description is one short line underneath, not a paragraph.
 *
 * Price is deliberately absent from this card. CLAUDE.md D2 (pricing) is still
 * open, and every price here is currently "TBD" — a badge that always reads
 * "TBD" is noise on 3 cards, not information. Price still renders on each
 * app's own detail page once it exists, so nothing is permanently hidden
 * (SKILL.md §6: cost is never hidden, not "never absent from every surface").
 *
 * DEVIATION, stated rather than hidden: components.md says "don't put competing
 * buttons inside a clickable card". This card has both a card-level link and an
 * Install button. Resolved with a stretched overlay (`card-link`) for the card,
 * with Install sitting above it on its own stacking context — the markup stays
 * valid (no nested anchors) and the hit areas never overlap. Install is the
 * primary path; the card is the "tell me more" path.
 */
export function AppCard({ app }: { app: App }) {
  const media = app.media;
  return (
    <article
      className={
        'group relative flex flex-col overflow-hidden rounded-lg border border-line-subtle ' +
        'bg-raised shadow-e1 card-press can-hover:hover:border-line can-hover:hover:shadow-e2'
      }
    >
      <div className="relative bg-sunken">
        {media ? (
          <video
            muted
            loop
            playsInline
            preload="none"
            poster={`/img/${media.poster}`}
            width={media.width}
            height={media.height}
            className="block h-auto w-full"
          >
            <source src={`/img/${media.base}.webm`} type="video/webm" />
            <source src={`/img/${media.base}.mp4`} type="video/mp4" />
          </video>
        ) : (
          // No recording yet. An empty grey band reads as broken, so the app's
          // own mark stands in — which is what a store does before a screenshot
          // exists, and it keeps every card the same height.
          <div className="flex aspect-video items-center justify-center">
            <AppIcon name={app.icon} className="h-12 w-12 text-fg-tertiary" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-7">
        <div className="flex items-center justify-between gap-5">
          <div className="flex min-w-0 items-center gap-4">
            {app.iconImage ? (
              <img
                src={`/img/${app.iconImage}-128.webp`}
                alt=""
                width={40}
                height={40}
                className="h-10 w-10 shrink-0 rounded-full border border-line-subtle"
              />
            ) : (
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line-subtle bg-sunken text-fg">
                <AppIcon name={app.icon} className="h-5 w-5" />
              </span>
            )}
            <h3 className="truncate text-title text-fg">
              {/* The stretched link: the whole card is clickable and the app
                  name is its accessible label. */}
              <Link href={`/apps/${app.slug}/`} data-cursor-label={app.name} className="card-link">
                {app.name}
              </Link>
            </h3>
          </div>

          {/* Above the stretched link so it is its own target. */}
          <div className="relative z-10 shrink-0">
            <Action href={app.action.href} external variant="secondary" cursorLabel="Install">
              Install
            </Action>
          </div>
        </div>

        <p className="mt-4 truncate text-caption text-fg-secondary">{app.description}</p>
      </div>
    </article>
  );
}
