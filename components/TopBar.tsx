'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Action } from './Action';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { nav, site } from '@/content/site';

/**
 * The app shell. Identity top-left, global cluster top-right — same pixel
 * position on every page, every canvas class (Principle 3 / 17).
 *
 * The bar is the system's ONE translucent surface: `--surface-chrome` at 72%
 * over a 24px backdrop blur (SKILL.md §2). Page content dissolves into it as
 * it scrolls up rather than being clipped by an opaque band. 72% is the floor
 * at which text on top still clears 4.5:1 over arbitrary scrolling content —
 * it is not lowered here.
 *
 * Current location is carried by contrast alone: the active destination sits at
 * --text-primary, the rest at --text-secondary. Both clear AAA (7:1) against
 * the page, so the indicator costs no reserved space and no extra line.
 *
 * DENSITY, honestly: adding the theme toggle takes compact to SIX interactive
 * elements against a budget of five (reference/disclosure.md). CLAUDE.md §4
 * recorded that compact sat exactly at the ceiling and that nothing could be
 * added without a removal. Alex asked for the toggle, so it is in and the
 * breach is recorded rather than quietly absorbed — the removal candidate, if
 * we want to get back inside budget, is the CTA on compact.
 */
export function TopBar() {
  const pathname = usePathname();
  const norm = (p: string) => (p.length > 1 ? p.replace(/\/$/, '') : p);
  const isActive = (href: string) => norm(pathname) === norm(href);
  const home = norm(pathname) === '/';

  const links = (
    <nav aria-label="Sections" className="flex items-center gap-6">
      {nav.map((n) => (
        <Link
          key={n.href}
          href={n.href}
          aria-current={isActive(n.href) ? 'page' : undefined}
          data-cursor-label={n.label}
          className={
            'text-label transition-colors duration-fast ease-standard ' +
            (isActive(n.href)
              ? 'font-semibold text-fg'
              : 'text-fg-secondary can-hover:hover:text-fg')
          }
        >
          {n.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <header className="chrome sticky top-0 z-sticky">
      <div className="mx-auto max-w-app px-page">
        <div className="flex h-12 items-center justify-between gap-8">
          <Link
            href="/"
            aria-current={home ? 'page' : undefined}
            data-cursor-label="Home"
            className={
              'flex items-center transition-colors duration-fast ease-standard ' +
              (home ? 'text-fg' : 'text-fg-secondary can-hover:hover:text-fg')
            }
          >
            <Logo className="h-6 w-auto" />
          </Link>

          <div className="flex items-center gap-8">
            <div className="hidden medium:block">{links}</div>
            <ThemeToggle />
            <Action href={site.calendlyUrl} external variant="secondary" cursorLabel="Book time">
              {site.ctaLabel}
            </Action>
          </div>
        </div>

        {/* Compact: destinations sit below the bar, visible at rest. No
            hamburger — hiding three short words costs an interaction and buys
            nothing, and compact is already at its density ceiling. */}
        <div className="pb-5 medium:hidden">{links}</div>
      </div>
    </header>
  );
}
