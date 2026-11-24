"use client";
import { PreviewVideo } from '../PreviewVideo';
import * as React from "react";
import { CarouselControls } from "../CarouselControls";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

interface Slide {
  src: string;
  title: string;
  video?: { base: string; hasWebm: boolean; width: number; height: number };
  href: string;
}

const INITIAL_CENTER_SCALE = 1.92;

export function CoverflowCarousel({ slides }: { slides: Slide[] }) {
  const rotate = 44, depth = 0.6, falloff = 0.56, gap = 0.35225, loop = true;
  const didDrag = React.useRef(false);
  const count = slides.length;

  const frameRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  /** Fractional card index at the centre. The single source of truth. */
  const posRef = React.useRef(0);
  /** Where the current settle is headed. Stepping off `pos` instead would
      swallow a keypress that lands mid-flight, before the round-off moves. */
  const targetRef = React.useRef(0);
  const widthRef = React.useRef(0);
  const pitchRef = React.useRef(0);
  const centerWidthRef = React.useRef<HTMLSpanElement>(null);
  const centerScaleRef = React.useRef(INITIAL_CENTER_SCALE);
  const rafRef = React.useRef<number | null>(null);
  const dragRef = React.useRef<{
    id: number;
    x: number;
    pos: number;
    v: number;
    t: number;
  } | null>(null);

  const [selected, setSelected] = React.useState(0);

  /** Nearest whole card, folded back into 0..count-1. */
  const indexAt = React.useCallback(
    (pos: number) => ((Math.round(pos) % count) + count) % count,
    [count],
  );

  const inView = React.useRef(false);
  const playingVideo = React.useRef<HTMLVideoElement | null>(null);

  // Paint straight to the DOM. Sixty state updates a second would re-render
  // every card for numbers React never needs to see.
  const paint = React.useCallback(() => {
    const width = widthRef.current;
    if (!width) return;
    const pitch = pitchRef.current;
    const pos = posRef.current;

    const centered = Math.round(pos);
    const video = inView.current && !document.hidden && Math.abs(pos - centered) < 0.001
      ? cardRefs.current[indexAt(centered)]?.querySelector('video') ?? null
      : null;
    if (video !== playingVideo.current) {
      if (!playingVideo.current?.closest('.preview-flight')) playingVideo.current?.pause();
      playingVideo.current = video;
    }
    if (video?.paused && !document.hidden) void video.play().catch(() => {});

    cardRefs.current.forEach((card, index) => {
      if (!card) return;

      // Fold the distance into the shorter way round the ring. This is the
      // whole looping mechanism — no cloned nodes, no shuffling the DOM.
      let offset = index - pos;
      if (loop) {
        offset = ((offset % count) + count) % count;
        if (offset > count / 2) offset -= count;
      }

      const distance = Math.abs(offset);
      // Both the tilt and the recession ease off as cards travel out —
      // doubling the distance adds only about half again as much of each.
      // A linear ramp folds the second card shut; this keeps it readable.
      const ramp = Math.pow(distance, falloff);
      // Capped short of edge-on so a far card never turns its back.
      const tilt = Math.min(rotate * ramp, 82) * Math.sign(offset);

      const centerBoost = (centerScaleRef.current - 1) * Math.max(0, 1 - distance);
      const sideBoost = 0.2 * Math.max(0, 1 - Math.abs(distance - 1));
      const scale = 1 + centerBoost + sideBoost - 0.2 * Math.min(1, Math.max(0, distance - 1));
      // Tuck each outer thumbnail behind its nearer neighbor.
      const travel = 0.88 * Math.min(distance, 1) + 0.70 * Math.min(Math.max(distance - 1, 0), 1);
      const horizontalOffset = Math.sign(offset) * travel * pitch;
      card.style.transform =
        `translateX(calc(-50% + ${horizontalOffset}px)) ` +
        `translateZ(${-depth * width * ramp}px) rotateY(${-tilt}deg) scale(${scale})`;

      // A card is teleported across the ring at exactly half a turn out, so it
      // has to be gone by then or the jump is visible.
      const edge = loop ? Math.min(1, Math.max(0, (count / 2 - distance) * 2)) : 1;
      const opacity = Math.max(0.2, 1 - 0.4 * distance);
      card.style.opacity = String(opacity * edge);
      card.style.zIndex = String(100 - Math.round(distance));
    });
  }, [count, depth, falloff, gap, indexAt, loop, rotate]);

  const settle = React.useCallback(
    (target: number) => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      targetRef.current = target;
      setSelected(indexAt(target));

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        posRef.current = target;
        paint();
        return;
      }
      const step = () => {
        const remaining = target - posRef.current;
        if (Math.abs(remaining) < 0.0004) {
          posRef.current = target;
          paint();
          rafRef.current = null;
          return;
        }
        // ponytail: exponential ease-out, not a spring. Swap in a spring only
        // if the settle needs overshoot.
        posRef.current += remaining * 0.16;
        paint();
        rafRef.current = requestAnimationFrame(step);
      };
      rafRef.current = requestAnimationFrame(step);
    },
    [indexAt, paint],
  );

  const clamp = React.useCallback(
    (pos: number) => (loop ? pos : Math.max(0, Math.min(count - 1, pos))),
    [count, loop],
  );

  const nudge = React.useCallback(
    (by: number) => settle(clamp(Math.round(targetRef.current) + by)),
    [clamp, settle],
  );

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (!event.isPrimary || event.button !== 0) return;
    didDrag.current = false;
    targetRef.current = posRef.current;
    dragRef.current = {
      id: event.pointerId,
      x: event.clientX,
      pos: posRef.current,
      v: 0,
      t: performance.now(),
    };
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;

    if (!didDrag.current && Math.abs(event.clientX - drag.x) < 6) return;
    didDrag.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    const pitch = pitchRef.current;
    if (!pitch) return;

    const now = performance.now();
    const previous = posRef.current;
    posRef.current = clamp(drag.pos - (event.clientX - drag.x) / pitch);
    // Cards per second, for the throw.
    drag.v = ((posRef.current - previous) / Math.max(now - drag.t, 1)) * 1000;
    drag.t = now;

    const index = indexAt(posRef.current);
    if (index !== selected) setSelected(index);
    paint();
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    dragRef.current = null;
    // Let a flick carry, but never more than two cards.
    const carried = Math.max(-2, Math.min(2, drag.v * 0.18));
    settle(clamp(Math.round(posRef.current + carried)));
  };

  useIsoLayoutEffect(() => {
    const restored = slides.findIndex(slide => slide.href === history.state?.homeWorkProject);
    if (restored >= 0) {
      posRef.current = restored;
      targetRef.current = restored;
      setSelected(restored);
    }

    function rememberProject() {
      const project = slides[indexAt(targetRef.current)];
      if (project) history.replaceState({ ...history.state, homeWorkProject: project.href }, '');
    }

    window.addEventListener('pagehide', rememberProject);
    return () => window.removeEventListener('pagehide', rememberProject);
  }, [indexAt, slides]);

  React.useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      inView.current = entry.isIntersecting;
      paint();
    });
    if (frameRef.current) observer.observe(frameRef.current);
    window.addEventListener('pageshow', paint);
    document.addEventListener('visibilitychange', paint);
    return () => {
      observer.disconnect();
      window.removeEventListener('pageshow', paint);
      document.removeEventListener('visibilitychange', paint);
    };
  }, [paint]);

  // Measure the base card and the responsive reading column together.
  useIsoLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const measure = () => {
      const card = cardRefs.current[0];
      if (!card?.offsetWidth || !centerWidthRef.current) return;
      const baseWidth = Number.parseFloat(getComputedStyle(card).width);
      widthRef.current = baseWidth;
      // Keep the neighboring cards within reach on narrow screens without resizing them.
      pitchRef.current = Math.min(baseWidth, frame.clientWidth * 0.45) * (1 + gap);
      centerScaleRef.current = centerWidthRef.current.getBoundingClientRect().width / baseWidth;
      paint();
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    if (centerWidthRef.current) observer.observe(centerWidthRef.current);
    return () => observer.disconnect();
  }, [gap, paint]);

  React.useEffect(
    () => () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  const heightRatios = slides.map(({ video }) => video ? video.height / video.width : 1);
  const stageRatio = Math.max(...heightRatios);

  const active = slides[selected];
  if (!active) return null;
  return (
    <div role="region" aria-label="Selected work" aria-roledescription="carousel"
      className="work-coverflow">
      <div ref={frameRef} tabIndex={0} aria-label="Browse projects with the arrow keys"
        className="relative overflow-hidden py-6 cursor-grab active:cursor-grabbing"
        style={{ perspective: 'calc(var(--card) * 3)', touchAction: 'pan-y' }}
        onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={endDrag} onPointerCancel={endDrag}
        onClickCapture={e => { if (didDrag.current && e.detail) { e.preventDefault(); e.stopPropagation(); } }}
        onKeyDown={e => { if (['ArrowLeft','ArrowRight'].includes(e.key)) { e.preventDefault(); nudge(e.key === 'ArrowLeft' ? -1 : 1); } }}>
        <span ref={centerWidthRef} aria-hidden="true" className="pointer-events-none invisible absolute w-[var(--center-width)]" />
        <div className="relative select-none" style={{ height: `calc(max(var(--center-width), var(--card) * 1.2) * ${stageRatio})`, transformStyle: 'preserve-3d' }}>
          {slides.map((slide, i) => (
            <div key={slide.href} ref={node => { cardRefs.current[i] = node; }}
              data-focused={i === selected || undefined}
              className="work-coverflow-card absolute left-1/2 top-1/2 overflow-hidden rounded-control"
              style={{ viewTransitionName: i === selected ? 'work-project-media' : undefined, width: 'var(--card)', height: `calc(var(--card) * ${heightRatios[i]})`, marginTop: `calc(var(--card) * ${-heightRatios[i] / 2})`, transform: i === 0 ? `translateX(-50%) scale(${INITIAL_CENTER_SCALE})` : 'translateX(-50%)', opacity: i === 0 ? 1 : 0 }}>
              <a data-work-preview-link={slide.video ? true : undefined} className="block h-full" href={slide.href} draggable={false} aria-label={slide.title} tabIndex={i === selected ? 0 : -1}>
                {slide.video ? (
                  <PreviewVideo base={slide.video.base} href={slide.href} className="h-full w-full" />
                ) : (
                  <img src={slide.src} alt={slide.title} draggable={false} className="block h-full w-full object-cover" />
                )}
              </a>
            </div>
          ))}
        </div>
      </div>
      <div aria-live="polite" className="mx-auto max-w-content px-page text-center">
        <h3 className="type-decision"><a data-work-preview-link={active.video ? true : undefined} href={active.href}>{active.title}</a></h3>
      </div>
      <CarouselControls count={count} index={selected} go={nudge}
        setIndex={i => settle(i + Math.round((targetRef.current - i) / count) * count)} />
    </div>
  );
}
