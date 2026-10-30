'use client';

// Geometry adapted from CrafterUI Works Wheel, MIT / Copyright (c) 2026 CrafterUI.
// Full notice: public/licenses/crafterui-MIT.txt. No demo artwork is included.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Picture } from '@/components/Picture';
import styles from './works-wheel.module.css';

export type WorksWheelItem = {
  title: string;
  subtitle: string;
  year: string;
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
          if (visible && !document.hidden) { if (video.paused) void video.play().catch(() => {}); }
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
      const delta = (Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX) * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? el.clientHeight : 1);
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
  const highlightedYears = selected?.title.startsWith('Adobe:')
    ? ['2021', '2022', '2023', '2024']
    : selected?.title.startsWith('Microsoft:')
      ? ['2016', '2017', '2018', '2019', '2020']
    : selected?.year.match(/\d{4}/g) ?? [];
  useEffect(() => {
    const rail = yearRef.current;
    const current = rail?.querySelector<HTMLElement>('[aria-current="date"]');
    if (!rail || !current || !matchMedia('(max-width: 699px)').matches) return;
    rail.scrollTo({ left: current.offsetLeft - rail.clientWidth / 2 + current.offsetWidth / 2, behavior: reduced ? 'instant' : 'smooth' });
  }, [active, reduced, stage.w]);


  return (
    <section ref={stageRef} className={`${styles.stage} work-entrance`} data-ready={stage.w > 0 ? "true" : undefined} tabIndex={0} aria-label="Work projects" aria-roledescription="carousel"
      style={{ perspective: `${geometry.depth || 1000}px` }}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget && (event.target as Element).closest('button, [data-background-copy]')) return;
        if (['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'].includes(event.key)) {
          event.preventDefault(); select(event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : -1);
        } else if (event.key === 'Home') { event.preventDefault(); to(1); }
        else if (event.key === 'End') { event.preventDefault(); to(count); }
      }}
      onPointerDown={(event) => {
        if (!event.isPrimary || event.button !== 0 || (event.target as Element).closest('button, [data-background-copy]')) return;
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
      onClickCapture={(event) => { if (suppressClick.current) { event.preventDefault(); event.stopPropagation(); suppressClick.current = false; } }}>
      <div ref={wheelRef} className={`${styles.wheel} work-wheel-arrival`}>
        {items.map((item, i) => {
          const Card = item.paragraphs ? 'div' : Link;
          const cardWidth = geometry.side;
          const cardHeight = geometry.side;
          return <Card key={item.href} href={item.href} ref={(el: HTMLElement | null) => { cards.current[i] = el; }}
            className={`${styles.card} ${active === i ? styles.selectedCard : ''}`} aria-label={item.paragraphs ? item.title : `View ${item.title}`} tabIndex={opened && active === i ? 0 : -1}
            aria-hidden={opened && Math.abs(active - i) > 1 ? true : undefined}
            style={{ width: cardWidth, height: cardHeight, marginLeft: -cardWidth / 2, marginTop: -cardHeight / 2 }}
            onDragStart={(event: React.DragEvent<HTMLElement>) => event.preventDefault()}
            onClick={(event: React.MouseEvent<HTMLElement>) => { if (!opened || active !== i) { event.preventDefault(); to(i + 1); } }}>
            <span ref={(el) => { faces.current[i] = el; }} className={styles.face}>
              {item.paragraphs ? <span data-background-copy className={styles.backgroundCopy} style={{ fontSize: clamp(geometry.side / 25, 8, 13) }} tabIndex={active === i ? 0 : -1} onClick={(event) => event.preventDefault()}>
                {item.paragraphs.map((paragraph) => <span key={paragraph}>{paragraph}</span>)}
              </span> : item.video ? <video ref={(el) => { videos.current[i] = el; }} autoPlay muted loop playsInline
                preload="auto" onCanPlay={(event) => { const video = event.currentTarget; if (Math.abs(active - i) <= 1 && !document.hidden) { video.muted = true; void video.play().catch(() => {}); } }} poster={`/img/${item.video.base}-poster.webp`}
                width={item.video.width} height={item.video.height} className={`${styles.media} route-media`}>
                <source src={`/img/${item.video.base}.mp4`} type="video/mp4" />
                {item.video.hasWebm && <source src={`/img/${item.video.base}.webm`} type="video/webm" />}
              </video> : item.image ? <Picture img={item.image} alt={item.title} priority={i === 0} sizes="(max-width: 699px) 68vw, 32vw" className={`${styles.media} route-media`} /> : null}
            </span>
          </Card>;
        })}
      </div>
      <div ref={titleRef} className={`${styles.title} route-intro`} aria-live="polite" aria-atomic="true">
        {selected?.paragraphs ? <span className={styles.projectTitle}>{selected.title}</span> : <Link href={selected?.href ?? '/work/'} tabIndex={opened ? 0 : -1} className={styles.projectTitle}>{selected?.title}</Link>}
        <p className="mt-4 text-body text-fg-secondary">{selected?.subtitle}</p>
      </div>
      <nav className={`${styles.yearShell} route-navigation`} aria-label="Project navigation">
        <button type="button" className={styles.yearChevron} aria-label="Previous project" disabled={active === 0} onClick={() => select(-1)}><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="m7 14 5-5 5 5" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg></button>
        <div ref={yearRef} className={styles.year} aria-label="Project years">
        {Array.from({ length: 13 }, (_, i) => 2026 - i).map((year) => {
          const current = highlightedYears.includes(String(year));
          const availableYears = items.flatMap((item) => (item.year.match(/\d{4}/g) ?? []).map(Number));
          const destinationYear = Math.min(...availableYears.filter((available) => available >= year));
          const index = items.findIndex((item) => item.year.includes(String(destinationYear)));
          return <button key={year} type="button" className={`${current ? styles.activeYear : ''} ${year === Math.max(...(selected?.year.match(/\d{4}/g) ?? []).map(Number)) ? styles.projectYear : ''}`} aria-current={current ? 'date' : undefined} onClick={() => { if (index >= 0) to(index + 1); }}>{year}</button>;
        })}
        </div>
        <button type="button" className={styles.yearChevron} aria-label="Next project" disabled={active === count - 1} onClick={() => select(1)}><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="m7 10 5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg></button>
      </nav>
      <noscript><nav className={styles.fallback} aria-label="Work projects">{items.map((item) => <p key={item.href}><a href={item.href}>{item.title} / {item.year}</a></p>)}</nav></noscript>
    </section>
  );
}
