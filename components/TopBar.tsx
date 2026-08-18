'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Action } from './Action';
import { nav, site } from '@/content/site';

/**
 * The app shell. Identity top-left, global cluster top-right — the same pixel
 * position on every page, every canvas class (Principle 3 / 17).
 *
 * Compact carries wordmark + CTA on the bar and the three destinations on a
 * second row, visible at rest. No hamburger: hiding three short words behind a
 * drawer costs an interaction and buys nothing.
 *
 * Density: 5 interactive elements at compact — exactly at the budget ceiling.
 * Nothing may be added here without removing something.
 */
export function TopBar() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname === href.replace(/\/$/, '');

  const links = (
    <nav aria-label="Sections" className="flex items-center gap-6">
      {nav.map((n) => (
        <Link
          key={n.href}
          href={n.href}
          aria-current={isActive(n.href) ? 'page' : undefined}
          data-cursor-label={`Open ${n.label}`}
          className={
            'text-label transition-colors duration-fast ease-standard ' +
            (isActive(n.href)
              ? 'text-fg font-medium'
              : 'text-fg-secondary can-hover:hover:text-fg')
          }
        >
          {n.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <header className="sticky top-0 z-sticky bg-page border-b border-line-subtle">
      <div className="mx-auto max-w-app px-page">
        <div className="flex h-12 items-center justify-between gap-8">
          <Link
            href="/"
            data-cursor-label="Back to the start"
            className="text-title font-semibold text-fg transition-colors duration-fast ease-standard can-hover:hover:text-fg-secondary"
          >
            {site.name}
          </Link>

          <div className="flex items-center gap-8">
            <div className="hidden medium:block">{links}</div>
            <Action href={site.calendlyUrl} external variant="secondary" cursorLabel={site.ctaLabel}>
              {site.ctaLabel}
            </Action>
          </div>
        </div>

        {/* Compact: destinations sit below the bar, visible at rest. */}
        <div className="medium:hidden pb-5">{links}</div>
      </div>
    </header>
  );
}
