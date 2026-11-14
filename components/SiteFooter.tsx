'use client';

import { usePathname } from 'next/navigation';
import { site } from '@/content/site';
import { AnalyticsSettingsLink } from '@/lib/analytics/AnalyticsConsent';

export function SiteFooter() {
  const path = usePathname();
  if (path === '/work' || path.startsWith('/work/')) return null;

  return (
    <footer className="mt-15">
      <div className="mx-auto max-w-app px-page py-9 type-caption">
        &copy; {site.fullName}
        <span className="ml-6"><AnalyticsSettingsLink /></span>
      </div>
    </footer>
  );
}
