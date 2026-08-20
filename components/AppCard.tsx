import Link from 'next/link';
import { Action } from './Action';
import { AppIcon } from './AppIcon';
import type { App } from '@/content/apps';

/**
 * Same shape as the Design and Coffee cards — media on top, title block below —
 * so all three grids read as one system.
 *
 * Footer, per Alex's spec: one row holds the icon, a title+description column,
 * and Install. Icon is the system's usual rounded-square tile — an earlier pass
 * tried a circle (phone-homescreen shape) and Alex asked for the square back,
 * so this now matches every other icon tile in the system rather than being a
 * one-off exception.
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

      <div className="flex items-center gap-5 p-7">
        {app.iconImage ? (
          <img
            src={`/img/${app.iconImage}-128.webp`}
            alt=""
            width={44}
            height={44}
            className="h-11 w-11 shrink-0 rounded-lg border border-line-subtle"
          />
        ) : (
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-line-subtle bg-sunken text-fg">
            <AppIcon name={app.icon} className="h-5 w-5" />
          </span>
        )}

        {/* Title above description, one column, sharing the row with the icon
            and Install rather than spanning the full card width. */}
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-title text-fg">
            {/* The stretched link: the whole card is clickable and the app
                name is its accessible label. */}
            <Link href={`/apps/${app.slug}/`} data-cursor-label={app.name} className="card-link">
              {app.name}
            </Link>
          </h3>
          <p className="truncate text-caption text-fg-secondary">{app.description}</p>
        </div>

        {/* Above the stretched link so it is its own target. */}
        <div className="relative z-10 shrink-0">
          <Action href={app.action.href} external variant="secondary" cursorLabel="Install">
            Install
          </Action>
        </div>
      </div>
    </article>
  );
}
