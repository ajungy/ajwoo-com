import Link from 'next/link';
import { Action } from './Action';
import { AppIcon, AppIconTile } from './AppIcon';
import { PriceBadge } from './PriceBadge';
import type { App } from '@/content/apps';

/**
 * Same shape as the Design and Coffee cards — media on top, title block below —
 * so all three grids read as one system. The differences Alex asked for are the
 * footer row: the app's own icon bottom-left, an Install action bottom-right.
 *
 * DEVIATION, stated rather than hidden: components.md says "don't put competing
 * buttons inside a clickable card". This card has both a card-level link and an
 * Install button. The conflict is resolved the standard way — the card link is
 * a stretched overlay (::after via `card-link`), and Install sits above it on
 * its own stacking context, so the markup stays valid (no nested anchors) and
 * the hit areas never overlap. Install is the primary path; the card is the
 * "tell me more" path.
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
        <div className="flex items-start justify-between gap-5">
          <h3 className="text-title text-fg">
            {/* The stretched link: the whole card is clickable and the app name
                is its accessible label. */}
            <Link href={`/apps/${app.slug}/`} data-cursor-label={app.name} className="card-link">
              {app.name}
            </Link>
          </h3>
          <PriceBadge price={app.price} />
        </div>
        <p className="mt-2 text-caption text-fg-secondary">{app.description}</p>

        <div className="mt-8 flex items-center justify-between gap-6">
          {app.iconImage ? (
            <img
              src={`/img/${app.iconImage}-128.webp`}
              alt=""
              width={40}
              height={40}
              className="h-10 w-10 rounded-lg"
            />
          ) : (
            <AppIconTile name={app.icon} />
          )}
          {/* Above the stretched link so it is its own target. */}
          <div className="relative z-10">
            <Action
              href={app.action.href}
              external
              variant="secondary"
              cursorLabel="Install"
            >
              Install
            </Action>
          </div>
        </div>
      </div>
    </article>
  );
}
