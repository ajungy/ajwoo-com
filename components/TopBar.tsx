'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { CursorToggle } from './CursorToggle';
import { ShareButton } from './ShareButton';
import { HeaderMenu } from './HeaderMenu';
import { nav } from '@/content/site';

/**
 * The app shell. Identity top-left, centered nav, right cluster (theme toggle,
 * Share, kebab), same pixel position on every page, every canvas class.
 *
 * The bar is the system's ONE translucent surface: `--surface-chrome` at 72%
 * over a 24px backdrop blur (SKILL.md §2). Page content dissolves into it as
 * it scrolls up rather than being clipped by an opaque band. 72% is the floor
 * at which text on top still clears 4.5:1 over arbitrary scrolling content.
 *
 * Current location is carried by contrast: active at --text-primary
 * (17-19:1), inactive at --text-tertiary (~4.8-5.6:1). The gap is deliberately
 * large so the state is immediately obvious.
 *
 * Hover highlight, at Alex's direction ("add hover button highlights like
 * the darkmode button"): the wordmark and the three nav links now pick up
 * the same `rounded-control` + `bg-tertiary-hover` fill ThemeToggle.tsx
 * uses, in addition to the existing text-color step — a padded hit box
 * (`px-2 -mx-2`, so the extra padding doesn't visibly shift the wordmark/
 * nav off their existing pixel position) rather than a bare color change.
 *
 * Layout:
 * - Compact (<600px): Logo left, theme toggle + kebab right. Nav links don't
 *   sit below the bar at rest any more — Design/Coffee/Apps only appear when
 *   the kebab is opened, in a second row that pushes the bar itself taller,
 *   at Alex's direction, rather than a popover floating over the page. That
 *   second row also carries Share. Book 30 minutes lives in the hero on `/`
 *   only now — it was redundant in both the header and this menu.
 * - Medium+ (≥600px): Logo left, centered nav, right cluster with theme
 *   toggle and Share. No kebab; there's room for everything already.
 */
export function TopBar() {
  const pathname = usePathname();
  const norm = (p: string) => (p.length > 1 ? p.replace(/\/$/, '') : p);
  const isActive = (href: string) => norm(pathname) === norm(href);
  const home = norm(pathname) === '/';
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = (extraClassName: string) =>
    nav.map((n) => (
      <Link
        key={n.href}
        href={n.href}
        aria-current={isActive(n.href) ? 'page' : undefined}
        data-cursor-label={n.label}
        className={
          'text-label inline-flex items-center rounded-control px-2 -mx-2 py-1.5 -my-1.5 ' +
          'transition duration-fast ease-standard can-hover:hover:bg-tertiary-hover ' +
          (isActive(n.href) ? 'font-semibold text-fg' : 'text-fg-tertiary can-hover:hover:text-fg') +
          ' ' + extraClassName
        }
      >
        {n.label}
      </Link>
    ));

  return (
    <header className="chrome entrance-header sticky top-0 z-sticky">
      <div className="mx-auto max-w-app px-page">
        <div className="flex h-12 items-center gap-4 medium:gap-8">
          {/* Logo — top-left, always visible */}
          <Link
            href="/"
            aria-current={home ? 'page' : undefined}
            data-cursor-label="Home"
            className={
              'flex items-center rounded-control px-2 -mx-2 py-1.5 -my-1.5 shrink-0 transition ' +
              'duration-fast ease-standard can-hover:hover:bg-tertiary-hover ' +
              (home ? 'text-fg' : 'text-fg-secondary can-hover:hover:text-fg')
            }
          >
            <Logo className="h-6 w-auto" />
          </Link>

          {/* Centered nav — hidden on compact, visible on medium+ */}
          <nav
            aria-label="Sections"
            className="hidden medium:flex items-center gap-9 absolute left-1/2 -translate-x-1/2"
          >
            {navLinks('')}
          </nav>

          {/* Right cluster: theme toggle, cursor toggle, Share on medium+;
              kebab menu on compact. Neither ThemeToggle nor HeaderMenu sits
              inside a scale wrapper — an earlier scale-125 around HeaderMenu
              made it visibly bigger than ThemeToggle on compact despite
              both using the same h/w-control-md token, which is exactly the
              mismatch Alex flagged (button size, icon size, and line weight
              all need to match between the two). Removing it makes them
              match natively, with no token override needed.
              gap-4 (8px) at EVERY breakpoint now, not gap-4/medium:gap-2 —
              at Alex's direction ("keep the button distance consistent
              between the darkmode button, bubble button, and share
              button... 8px apart"): medium:gap-2 was only 4px (this
              project's custom spacing scale, where index 2 = 4px), half of
              compact's own gap-4 (8px) — the two breakpoints disagreed with
              each other, not just with the 8px target. One value now
              satisfies both. */}
          <div className="flex items-center gap-4 shrink-0 ml-auto">
            {/* CursorToggle right next to ThemeToggle, at Alex's direction
                ("make a toggle... next to the dark and light mode
                button... where it'll show you the effects of the bubble
                cursor") — same visibility as ThemeToggle (always shown,
                not gated behind medium:block/hidden), same chrome, so it
                reads as one more member of that icon-button family. */}
            <ThemeToggle />
            <CursorToggle />
            <div className="hidden medium:block">
              <ShareButton />
            </div>
            {/* `flex` on this wrapper (not just `medium:hidden`), at Alex's
                direction ("the hamburger button is slightly above the
                light dark mode button") — real bug: a plain block `<div>`
                wrapping an inline-flex `<button>` gets its own height from
                normal inline line-box rules (the button's line-height
                contributes "phantom" leading above/below it), which was a
                couple pixels TALLER than the button's own 44px box. The
                row's `items-center` then centered THAT taller wrapper,
                nudging the actual button off-center relative to
                ThemeToggle right next to it (which has no such wrapper,
                so nothing shifts it). `flex` makes the wrapper's own box
                shrink exactly to the button's real height, matching
                ThemeToggle's box exactly and centering identically. */}
            <div className="medium:hidden flex">
              <HeaderMenu open={menuOpen} onToggle={() => setMenuOpen((v) => !v)} />
            </div>
          </div>
        </div>

        {/* Compact expanded row — the bar itself grows taller when the kebab
            is opened, rather than a menu popping over the page. Design,
            Coffee, Apps on the left; Share on the right, matching the
            medium+ layout's right-cluster position. */}
        {menuOpen && (
          <div className="flex items-center justify-between pb-4 medium:hidden">
            <nav aria-label="Sections" className="flex items-center gap-6">
              {navLinks('')}
            </nav>
            <ShareButton />
          </div>
        )}
      </div>
    </header>
  );
}
