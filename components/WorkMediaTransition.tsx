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
      const isProjectVideo = video.hasAttribute('data-work-project-video');
      if (event?.type === 'loadedmetadata' && !isProjectVideo) return;
      const key = `${playbackKey}:${video.currentSrc}`;
      try {
        const time = Number(sessionStorage.getItem(key));
        if (Number.isFinite(time) && time > 0 && Number.isFinite(video.duration)) {
          const position = Math.min(time, Math.max(0, video.duration - 0.05));
          if (Math.abs(video.currentTime - position) > 0.05) video.currentTime = position;
          sessionStorage.removeItem(key);
        }
      } catch {
        // Play normally when storage or seeking is unavailable.
      }
      if (isProjectVideo) reveal(video);
    }

    function reveal(event: Event | HTMLVideoElement) {
      const video = event instanceof HTMLVideoElement ? event : event.target;
      if (!(video instanceof HTMLVideoElement) || !video.hasAttribute('data-work-project-video')
          || video.seeking || video.readyState < 2) return;
      video.setAttribute('data-frame-ready', '');
      if (video.paused) void video.play().catch(() => {});
    }

    restore();
    document.addEventListener('loadeddata', reveal, true);
    document.addEventListener('seeked', reveal, true);
    window.addEventListener('pagehide', save);
    window.addEventListener('pageshow', restore);
    document.addEventListener('loadedmetadata', restore, true);
    document.addEventListener('play', restore, true);
    return () => {
      document.removeEventListener('loadeddata', reveal, true);
      document.removeEventListener('seeked', reveal, true);
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
