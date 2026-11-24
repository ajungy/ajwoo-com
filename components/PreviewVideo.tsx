'use client';

import { useLayoutEffect, useRef } from 'react';
import { arrivingVideo, dockPreview } from '@/lib/preview-flight';

export type PreviewProps = {
  base: string;
  href: string;
  detail?: boolean;
  width?: number;
  height?: number;
  label?: string;
  className?: string;
  controls?: boolean;
  webm?: boolean;
  videoRef?: (video: HTMLVideoElement | null, continued: boolean) => void;
};

export function PreviewVideo({ base, href, detail, width, height, label, className, controls, webm, videoRef }: PreviewProps) {
  const slot = useRef<HTMLSpanElement>(null);
  const callback = useRef(videoRef);
  callback.current = videoRef;
  const poster = '/img/' + base + '-poster.webp';

  useLayoutEffect(() => {
    const host = slot.current!;
    const incoming = arrivingVideo(base);
    const video = incoming ?? document.createElement('video');
    if (!incoming) {
      video.defaultMuted = true;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = detail ? 'auto' : 'none';
      video.poster = poster;
      if (webm) {
        for (const format of ['webm', 'mp4']) {
          const source = document.createElement('source');
          source.type = 'video/' + format;
          source.src = '/img/' + base + '.' + format;
          video.appendChild(source);
        }
      } else {
        video.src = '/img/' + base + '.mp4';
      }
      host.appendChild(video);
    }
    video.controls = Boolean(controls);
    if (label) video.setAttribute('aria-label', label);
    else video.removeAttribute('aria-label');
    if (detail) video.removeAttribute('aria-hidden');
    else video.setAttribute('aria-hidden', 'true');
    video.toggleAttribute('data-work-project-video', Boolean(detail && href.startsWith('/work/')));
    if (incoming) dockPreview(host);
    if (detail) void video.play().catch(error => {
      if (error.name !== 'AbortError') video.controls = true;
    });
    callback.current?.(video, Boolean(incoming));
    return () => {
      callback.current?.(null, false);
      if (video.parentElement === host) {
        video.pause();
        video.remove();
      }
    };
  }, [base, href, detail, label, controls, poster, webm]);

  return <span ref={slot} data-preview={base}
    data-preview-link={detail ? undefined : href} data-preview-detail={detail ? href : undefined}
    className={'preview-slot ' + (className ?? '')}
    style={{ aspectRatio: width && height ? width + ' / ' + height : undefined, viewTransitionName: detail && href.startsWith('/work/') ? 'work-project-media' : undefined }}>
    <img src={poster} width={width} height={height} alt={detail ? label : ''} draggable={false} />
    {detail && <noscript><video controls playsInline muted poster={poster} src={'/img/' + base + '.mp4'} /></noscript>}
  </span>;
}
