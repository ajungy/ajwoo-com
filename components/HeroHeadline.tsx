'use client';

import { useEffect, useRef, useState } from 'react';

/** Keep the headline's shaping and sizing stable before revealing it. */
export function HeroHeadline({ children }: { children: string }) {
  const headline = useRef<HTMLHeadingElement>(null);
  const [ready, setReady] = useState(false);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    try { sessionStorage.setItem('home-intro-seen', '1'); } catch {}
    const skip = () => document.documentElement.removeAttribute('data-hero-motion');
    window.addEventListener('pagehide', skip);
    // A back/forward cache restore resumes the original DOM and CSS timeline.
    function replay(event: PageTransitionEvent) {
      if (!event.persisted || !window.matchMedia('(prefers-reduced-motion: no-preference)').matches) return;
      const column = headline.current?.closest<HTMLElement>('.hero-col');
      const animation = column?.getAnimations().find(
        candidate => candidate instanceof CSSAnimation && candidate.animationName === 'route-content-in',
      );
      if (animation) {
        animation.currentTime = 0;
        animation.play();
      }
    }
    window.addEventListener('pageshow', replay);
    return () => {
      window.removeEventListener('pagehide', skip);
      window.removeEventListener('pageshow', replay);
    };
  }, []);

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
    <h1 ref={headline} className="hero-serif hero-headline text-fg" data-ready={ready}
      style={fallback ? { fontFamily: 'Georgia, "Times New Roman", serif' } : undefined}>
      {children}
    </h1>
  );
}
