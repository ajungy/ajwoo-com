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

    function restore(event?: Event) {
      const video = event?.target instanceof HTMLVideoElement ? event.target : activeVideo();
      if (!video?.currentSrc || video.readyState < 1) return;
      // Carousel videos preload together. Restore a thumbnail when it plays.
      if (event?.type === 'loadedmetadata' && !video.autoplay) return;
      try {
        const key = `${playbackKey}:${video.currentSrc}`;
        const time = Number(sessionStorage.getItem(key));
        if (!Number.isFinite(time) || time <= 0) return;
        video.currentTime = Math.min(time, video.duration);
        sessionStorage.removeItem(key);
      } catch {
        // Let the video start normally if the saved position is unavailable.
      }
    }

    restore();
    window.addEventListener('pagehide', save);
    window.addEventListener('pageshow', restore);
    document.addEventListener('loadedmetadata', restore, true);
    document.addEventListener('play', restore, true);
    return () => {
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
