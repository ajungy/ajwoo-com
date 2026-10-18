import type { Metadata } from 'next';
import { site } from '@/content/site';

// Canonical identity is independent of local or preview build environments.
export const SITE_URL = 'https://www.ajwoo.com';

export function pageMetadata(path: string, title: string, description: string = site.identity): Metadata {
  const url = new URL(path, SITE_URL).href;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: 'Alex Woo' },
  };
}
