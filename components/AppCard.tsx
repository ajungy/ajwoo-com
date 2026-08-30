'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Action } from './Action';
import { AppIcon } from './AppIcon';
import { WAITLIST_FORM_URL, type App } from '@/content/apps';

/**
 * Same shape as the Design and Coffee cards: media on top, title block below,
 * so all three grids read as one system.
 *
 * Footer, per Alex's spec: one row holds the icon, a title+description column,
 * and Install. Icon is the system's usual rounded-square tile; an earlier pass
 * tried a circle (phone-homescreen shape) and Alex asked for the square back,
 * so this now matches every other icon tile in the system rather than being a
 * one-off exception.
 *
 * Price is gone entirely (CLAUDE.md D2 is still unanswered) — see
 * content/apps.ts. Footer button: `openUrl` set (Convert — already real,
 * already shipped) gets "Open" pointing at itself; `downloadZip` set
 * (Capture's beta build) gets "Install", a plain `download` link straight
 * to that file; everything else still reads "Waitlist" -> WAITLIST_FORM_URL.
 * `beta` appends "Beta" after the app's name on the card only (not the
 * detail page's own h1) — at Alex's direction, e.g. "Capture Beta".
 *
 * DEVIATION, stated rather than hidden: components.md says "don't put competing
 * buttons inside a clickable card". This card has both a card-level link and a
 * Waitlist button. Resolved with a stretched overlay (`card-link`) for the card,
 * with Waitlist sitting above it on its own stacking context: the markup stays
 * valid (no nested anchors) and the hit areas never overlap. Waitlist is the
 * primary path; the card is the "tell me more" path.
 *
 * The cursor label lives on the outer `<article>`, not on the inner stretched
 * link. Pointer hit-testing over the ::after overlay resolves to the small
 * `<a>` no matter where on the card you actually are, so labelling THAT anchor
 * made the water drop shrink to the size of its own text ("Capture") instead
 * of representing the whole card. Cursor.tsx's `closest('[data-cursor-label]')`
 * walks up from the hit anchor and finds the article's label instead, which is
 * what actually has the card's real, full-size bounding box.
 *
 * Media is always shown in a 1:1 frame now, matching the Design/Coffee grids.
 * Capture uses a real autoplaying demo (`app.thumbnailVideo`, muted/looped,
 * same pattern as the Design grid's motion tiles); Dictate and Narrate use a
 * static thumbnail (`app.thumbnail`). `object-cover` crops either to fill the
 * square exactly like the Design/Coffee tiles.
 *
 * Card radius, icon radius, and footer typography match the Figma reference
 * (node 358:941, "Apps cards") exactly: 20px card corners (`rounded-xl`, not
 * `rounded-lg`), a `text-label`-sized name (14px/500) rather than
 * `text-title`'s 17px — the Figma comp treats the app name at the same
 * weight class as a button label, not a heading — and a 10px icon radius
 * (`rounded-control`) instead of the 14px tile radius used elsewhere.
 *
 * Icons render with `object-contain`, not `object-cover` or the browser's
 * `fill` default (what plain `<img>` uses when no `object-fit` is set) — the
 * three source icons ship at different native resolutions (Capture and
 * Narrate at 160x160, Dictate at 40x40) and `fill` would stretch the smaller
 * one to match its box non-uniformly, which is exactly why they looked
 * inconsistent with each other before this.
 *
 * `hoverPlay`: on the /apps grid, Capture's demo only plays while the
 * pointer is actually over the card — a whole grid of autoplaying video was
 * more motion than a browsing page needs at rest (Principle 14). The
 * landing page's featured-app card keeps the original always-on autoplay
 * (hoverPlay omitted/false there), since it's the one card on that page and
 * reads as a deliberate showcase rather than grid noise. Implemented with a
 * ref + play()/pause() rather than toggling the `autoPlay` attribute, since
 * `autoPlay` only affects a video's behavior at the moment its source is
 * first assigned, not on demand afterward.
 *
 * `playing`: a third, explicit mode for components/DepthCarousel.tsx — the
 * landing page's stacked app carousel plays whichever card is currently on
 * TOP of the stack, not whichever the pointer happens to be over. When set
 * (true or false, not undefined) it overrides hoverPlay entirely; the video
 * starts `autoPlay={false}` regardless (its `src` is only ever fetched once
 * DepthCarousel actually needs it) and this effect explicitly play()s/
 * pause()s as the prop flips, same reasoning as hoverPlay above for why
 * that has to be imperative rather than toggling the attribute.
 *
 * `hoverZoom`: defaults on (the /apps grid's own behavior — `.card-press`'s
 * 2% hover grow). DepthCarousel.tsx sets it false, at Alex's direction
 * ("remove the zoom in on hover") — the carousel's own scale/tilt/translate
 * is already the card's hover-equivalent motion there, so a second,
 * independent grow on top of it read as fighting itself. `shadow-e1` ->
 * `shadow-e2` on hover and the active-press scale still apply either way,
 * matching the /apps grid's own hover shadow exactly.
 */
