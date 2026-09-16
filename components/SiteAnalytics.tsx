'use client';
import { usePathname } from 'next/navigation';
import { AnalyticsConsent } from '@/lib/analytics/AnalyticsConsent';

const config = {
  key: process.env.NEXT_PUBLIC_POSTHOG_KEY ?? '',
  host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com',
  app: 'website',
  enabled: false,
};
export function SiteAnalytics() {
  const path = usePathname();
  const enabled = typeof location !== 'undefined' && ['ajwoo.com', 'www.ajwoo.com'].includes(location.hostname);
  // Keep the config stable: route changes should record a page, not reinstall listeners.
  config.enabled = enabled;
  return <AnalyticsConsent config={config} path={path} />;
}
