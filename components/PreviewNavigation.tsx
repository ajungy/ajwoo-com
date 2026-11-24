'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isPlainClick, onPreviewHistory, openPreview } from '@/lib/preview-flight';

export function PreviewNavigation() {
  const router = useRouter();
  useEffect(() => {
    // Warm only a route the visitor points to or focuses. MP4s themselves
    // remain unloaded until their card is active.
    function prefetch(event: Event) {
      const link = event.target instanceof Element && event.target.closest<HTMLAnchorElement>('a[data-work-preview-link]');
      if (link && !link.dataset.prefetched) {
        link.dataset.prefetched = 'true';
        router.prefetch(link.pathname);
      }
    }
    // Bubble after each gallery's own drag and off-center selection handlers.
    function open(event: MouseEvent) {
      if (!isPlainClick(event) || !(event.target instanceof Element)) return;
      const link = event.target.closest<HTMLAnchorElement>('a[data-work-preview-link]');
      if (!link || link.target || link.origin !== location.origin) return;
      const slot = Array.from(document.querySelectorAll<HTMLElement>('[data-preview-link]')).find(node => node.dataset.previewLink === link.pathname);
      if (!slot || !openPreview(slot, link.pathname)) return;
      event.preventDefault();
      if (location.pathname === '/') history.replaceState({ ...history.state, homeWorkProject: link.pathname }, '');
      router.push(link.pathname);
    }
    document.addEventListener('pointerover', prefetch);
    document.addEventListener('focusin', prefetch);
    document.addEventListener('click', open);
    window.addEventListener('popstate', onPreviewHistory, true);
    return () => {
      document.removeEventListener('pointerover', prefetch);
      document.removeEventListener('focusin', prefetch);
      document.removeEventListener('click', open);
      window.removeEventListener('popstate', onPreviewHistory, true);
    };
  }, [router]);
  return null;
}
