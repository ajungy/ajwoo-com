'use client';

import { useEffect, useRef } from 'react';
import type { Ref } from 'react';

/** Keep the last decoded frame on the card across pauses, seeks and loop boundaries. */
export function WorkVideoThumbnail({ base, hasWebm, videoRef }: {
  base: string;
  hasWebm: boolean;
  videoRef?: Ref<HTMLVideoElement>;
}) {
  const surface = useRef<HTMLSpanElement>(null);
  const poster = `/img/${base}-poster.webp`;

  useEffect(() => {
    const video = surface.current?.querySelector('video');
    const canvas = surface.current?.querySelector('canvas');
    const ctx = canvas?.getContext('2d');
    if (!video || !canvas || !ctx) return;

    let cancel: (() => void) | undefined;
    function stop() {
      cancel?.();
      cancel = undefined;
    }
    function paint() {
      stop();
      if (!video || !canvas || !ctx || video.paused) return;
      if (!video.seeking && video.readyState >= 2 && video.videoWidth) {
        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }
        ctx.drawImage(video, 0, 0);
      }
      schedule();
    }
    function schedule() {
      stop();
      if (!video || video.paused) return;
      if (typeof video.requestVideoFrameCallback === 'function') {
        const id = video.requestVideoFrameCallback(paint);
        cancel = () => video.cancelVideoFrameCallback(id);
      } else {
        const id = requestAnimationFrame(paint);
        cancel = () => cancelAnimationFrame(id);
      }
    }
    video.addEventListener('playing', schedule);
    video.addEventListener('pause', stop);
    schedule();
    return () => {
      stop();
      video.removeEventListener('playing', schedule);
      video.removeEventListener('pause', stop);
    };
  }, [base]);

  return <span ref={surface} className="relative block h-full w-full">
    <img src={poster} alt="" draggable={false} className="block h-full w-full object-cover" />
    <video ref={videoRef} muted loop playsInline preload="metadata" aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-0">
      <source src={`/img/${base}.mp4`} type="video/mp4" />
      {hasWebm && <source src={`/img/${base}.webm`} type="video/webm" />}
    </video>
    <canvas aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full object-cover" />
  </span>;
}
