import type { Metadata } from 'next';
import { site } from '@/content/site';

// Canonical identity is independent of local or preview build environments.
export const SITE_URL = 'https://www.ajwoo.com';

export const SHARE_IMAGE = {
  url: `${SITE_URL}/img/hero-dark-1540.jpg`,
  width: 1540,
  height: 799,
  alt: 'Alex Woo — product designer',
};

export function pageMetadata(path: string, title: string, description: string = site.identity): Metadata {
  const url = new URL(path, SITE_URL).href;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: 'Alex Woo', images: [SHARE_IMAGE] },
    twitter: { card: 'summary_large_image', title, description, images: [SHARE_IMAGE] },
  };
}
