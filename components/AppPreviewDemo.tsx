'use client';

import { useState, type ReactNode } from 'react';
import { arrivingVideo } from '@/lib/preview-flight';
import { PreviewVideo } from './PreviewVideo';

// Direct visits keep the original demo. Coming from a playing card continues
// its local clip, with the full-length demo still available in the same place.
export function AppPreviewDemo({ base, href, name, separateDemo, children }: {
  base: string; href: string; name: string; separateDemo: boolean; children: ReactNode;
}) {
  const [size, setSize] = useState(() => {
    const video = typeof window !== 'undefined' && arrivingVideo(base, href);
    return video ? { width: video.videoWidth || 1, height: video.videoHeight || 1 } : null;
  });
  if (!size) return <>{children}</>;
  return <div className="detail-hero-media mb-[var(--section-gap)]">
    <PreviewVideo base={base} href={href} detail webm controls {...size} label={name + ' preview'} className="w-full rounded-lg" />
    {separateDemo && <button className="mt-6 underline underline-offset-4" type="button" onClick={() => setSize(null)}>Watch full demo</button>}
  </div>;
}