export function AppCard({
  app,
  hoverPlay = false,
  playing,
  hoverZoom = true,
}: {
  app: App;
  hoverPlay?: boolean;
  playing?: boolean;
  hoverZoom?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (playing === undefined) return;
    if (playing) videoRef.current?.play().catch(() => {});
    else videoRef.current?.pause();
  }, [playing]);

  return (
    <article
      data-cursor-label={app.name}
      onMouseEnter={playing === undefined && hoverPlay ? () => videoRef.current?.play() : undefined}
      onMouseLeave={playing === undefined && hoverPlay ? () => videoRef.current?.pause() : undefined}
      className={
        'group relative flex flex-col overflow-hidden rounded-xl border border-line-subtle ' +
        'bg-raised shadow-e1 card-press can-hover:hover:border-line can-hover:hover:shadow-e2' +
        (hoverZoom ? '' : ' no-hover-zoom')
      }
    >
      <div className="skeleton-shimmer relative aspect-square overflow-hidden">
        {app.thumbnailVideo ? (
          <video
            ref={videoRef}
            autoPlay={playing === undefined && !hoverPlay}
            muted
            loop
            playsInline
            preload={playing !== undefined || hoverPlay ? 'metadata' : 'auto'}
            poster={`/img/${app.thumbnailVideo}-poster.webp`}
            className="card-thumb-media block h-full w-full object-cover"
          >
            <source src={`/img/${app.thumbnailVideo}.webm`} type="video/webm" />
            <source src={`/img/${app.thumbnailVideo}.mp4`} type="video/mp4" />
          </video>
        ) : app.thumbnail ? (
          <picture>
            <source srcSet={`/img/${app.thumbnail}.webp`} type="image/webp" />
            <img
              src={`/img/${app.thumbnail}.jpg`}
              alt=""
              width={838}
              height={838}
              className="card-thumb-media block h-full w-full object-cover"
            />
          </picture>
        ) : (
          // No thumbnail yet. An empty band reads as broken, so the app's own
          // mark stands in — which is what a store does before a screenshot
          // exists, and it keeps every card the same shape as the others.
          <div className="card-thumb-media flex h-full items-center justify-center">
            <AppIcon name={app.icon} className="h-12 w-12 text-fg-tertiary" />
          </div>
        )}
      </div>

      <div className="flex items-center gap-5 p-7">
        {/* h-control-md, not a fixed h-11: the icon must stay exactly the
            Waitlist button's height at every breakpoint (control-md itself
            grows on coarse pointers/TV — see tokens.css §6), not just match
            it at the default 40px and drift apart everywhere else. */}
        {app.iconImage ? (
          <img
            src={`/img/${app.iconImage}-128.webp`}
            alt=""
            width={40}
            height={40}
            className="h-control-md w-control-md shrink-0 rounded-control border border-line-subtle object-contain"
          />
        ) : (
          <span className="flex h-control-md w-control-md shrink-0 items-center justify-center rounded-control border border-line-subtle bg-sunken text-fg">
            <AppIcon name={app.icon} className="h-5 w-5" />
          </span>
        )}

        {/* Title above description, one column, sharing the row with the icon
            and Waitlist rather than spanning the full card width. */}
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-label font-medium text-fg">
            {/* The stretched link: the whole card is clickable and the app
                name (plus "Beta" when set) is its accessible label. */}
            <Link href={`/apps/${app.slug}/`} className="card-link">
              {app.name}{app.beta ? ' Beta' : ''}
            </Link>
          </h3>
          <p className="truncate text-caption text-fg-secondary">{app.description}</p>
        </div>

        {/* Above the stretched link so it is its own target. `openUrl`
            (Convert — already real, already shipped) points straight at
            itself, labeled "Open". `downloadZip` (Capture's beta build)
            downloads that file directly, labeled "Install" — a plain
            anchor with the `download` attribute, same pattern as
            CopySkillButton.tsx, not an Action (which only ever navigates,
            never downloads). Everything else still reads "Waitlist". */}
        <div className="relative z-10 shrink-0">
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
    </article>
  );
}
