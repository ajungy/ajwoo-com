'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isPlainClick, onPreviewHistory, openPreview } from '@/lib/preview-flight';

export function PreviewNavigation() {
  const router = useRouter();

  useEffect(() => {
    // A full document load (including a refresh during a pending preview)
    // has already rendered the correct project for this entry.
    if (history.state?.pendingWorkPreview === location.pathname &&
        document.querySelector('[data-preview-detail]')) {
      const state = { ...history.state };
      delete state.pendingWorkPreview;
      history.replaceState(state, '');
    }
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
      if (history.state?.pendingWorkPreview) {
        event.preventDefault();
        return;
      }
      const slot = Array.from(document.querySelectorAll<HTMLElement>('[data-preview-link]')).find(node => node.dataset.previewLink === link.pathname);
      if (!slot || !openPreview(slot, link.pathname)) return;
      event.preventDefault();
      if (location.pathname === '/') history.replaceState({ ...history.state, homeWorkProject: link.pathname }, '');
      // Reserve the project entry during the tap. On a cold route, router.push
      // waits for data, leaving Back pointing one page behind the gallery.
      history.pushState({ pendingWorkPreview: link.pathname }, '', link.pathname);
      router.replace(link.pathname);
    }
    // Native transitions are used for still-image projects. Cancel the
    // outgoing snapshot when returning from a project to a gallery.
    function skipGalleryReturn(event: Event) {
      const swap = event as Event & {
        activation?: { entry?: { url?: string | null } | null } | null;
        viewTransition?: { skipTransition(): void } | null;
      };
      const destination = swap.activation?.entry?.url;
      if (!destination || !/^\/work\/[^/]+\/$/.test(location.pathname)) return;
      const path = new URL(destination).pathname;
      if (path === '/' || path === '/work/' || path === '/coffee/') swap.viewTransition?.skipTransition();
    }
    window.addEventListener('pageswap', skipGalleryReturn);
    document.addEventListener('pointerover', prefetch);
    document.addEventListener('focusin', prefetch);
    document.addEventListener('click', open);
    function restorePreview() {
      if (history.state?.pendingWorkPreview === location.pathname) {
        // Forward to a project whose first load was interrupted by Back.
        // Its history entry still has the gallery's router tree.
        location.reload();
        return;
      }
      onPreviewHistory();
    }
    window.addEventListener('popstate', restorePreview, true);
    return () => {
      window.removeEventListener('pageswap', skipGalleryReturn);
      document.removeEventListener('pointerover', prefetch);
      document.removeEventListener('focusin', prefetch);
      document.removeEventListener('click', open);
      window.removeEventListener('popstate', restorePreview, true);
    };
  }, [router]);
  return null;
}
