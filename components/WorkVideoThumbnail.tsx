'use client';

import { useEffect, useRef } from 'react';
import type { Ref } from 'react';

// The padded exports have a baked-in matte. Clip at the footage edges
// (measured in the 720px asset) so the radius stays 4 CSS pixels at any size.
const footageInsets: Record<string, readonly [number, number, number, number]> = {
  'mov-netflix-creative-tools': [174, 36, 176, 36],
  'mov-premiere-generative-ai': [118, 36, 118, 34],
  'mov-frameio-premiere-after-effects': [176, 36, 176, 34],
  'mov-product-visualize': [34, 82, 36, 82],
  'mov-seeing-ai-chair': [86, 36, 88, 34],
};

export function fullWidthFootage(base: string) {
  const inset = footageInsets[base];
  if (!inset) return undefined;
  const [top, right, bottom, left] = inset.map(px => px + 7);
  return {
    top,
    left,
    width: 720 - left - right,
    height: 720 - top - bottom - (base === 'mov-frameio-premiere-after-effects' ? 10 : 0),
  };
}

/** Keep the last decoded frame on the card across pauses, seeks and loop boundaries. */
export function WorkVideoThumbnail({ base, hasWebm, videoRef, fullWidth }: {
  base: string;
  hasWebm: boolean;
  fullWidth?: boolean;
  videoRef?: Ref<HTMLVideoElement>;
}) {
  const surface = useRef<HTMLSpanElement>(null);
  const poster = `/img/${base}-poster.webp`;

  const crop = fullWidth ? fullWidthFootage(base) : undefined;
  const inset = crop ? undefined : footageInsets[base];
  const footageBounds = inset?.map((px, edge) => {
    // Inset past the matte transition, including resampling on smaller cards.
    const offset = `calc(${(px + 4) / 720 * 100}% + 1px)`;
    // Trim the light strip embedded along the Frame.io footage's bottom edge.
    return base === 'mov-frameio-premiere-after-effects' && edge === 2
      ? `calc(${offset} + 4px)`
      : offset;
  }).join(' ');
  const clipPath = `inset(${footageBounds ?? '0'} round 4px)`;

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

  return <span ref={surface} className="relative block h-full w-full" style={inset ? { containerType: 'inline-size' } : undefined}>
    {footageBounds && <span aria-hidden="true" className="pointer-events-none absolute rounded-[4px]" style={{ inset: footageBounds, boxShadow: 'var(--work-video-shadow)' }} />}
    <span className={crop ? 'absolute block' : 'contents'} style={crop && {
      width: `${720 / crop.width * 100}%`,
      height: `${720 / crop.height * 100}%`,
      left: `${-crop.left / crop.width * 100}%`,
      top: `${-crop.top / crop.height * 100}%`,
    }}>
      <img style={crop ? undefined : { clipPath }} src={poster} alt="" draggable={false} className="block h-full w-full object-cover" />
      <video ref={videoRef} muted loop playsInline preload="metadata" aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-0">
        <source src={`/img/${base}.mp4`} type="video/mp4" />
        {hasWebm && <source src={`/img/${base}.webm`} type="video/webm" />}
      </video>
      <canvas style={crop ? undefined : { clipPath }} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full object-cover" />
    </span>
  </span>;
}
