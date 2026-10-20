'use client';

import Link from 'next/link';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Picture } from '@/components/Picture';
import styles from './CoffeeCarousel.module.css';
import { LiquidGlassLens } from './LiquidGlassLens';

type CoffeeSlide = {
  slug: string;
  title: string;
  category: string;
  image: { base: string; width: number; height: number };
};

/** Native scroll-snap gallery with the MIT-licensed Componentry lens shader. */
export function CoffeeCarousel({ slides }: { slides: CoffeeSlide[] }) {
  const rail = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const requestedIndex = useRef(slides.length);
  const loopSlides = [...slides, ...slides, ...slides];
  const moveRef = useRef<(direction: number) => void>(() => {});

  // Three copies keep both neighbors present across either loop boundary.
  // Rebase to the identical middle copy only after a slide is centered.
  useLayoutEffect(() => {
    const track = rail.current;
    if (!track) return;
    const center = () => {
      const card = track.children[requestedIndex.current] as HTMLElement;
      if (card) track.scrollTo({ left: card.offsetLeft - (track.clientWidth - card.clientWidth) / 2, behavior: 'instant' });
    };
    center();
    const resize = new ResizeObserver(center);
    resize.observe(track);
    return () => resize.disconnect();
  }, [slides.length]);

  useEffect(() => {
    const track = rail.current;
    if (!track) return;
    let end: ReturnType<typeof setTimeout>;
    let handled = false;
    let distance = 0;
    function wheel(event: WheelEvent) {
      if (event.ctrlKey || (event.target as Element).closest('[role="dialog"], [role="menu"], textarea, input, select')) return;
      event.preventDefault();
      clearTimeout(end);
      end = setTimeout(() => { handled = false; distance = 0; }, 300);
      if (handled) return;
      const delta = Math.abs(event.deltaY) > Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
      distance += delta * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? track!.clientWidth : 1);
      if (Math.abs(distance) < 4) return;
      handled = true;
      moveRef.current(Math.sign(distance));
      distance = 0;
    }
    window.addEventListener('wheel', wheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', wheel);
      clearTimeout(end);
      track.style.scrollSnapType = '';
    };
  }, []);

  function move(direction: number) {
    const next = requestedIndex.current + direction;
    requestedIndex.current = next;
    const card = rail.current?.children[next] as HTMLElement | undefined;
    if (!card || !rail.current) return;
    rail.current.scrollTo({
      left: card.offsetLeft - (rail.current.clientWidth - card.clientWidth) / 2,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    });
  }

  moveRef.current = move;

  return (
    <section aria-label="Coffee reviews" aria-roledescription="carousel" className={`${styles.gallery} coffee-entrance`}
      onKeyDown={(event) => {
        if (['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'].includes(event.key)) {
          event.preventDefault();
          move(event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : -1);
        }
      }}>
      <div className={`${styles.caption} route-intro`} aria-live="polite" aria-atomic="true">
        <h2 className="text-title text-fg">{slides[active]?.title}</h2>
      </div>
      <div className={`${styles.stage} route-media`}>
      <div
        ref={rail}
        className={styles.rail}
        onScroll={() => {
          const el = rail.current;
          if (!el) return;
          const center = el.scrollLeft + el.clientWidth / 2;
          const cards = Array.from(el.children) as HTMLElement[];
          const nearest = cards.reduce((best, card, i) =>
            Math.abs(card.offsetLeft + card.clientWidth / 2 - center) <
            Math.abs(cards[best].offsetLeft + cards[best].clientWidth / 2 - center) ? i : best, 0);
          setActive(nearest % slides.length);
          const centered = cards[nearest].offsetLeft - (el.clientWidth - cards[nearest].clientWidth) / 2;
          if (Math.abs(el.scrollLeft - centered) < 1 && (nearest < slides.length || nearest >= slides.length * 2)) {
            const middle = slides.length + nearest % slides.length;
            requestedIndex.current = middle;
            el.scrollTo({ left: cards[middle].offsetLeft - (el.clientWidth - cards[middle].clientWidth) / 2, behavior: 'instant' });
          }
        }}
      >
        {loopSlides.map((slide, i) => (
          <Link
            key={`${i}-${slide.slug}`}
            href={`/work/${slide.slug}/`}
            className={styles.card}
            tabIndex={i >= slides.length && i < slides.length * 2 ? 0 : -1}
            aria-hidden={i < slides.length || i >= slides.length * 2 ? true : undefined}
            onFocus={(event) => {
              requestedIndex.current = i;
              const card = event.currentTarget;
              rail.current?.scrollTo({ left: card.offsetLeft - (rail.current.clientWidth - card.clientWidth) / 2, behavior: 'instant' });
            }}
            aria-label={`Read ${slide.title}`}
            data-cursor-label="Read review"
          >
            <Picture img={slide.image} alt={slide.title} priority={Math.abs(i - slides.length) <= 2}
              sizes="(max-width: 599px) 82vw, (max-width: 900px) 65vw, 520px"
              className={styles.image} />
          </Link>
        ))}
      </div>
      <LiquidGlassLens rail={rail} />
      </div>
      <div className={`${styles.controls} route-navigation`}>
        <button type="button" onClick={() => move(-1)} className={styles.arrow} aria-label="Previous coffee review" title="Previous coffee review">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m14 6-6 6 6 6" stroke="currentColor" strokeWidth="1.5" /></svg>
        </button>
        <p className="text-caption tabular-nums text-fg-secondary" aria-live="polite" aria-atomic="true">{String(active + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</p>
        <button type="button" onClick={() => move(1)} className={styles.arrow} aria-label="Next coffee review" title="Next coffee review">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m10 6 6 6-6 6" stroke="currentColor" strokeWidth="1.5" /></svg>
        </button>
      </div>
    </section>
  );
}
