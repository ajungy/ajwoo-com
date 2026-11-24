'use client';

import { useLayoutEffect } from 'react';

const playbackKey = 'work-video-playhead';
const sharedMedia = '[style*="work-project-media"]';

function activeVideo() {
  const media = document.querySelector(sharedMedia);
  return media instanceof HTMLVideoElement ? media : media?.querySelector('video');
}

export function WorkMediaTransition() {
  useLayoutEffect(() => {
    function save() {
      const video = activeVideo();
      if (!video?.currentSrc || !video.currentTime) return;
      try {
        sessionStorage.setItem(`${playbackKey}:${video.currentSrc}`, String(video.currentTime));
      } catch {
        // Playback still works when the browser blocks session storage.
      }
    }

    const projectVideo = activeVideo();
    const hero = projectVideo?.hasAttribute('data-work-project-video') ? projectVideo : null;
    let fallbackTimer: number | undefined;

    function sourceKey(video: HTMLVideoElement) {
      const src = video.currentSrc || video.src || video.querySelector('source')?.src;
      return src ? `${playbackKey}:${src}` : null;
    }

    function savedPosition(video: HTMLVideoElement) {
      try {
        const key = sourceKey(video);
        return key ? Number(sessionStorage.getItem(key)) : 0;
      } catch {
        return 0;
      }
    }

    function showFallback() {
      if (!hero) return;
      hero.removeAttribute('data-restoring-frame');
      hero.controls = true;
    }

    function startHero() {
      if (hero?.paused) void hero.play().catch(error => {
        if (error.name !== 'AbortError') showFallback();
      });
    }

    function restore(event?: Event) {
      const video = event?.target instanceof HTMLVideoElement ? event.target : activeVideo();
      if (!video || (event?.type === 'loadedmetadata' && video !== hero)) return;
      const time = savedPosition(video);
      if (Number.isFinite(time) && time > 0 && video.readyState >= 1 && Number.isFinite(video.duration)) {
        try {
          const position = Math.min(time, Math.max(0, video.duration - 0.05));
          if (Math.abs(video.currentTime - position) > 0.05) video.currentTime = position;
          const key = sourceKey(video);
          if (key) sessionStorage.removeItem(key);
        } catch {
          if (video === hero) showFallback();
        }
      }
      if (video === hero) {
        revealHero();
        if (event?.type !== 'play') startHero();
      }
    }

    function revealHero() {
      if (!hero || hero.seeking || hero.readyState < 2 || savedPosition(hero) > 0) return;
      hero.removeAttribute('data-restoring-frame');
      window.clearTimeout(fallbackTimer);
    }

    if (hero && savedPosition(hero) > 0) {
      hero.setAttribute('data-restoring-frame', '');
      fallbackTimer = window.setTimeout(showFallback, 5000);
    }
    hero?.addEventListener('loadeddata', revealHero);
    hero?.addEventListener('seeked', revealHero);
    hero?.addEventListener('playing', revealHero);
    restore();
    window.addEventListener('pagehide', save);
    window.addEventListener('pageshow', restore);
    document.addEventListener('loadedmetadata', restore, true);
    document.addEventListener('play', restore, true);
    return () => {
      window.clearTimeout(fallbackTimer);
      hero?.removeEventListener('loadeddata', revealHero);
      hero?.removeEventListener('seeked', revealHero);
      hero?.removeEventListener('playing', revealHero);
      window.removeEventListener('pagehide', save);
      window.removeEventListener('pageshow', restore);
      document.removeEventListener('loadedmetadata', restore, true);
      document.removeEventListener('play', restore, true);
    };
  }, []);

  return <style>{`
    @media (prefers-reduced-motion: no-preference) {
      @view-transition { navigation: auto; }
      ::view-transition-group(work-project-media) {
        animation-duration: 500ms;
        animation-timing-function: var(--e-standard, ease-in-out);
      }
      ::view-transition-group(root) { animation-duration: 500ms; }
    }
  `}</style>;
}
