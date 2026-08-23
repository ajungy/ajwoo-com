import Link from 'next/link';
import { Action } from './Action';
import { AppIcon } from './AppIcon';
import type { App } from '@/content/apps';

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
 * Price is deliberately absent from this card. CLAUDE.md D2 (pricing) is still
 * open, and every price here is currently "TBD", a badge that always reads
 * "TBD" is noise on 3 cards, not information. Price still renders on each
 * app's own detail page once it exists, so nothing is permanently hidden
 * (SKILL.md §6: cost is never hidden, not "never absent from every surface").
 *
 * DEVIATION, stated rather than hidden: components.md says "don't put competing
 * buttons inside a clickable card". This card has both a card-level link and an
 * Install button. Resolved with a stretched overlay (`card-link`) for the card,
 * with Install sitting above it on its own stacking context: the markup stays
 * valid (no nested anchors) and the hit areas never overlap. Install is the
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
 * A static thumbnail (`app.thumbnail`, from Figma node 359:987 — "Apps cards
 * with png") is the card's media for all three apps now, Capture included,
 * at Alex's direction: it replaces the earlier video-loop treatment, which
 * only Capture had real footage for anyway. `object-cover` crops it to fill
 * the square exactly like the Design/Coffee tiles, since these are already
 * composed screenshots, not raw footage that needs the whole frame visible.
 *
 * Card radius, icon radius, and footer typography match the Figma reference
 * (node 358:941, "Apps cards") exactly: 20px card corners (`rounded-xl`, not
 * `rounded-lg`), a `text-label`-sized name (14px/500) rather than
 * `text-title`'s 17px — the Figma comp treats the app name at the same
 * weight class as a button label, not a heading — and a 10px icon radius
 * (`rounded-control`) instead of the 14px tile radius used elsewhere.
 */
export function AppCard({ app }: { app: App }) {
  return (
    <article
      data-cursor-label={app.name}
      className={
        'group relative flex flex-col overflow-hidden rounded-xl border border-line-subtle ' +
        'bg-raised shadow-e1 card-press can-hover:hover:border-line can-hover:hover:shadow-e2'
      }
    >
      <div className="relative aspect-square overflow-hidden bg-sunken">
        {app.thumbnail ? (
          <picture>
            <source srcSet={`/img/${app.thumbnail}.webp`} type="image/webp" />
            <img
              src={`/img/${app.thumbnail}.jpg`}
              alt=""
              width={419}
              height={419}
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
            Install button's height at every breakpoint (control-md itself
            grows on coarse pointers/TV — see tokens.css §6), not just match
            it at the default 40px and drift apart everywhere else. */}
        {app.iconImage ? (
          <img
            src={`/img/${app.iconImage}-128.webp`}
            alt=""
            width={40}
            height={40}
            className="h-control-md w-control-md shrink-0 rounded-control border border-line-subtle"
          />
        ) : (
          <span className="flex h-control-md w-control-md shrink-0 items-center justify-center rounded-control border border-line-subtle bg-sunken text-fg">
            <AppIcon name={app.icon} className="h-5 w-5" />
          </span>
        )}

        {/* Title above description, one column, sharing the row with the icon
            and Install rather than spanning the full card width. */}
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-label font-medium text-fg">
            {/* The stretched link: the whole card is clickable and the app
                name is its accessible label. */}
            <Link href={`/apps/${app.slug}/`} className="card-link">
              {app.name}
            </Link>
          </h3>
          <p className="truncate text-caption text-fg-secondary">{app.description}</p>
        </div>

        {/* Above the stretched link so it is its own target. "Install" for
            an app with a real build, "Waitlist" for one that doesn't have
            one yet (Dictate, Narrate — see content/apps.ts's `waitlist`
            flag), at Alex's direction. Distinct from `action.label`, which
            is the detail page's own longer "Get Dictate" style copy. */}
        <div className="relative z-10 shrink-0">
          <Action href={app.action.href} external variant="secondary" cursorLabel={app.waitlist ? 'Waitlist' : 'Install'}>
            {app.waitlist ? 'Waitlist' : 'Install'}
          </Action>
        </div>
      </div>
    </article>
  );
}
