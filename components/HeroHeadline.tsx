'use client';

import { useEffect, useState } from 'react';

/** Keep the headline's shaping and sizing stable before revealing it. */
export function HeroHeadline({ children }: { children: string }) {
  const [ready, setReady] = useState(false);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let frame = 0;
    async function prepare() {
      try {
        const faces = await document.fonts.load('italic 400 80px "EB Garamond"', children);
        if (!cancelled && !faces.length) setFallback(true);
      } catch {
        if (!cancelled) setFallback(true);
      }
      if (!cancelled) frame = requestAnimationFrame(() => setReady(true));
    }
    void prepare();
    return () => { cancelled = true; cancelAnimationFrame(frame); };
  }, [children]);

  return (
    <h1 className="hero-serif hero-headline text-fg" data-ready={ready}
      style={fallback ? { fontFamily: 'Georgia, "Times New Roman", serif' } : undefined}>
      {children}
    </h1>
  );
}
