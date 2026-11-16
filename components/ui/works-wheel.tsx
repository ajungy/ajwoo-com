'use client';

// Geometry adapted from CrafterUI Works Wheel, MIT / Copyright (c) 2026 CrafterUI.
// Full notice: public/licenses/crafterui-MIT.txt. No demo artwork is included.
import { WorkVideoThumbnail } from '../WorkVideoThumbnail';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Picture } from '@/components/Picture';
import styles from './works-wheel.module.css';

export type WorksWheelItem = {
  title: string;
  subtitle: string;
  year: string;
  companyYears?: string[];
  href: string;
  paragraphs?: string[];
  image?: { base: string; width: number; height: number };
  video?: { base: string; width: number; height: number; hasWebm: boolean };
};

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const rad = (v: number) => v * Math.PI / 180;

export function WorksWheel({ items }: { items: WorksWheelItem[] }) {
  const stageRef = useRef<HTMLElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLElement | null)[]>([]);
  const faces = useRef<(HTMLSpanElement | null)[]>([]);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const titleRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLDivElement>(null);
  const turn = useRef(1);
  const target = useRef(1);
  const animate = useRef<() => void>(() => {});
  const dragging = useRef<{ y: number; total: number } | null>(null);
  const suppressClick = useRef(false);
  const settling = useRef<ReturnType<typeof setTimeout>>();
  const [active, setActive] = useState(0);
  const [opened, setOpened] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [stage, setStage] = useState({ w: 0, h: 0 });
  const count = items.length;

  useEffect(() => {
    const selectLinkedProject = () => {
      let slug: string;
      try { slug = decodeURIComponent(window.location.hash.slice(1)); } catch { return; }
      const index = items.findIndex((item) => item.href === `/work/${slug}/` || item.href === `/work/#${slug}`);
      if (index < 0) return;
      target.current = index + 1;
      turn.current = index + 1;
      setActive(index);
      animate.current();
      if (history.state?.galleryReturn) cards.current[index]?.focus({ preventScroll: true });
    };
    selectLinkedProject();
    window.addEventListener('hashchange', selectLinkedProject);
    return () => window.removeEventListener('hashchange', selectLinkedProject);
  }, [items]);

  useEffect(() => {
    const q = matchMedia('(prefers-reduced-motion: reduce)');
    const read = () => setReduced(q.matches);
    read();
    q.addEventListener('change', read);
    return () => q.removeEventListener('change', read);
  }, []);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const resize = new ResizeObserver(() => setStage({ w: el.clientWidth, h: el.clientHeight }));
    resize.observe(el);
    return () => resize.disconnect();
  }, []);

  useEffect(() => {
    const header = document.querySelector('header');
    const title = titleRef.current;
    const el = stageRef.current;
    if (!header || !title || !el) return;
    const measure = () => {
      el.style.setProperty('--wheel-header-height', `${header.getBoundingClientRect().height}px`);
      el.style.setProperty('--wheel-title-height', `${title.getBoundingClientRect().height}px`);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(header);
    observer.observe(title);
    measure();
    return () => observer.disconnect();
  }, []);

  const geometry = useMemo(() => {
    const compact = stage.w < 700;
    const side = Math.min(stage.h * (compact ? 0.42 : 0.54), stage.w * (compact ? 0.76 : 0.36));
    const ringR = side * 0.92;
    return { side, ringR, ringScale: clamp(2 * Math.PI * ringR / Math.max(count, 1) * 0.82 / (side || 1), 0.16, 1), drumR: side * 2.22, bow: side * 1.82, depth: side * 2.7 };
  }, [stage, count]);

  useEffect(() => {
    if (!stage.h) return;
    let frame = 0;
    const draw = () => {
      frame = 0;
      const gap = target.current - turn.current;
      turn.current = Math.abs(gap) < 0.0005 || reduced ? target.current : turn.current + gap * (stage.w < 700 ? 0.075 : 0.12);
      const t = turn.current;
      const m = reduced ? (t > 0 ? 1 : 0) : clamp(t, 0, 1);
      const pos = Math.max(0, t - 1);
      if (wheelRef.current) wheelRef.current.style.transform = `translateZ(${-m * geometry.drumR}px)`;
      items.forEach((_, i) => {
        const d = i - pos;
        const angle = d * -40;
        const card = cards.current[i];
        const face = faces.current[i];
        const ringAngle = d * 360 / count;
        const visible = m <= 0.5 || Math.abs(d) <= 1.6;
        if (card) {
          card.style.transform = `translateX(${-m * geometry.bow * (1 - Math.cos(rad(angle)))}px) rotateZ(${(1 - m) * ringAngle}deg) translateY(${-(1 - m) * geometry.ringR}px) rotateX(${m * angle}deg) translateZ(${m * geometry.drumR}px)`;
          card.style.opacity = visible ? '1' : '0';
          card.style.visibility = visible ? 'visible' : 'hidden';
          card.style.zIndex = String(Math.round(100 - Math.abs(d) * 2));
          card.style.pointerEvents = visible ? 'auto' : 'none';
        }
        if (face) face.style.transform = `scale(${geometry.ringScale + (1 - geometry.ringScale) * m})`;
        const video = videos.current[i];
        if (video) {
          if (Math.abs(t - (i + 1)) < 0.001 && Math.abs(target.current - (i + 1)) < 0.001 && !document.hidden) { if (video.paused) void video.play().catch(() => {}); }
          else if (!video.paused) video.pause();
        }
      });
      if (titleRef.current) { titleRef.current.style.opacity = String(m); titleRef.current.style.visibility = m > 0.05 ? 'visible' : 'hidden'; }
      if (yearRef.current) yearRef.current.style.opacity = String(m);
      const near = clamp(Math.round(pos), 0, count - 1);
      setActive((old) => old === near ? old : near);
      setOpened(m > 0.5);
      if (Math.abs(target.current - turn.current) > 0.0005) frame = requestAnimationFrame(draw);
    };
    const request = () => { if (!frame) frame = requestAnimationFrame(draw); };
    animate.current = request;
    const visibility = () => { if (document.hidden) videos.current.forEach((v) => v?.pause()); else request(); };
    document.addEventListener('visibilitychange', visibility);
    request();
    return () => { cancelAnimationFrame(frame); animate.current = () => {}; document.removeEventListener('visibilitychange', visibility); };
  }, [geometry, stage.h, count, items, reduced]);

  const to = useCallback((next: number) => {
    target.current = clamp(next, 1, count);
    animate.current();
  }, [count]);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const wheel = (event: WheelEvent) => {
      if (event.ctrlKey || (event.target as Element).closest('button, [role="dialog"], [role="menu"]')) return;
      if (event.shiftKey || Math.abs(event.deltaX) >= Math.abs(event.deltaY)) return;
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? el.clientHeight : 1);
      if (!delta) return;
      event.preventDefault();
      to(target.current + delta / (el.clientWidth < 700 ? 1000 : 700));
      clearTimeout(settling.current);
      settling.current = setTimeout(() => to(Math.round(target.current)), 160);
    };
    el.addEventListener('wheel', wheel, { passive: false });
    return () => { el.removeEventListener('wheel', wheel); clearTimeout(settling.current); };
  }, [to]);

  const select = (direction: number) => to(Math.round(target.current) + direction);
  const selected = items[active];
  const projectYears = selected?.year.match(/\d{4}/g) ?? [];
  const highlightedYears = selected?.companyYears ?? projectYears;
  const projectYear = Math.max(...projectYears.map(Number));
  useEffect(() => {
    const rail = yearRef.current;
    const current = rail?.querySelector<HTMLElement>('[aria-current="date"]');
    if (!rail || !current) return;
    const behavior = reduced ? 'instant' : 'smooth';
    if (rail.scrollWidth > rail.clientWidth) {
      rail.scrollTo({ left: current.offsetLeft - (rail.clientWidth - current.offsetWidth) / 2, behavior });
    } else if (rail.scrollHeight > rail.clientHeight) {
      rail.scrollTo({ top: current.offsetTop - rail.offsetTop - (rail.clientHeight - current.offsetHeight) / 2, behavior });
    }
  }, [active, reduced, stage.w, stage.h]);


  return (
    <section ref={stageRef} className={`${styles.stage} work-entrance`} data-ready={stage.w > 0 ? "true" : undefined} tabIndex={0} aria-label="Work projects" aria-roledescription="carousel"
      style={{ perspective: `${geometry.depth || 1000}px` }}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget && (event.target as Element).closest('button')) return;
        const next = ({
          ArrowDown: Math.round(target.current) + 1, ArrowRight: Math.round(target.current) + 1,
          ArrowUp: Math.round(target.current) - 1, ArrowLeft: Math.round(target.current) - 1,
          Home: 1, End: count,
        } as Record<string, number>)[event.key];
        if (next === undefined) return;
        event.preventDefault();
        turn.current = clamp(next, 1, count);
        to(turn.current);
        setActive(turn.current - 1);
        const card = cards.current[turn.current - 1];
        if (card) {
          card.style.visibility = 'visible';
          card.focus({ preventScroll: true });
        }
      }}
      onPointerDown={(event) => {
        if (!event.isPrimary || event.button !== 0 || (event.target as Element).closest('button')) return;
        dragging.current = { y: event.clientY, total: 0 };
        suppressClick.current = false;
      }}
      onPointerMove={(event) => {
        const drag = dragging.current;
        if (!drag) return;
        const delta = drag.y - event.clientY;
        drag.total += Math.abs(delta);
        drag.y = event.clientY;
        if (drag.total > 6) { suppressClick.current = true; event.currentTarget.setPointerCapture(event.pointerId); to(target.current + delta / (event.pointerType === 'touch' ? 120 : 240)); }
      }}
      onPointerUp={(event) => {
        if (!dragging.current) return;
        dragging.current = null;
        if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
        if (suppressClick.current) to(Math.round(target.current));
      }}
      onPointerCancel={() => { dragging.current = null; to(Math.round(target.current)); }}
      onClickCapture={(event) => { if (suppressClick.current && event.detail) { event.preventDefault(); event.stopPropagation(); suppressClick.current = false; return; }
        const link = (event.target as Element).closest('a');
        if (link?.getAttribute('href') === selected?.href && selected) {
          history.replaceState({ ...history.state, galleryReturn: true }, '', '#' + selected.href.split('/')[2]);
        }
      }}>
      <div ref={wheelRef} className={`${styles.wheel} work-wheel-arrival`}>
        {items.map((item, i) => {
          const Card = item.paragraphs ? 'div' : Link;
          const cardWidth = geometry.side;
          const cardHeight = item.video ? cardWidth * item.video.height / item.video.width : geometry.side;
          return <Card key={item.href} href={item.href} ref={(el: HTMLElement | null) => { cards.current[i] = el; }}
            className={`${styles.card} ${active === i ? styles.selectedCard : ''}`} aria-label={item.paragraphs ? item.title : `View ${item.title}`} tabIndex={opened && active === i ? 0 : -1}
            aria-hidden={opened && Math.abs(active - i) > 1 ? true : undefined}
            style={{ width: cardWidth, height: cardHeight, marginLeft: -cardWidth / 2, marginTop: -cardHeight / 2 }}
            onDragStart={(event: React.DragEvent<HTMLElement>) => event.preventDefault()}
            onClick={(event: React.MouseEvent<HTMLElement>) => { if (!opened || active !== i) { event.preventDefault(); to(i + 1); } }}>
            <span ref={(el) => { faces.current[i] = el; }} className={styles.face}>
              {item.paragraphs ? <span data-background-copy className={styles.backgroundCopy} style={{ fontSize: clamp(geometry.side / 25, 8, 13) }}>
                {item.paragraphs.map((paragraph) => <span key={paragraph}>{paragraph}</span>)}
              </span> : item.video ? <WorkVideoThumbnail {...item.video} videoRef={(el) => { videos.current[i] = el; }} /> : item.image ? <Picture img={item.image} alt={item.title} priority={i === 0} sizes="(max-width: 699px) 68vw, 32vw" className={`${styles.media} route-media`} /> : null}
            </span>
          </Card>;
        })}
      </div>
      <div ref={titleRef} className={`${styles.title} route-intro`} aria-live="polite" aria-atomic="true">
        {selected?.paragraphs ? <span className={`type-decision ${styles.projectTitle}`}>{selected.title}</span> : <Link href={selected?.href ?? '/work/'} tabIndex={opened ? 0 : -1} className={`type-decision ${styles.projectTitle}`}>{selected?.title}</Link>}
        <p className="mt-4 type-subtitle">{selected?.subtitle}</p>
      </div>
      <nav className={`${styles.yearShell} route-navigation`} aria-label="Project navigation">
        <button type="button" className={styles.yearChevron} aria-label="Previous project" disabled={active === 0} onClick={() => select(-1)}><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="m7 14 5-5 5 5" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg></button>
        <div ref={yearRef} className={styles.year} aria-label="Project years">
        {Array.from({ length: 13 }, (_, i) => 2026 - i).map((year) => {
          const current = highlightedYears.includes(String(year));
          const availableYears = items.flatMap((item) => (item.year.match(/\d{4}/g) ?? []).map(Number));
          const destinationYear = Math.min(...availableYears.filter((available) => available >= year));
          const index = items.findIndex((item) => item.year.includes(String(destinationYear)));
          return <button key={year} type="button" className={`type-caption ${current ? styles.activeYear : ''} ${year === projectYear ? styles.projectYear : ''}`} aria-current={year === projectYear ? 'date' : undefined} onClick={() => { if (index >= 0) to(index + 1); }}>{year}</button>;
        })}
        </div>
        <button type="button" className={styles.yearChevron} aria-label="Next project" disabled={active === count - 1} onClick={() => select(1)}><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="m7 10 5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg></button>
      </nav>
      <noscript><nav className={styles.fallback} aria-label="Work projects">{items.map((item) => <p key={item.href}><a href={item.href}>{item.title} / {item.year}</a></p>)}</nav></noscript>
    </section>
  );
}
