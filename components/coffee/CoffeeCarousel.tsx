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
  const drag = useRef<{ id: number; x: number; y: number } | null>(null);
  const suppressClick = useRef(false);
  const requestedIndex = useRef(slides.length);
  const loopSlides = [...slides, ...slides, ...slides];
  const motion = useRef(0);
  const idle = useRef<ReturnType<typeof setTimeout>>();
  function interrupt() {
    cancelAnimationFrame(motion.current);
    clearTimeout(idle.current);
  }

  function settle(track: HTMLDivElement) {
    interrupt();
    const start = track.scrollLeft;
    const center = start + track.clientWidth / 2;
    const cards = Array.from(track.children) as HTMLElement[];
    if (!cards.length) return;
    const distance = (card: HTMLElement) => card.offsetLeft + card.clientWidth / 2 - center;
    const nearest = cards.reduce((a, b) => Math.abs(distance(a)) <= Math.abs(distance(b)) ? a : b);
    const delta = distance(nearest);
    const duration = Math.min(380, Math.max(180, Math.abs(delta) * 2));
    const began = performance.now();
    function frame(now: number) {
      const t = Math.min(1, (now - began) / duration);
      track.scrollLeft = start + delta * t * t * (3 - 2 * t);
      if (t < 1) motion.current = requestAnimationFrame(frame);
      else track.style.scrollSnapType = '';
    }
    if (Math.abs(delta) < 1 || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      track.scrollLeft = start + delta;
      track.style.scrollSnapType = '';
    } else motion.current = requestAnimationFrame(frame);
  }

  function scrollByGesture(track: HTMLDivElement, delta: number) {
    const first = track.children[0] as HTMLElement;
    const middle = track.children[slides.length] as HTMLElement;
    if (!middle) return;
    const cycle = middle.offsetLeft - first.offsetLeft;
    if (!cycle) return;
    track.style.scrollSnapType = 'none';
    const origin = middle.offsetLeft - (track.clientWidth - middle.clientWidth) / 2;
    const offset = track.scrollLeft + delta - origin;
    track.scrollLeft = origin + ((offset % cycle) + cycle) % cycle;
  }

  // Three copies keep both neighbors present across either loop boundary.
  // Rebase to the identical middle copy only after a slide is centered.
  useLayoutEffect(() => {
    const track = rail.current;
    if (!track) return;
    const center = () => {
      const card = track.children[requestedIndex.current] as HTMLElement;
      if (card) track.scrollTo({ left: card.offsetLeft - (track.clientWidth - card.clientWidth) / 2, behavior: 'instant' });
    };
    const restored = slides.findIndex(slide => '#' + slide.slug === location.hash);
    if (restored >= 0) {
      requestedIndex.current = slides.length + restored;
      setActive(restored);
    }
    center();
    if (restored >= 0 && history.state?.galleryReturn) {
      (track.children[requestedIndex.current] as HTMLElement)?.focus({ preventScroll: true });
    }
    const resize = new ResizeObserver(center);
    resize.observe(track);
    return () => resize.disconnect();
  }, [slides.length]);

  useEffect(() => {
    const track = rail.current;
    if (!track) return;

    function wheel(event: WheelEvent) {
      if (!track || event.ctrlKey || (event.target as Element).closest('[role="dialog"], [role="menu"], textarea, input, select')) return;
      const delta = Math.abs(event.deltaY) > Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
      if (!delta) return;
      event.preventDefault();
      interrupt();
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? track.clientWidth : 1;
      scrollByGesture(track, delta * unit * 2);
      idle.current = setTimeout(() => settle(track), 100);
    }
    window.addEventListener('wheel', wheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', wheel);
      interrupt();
      track.style.scrollSnapType = '';
    };
  }, [slides.length]);

  function move(direction: number) {
    interrupt();
    if (rail.current) rail.current.style.scrollSnapType = '';
    const next = Math.max(0, Math.min(loopSlides.length - 1, requestedIndex.current + direction));
    requestedIndex.current = next;
    const card = rail.current?.children[next] as HTMLElement | undefined;
    if (!card || !rail.current) return;
    rail.current.scrollTo({
      left: card.offsetLeft - (rail.current.clientWidth - card.clientWidth) / 2,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    });
  }



  return (
    <section aria-label="Coffee reviews" aria-roledescription="carousel" className={`${styles.gallery} coffee-entrance`}
      onKeyDown={(event) => {
        if (['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'].includes(event.key)) {
          event.preventDefault();
          const direction = event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : -1;
          if (rail.current?.contains(event.target as Element)) {
            const index = (active + direction + slides.length) % slides.length;
            const card = rail.current.children[slides.length + index] as HTMLElement;
            card.focus({ preventScroll: true });
            setActive(index);
          } else move(direction);
        }
      }}>
      <div className={`${styles.stage} route-media`}>
      <div
        ref={rail}
        className={styles.rail}
        onDragStart={(event) => event.preventDefault()}
        onPointerDown={(event) => {
          // Touch keeps the rail's native scrolling and snap behavior.
          interrupt();
          if (event.pointerType === 'touch') event.currentTarget.style.scrollSnapType = '';
          suppressClick.current = false;
          if (event.pointerType === 'touch' || event.button !== 0 || !event.isPrimary) return;
          drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
        }}
        onPointerMove={(event) => {
          const start = drag.current;
          if (!start || start.id !== event.pointerId) return;
          const dx = event.clientX - start.x;
          const dy = event.clientY - start.y;
          if (!suppressClick.current && (Math.abs(dx) < 5 || Math.abs(dx) <= Math.abs(dy))) return;
          event.preventDefault();
          suppressClick.current = true;
          event.currentTarget.setPointerCapture(event.pointerId);
          scrollByGesture(event.currentTarget, -dx * 1.5);
          start.x = event.clientX;
          start.y = event.clientY;
        }}
        onPointerUp={(event) => {
          const start = drag.current;
          if (!start || start.id !== event.pointerId) return;
          drag.current = null;
          if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
          if (event.currentTarget.style.scrollSnapType) settle(event.currentTarget);
        }}
        onPointerCancel={() => { if (drag.current && rail.current?.style.scrollSnapType) settle(rail.current); drag.current = null; }}
        onLostPointerCapture={() => { if (drag.current && rail.current?.style.scrollSnapType) settle(rail.current); drag.current = null; }}
        onClickCapture={(event) => {
          if (!suppressClick.current) return;
          event.preventDefault();
          event.stopPropagation();
          suppressClick.current = false;
        }}
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
          if (Math.abs(el.scrollLeft - centered) < 1) requestedIndex.current = nearest;
          if (!el.style.scrollSnapType && Math.abs(el.scrollLeft - centered) < 1 && (nearest < slides.length || nearest >= slides.length * 2)) {
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
            tabIndex={i === slides.length + active ? 0 : -1}
            aria-hidden={i < slides.length || i >= slides.length * 2 ? true : undefined}
            onFocus={(event) => {
              if (!event.currentTarget.matches(':focus-visible')) return;
              interrupt();
              if (rail.current) rail.current.style.scrollSnapType = '';
              requestedIndex.current = i;
              const card = event.currentTarget;
              rail.current?.scrollTo({ left: card.offsetLeft - (rail.current.clientWidth - card.clientWidth) / 2, behavior: 'instant' });
            }}
            onClick={() => history.replaceState({ ...history.state, galleryReturn: true }, '', '#' + slide.slug)}
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
      <div className={styles.details}>
        <div className={`${styles.caption} route-intro`} aria-live="polite" aria-atomic="true">
          <h2 className="type-decision">{slides[active]?.title}</h2>
        </div>
        <div className={`${styles.controls} route-navigation`}>
          <button type="button" onClick={() => move(-1)} className={styles.arrow} aria-label="Previous coffee review" title="Previous coffee review">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m14 6-6 6 6 6" stroke="currentColor" strokeWidth="1.5" /></svg>
          </button>
          <p className="type-caption tabular-nums" aria-live="polite" aria-atomic="true">{String(active + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</p>
          <button type="button" onClick={() => move(1)} className={styles.arrow} aria-label="Next coffee review" title="Next coffee review">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m10 6 6 6-6 6" stroke="currentColor" strokeWidth="1.5" /></svg>
          </button>
        </div>
      </div>
    </section>
  );
}
