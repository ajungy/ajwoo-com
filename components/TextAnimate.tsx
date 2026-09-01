'use client';

import { useEffect, useRef, useState } from 'react';

// Same helper StaggerReveal.tsx defines (and needs for the same reason —
// see that file's comment on it) — kept as a small local duplicate rather
// than a shared module, since it's ~10 lines and this is the only other
// call site.
function parseVerticalRootMargin(rootMargin: string, viewportH: number) {
  const [top, , bottom] = rootMargin.trim().split(/\s+/);
  const toPx = (v: string | undefined) => {
    if (!v) return 0;
    return v.endsWith('%') ? viewportH * (parseFloat(v) / 100) : parseFloat(v);
  };
  return { top: toPx(top), bottom: toPx(bottom) };
}

/**
 * A trimmed, CSS-only port of Magic UI's TextAnimate ("blurInUp", by
 * character or by word) — at Alex's direction, for the landing page's
 * "Enable creativity." headline, later reused ("use the same animation
 * effect") for the greeting/bio paragraph and the "Favorite design
 * principles" heading. Magic UI's own component runs on framer-motion;
 * CLAUDE.md's stack decisions reject that dependency outright ("Animation
 * library: None... Framer Motion is ~34kB gzipped to do what 40 lines of
 * CSS does... Rejected"), so this reproduces just the one preset actually
 * asked for as plain CSS keyframes (see .text-animate-char in
 * globals.css) instead of pulling in the library.
 *
 * `by`: 'character' (default, what the headline and the principles heading
 * use) or 'word'. The greeting/bio paragraph is long enough (~40 words)
 * that per-character reveal at the headline's own pace would take several
 * seconds to finish — 'word' keeps the SAME visual effect (blur + rise,
 * same easing) at a pace that suits real sentences.
 *
 * `trigger`: 'entrance' (default) keys off the SAME session-gated
 * `[data-entrance="run"]` flag §6(a)'s already-approved entrance sequence
 * uses — set once, before first paint, on a visitor's genuine first visit
 * this session — for above-the-fold text that's part of the page's own
 * load sequence. `trigger="scroll"` is for text further down the page
 * (the principles heading): it manages its own IntersectionObserver, the
 * same pattern StaggerReveal.tsx uses for the rows underneath it, so the
 * reveal actually happens AS the heading scrolls into view rather than
 * having already finished animating (via the load-time flag) by the time
 * a visitor scrolls that far down.
 *
 * `delayMs`: an extra flat delay before this block's own per-unit stagger
 * starts, layered on top of `--char-i`'s per-unit stagger via CSS
 * `calc()` — used to sequence the greeting/bio to start only once the
 * headline above it (and the button row beside it) have finished, rather
 * than all animating at once.
 *
 * Without the relevant trigger's condition met, these spans render at
 * their plain, fully-visible resting state — no motion, no dependency on
 * JS having run — so a no-entrance page view, an out-of-view scroll
 * target that never gets observed, or `prefers-reduced-motion` never sees
 * the effect appear empty or partially rendered.
 */
export function TextAnimate({
  children,
  className,
  by = 'character',
  trigger = 'entrance',
  delayMs = 0,
  stepMs,
  rootMargin = '0px 0px 150px 0px',
}: {
  children: string;
  className?: string;
  by?: 'character' | 'word';
  trigger?: 'entrance' | 'scroll';
  delayMs?: number;
  stepMs?: number;
  /** `trigger="scroll"` only — see StaggerReveal.tsx's own `rootMargin`
   *  prop doc, which this mirrors exactly (same IntersectionObserver
   *  tuning question, same two call sites: the default fires just before
   *  the fold, a negative top margin fires later, once the text is near
   *  the bottom of the window). */
  rootMargin?: string;
}) {
  const units = by === 'word' ? children.split(/(\s+)/) : Array.from(children);
  const step = stepMs ?? (by === 'word' ? 45 : 22);

  const ref = useRef<HTMLSpanElement>(null);
  const [scrollVisible, setScrollVisible] = useState(false);

  useEffect(() => {
    if (trigger !== 'scroll') return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    // Derived from the ACTUAL rootMargin, not a fixed "anywhere on
    // screen" check — see StaggerReveal.tsx's identical fix for why: a
    // late-trigger rootMargin (e.g. "-80% 0px 0px 0px") needs this sync
    // bypass to respect that same late threshold, or it fires the
    // instant the heading is anywhere in the initial viewport regardless
    // of the configured margin.
    const { top: topMargin, bottom: bottomMargin } = parseVerticalRootMargin(rootMargin, window.innerHeight);
    if (rect.bottom > -topMargin && rect.top < window.innerHeight + bottomMargin) {
      setScrollVisible(true);
      return;
    }
    // Same "trigger a bit before it's fully on screen" tuning
    // StaggerReveal.tsx uses (see that file), at Alex's direction ("make
    // the text appear a little bit sooner... if the page scroll shows the
    // title, animate as that happens").
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setScrollVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [trigger, rootMargin]);

  return (
    <span
      ref={ref}
      className={`${className ?? ''} ${trigger === 'scroll' && scrollVisible ? 'text-animate-visible' : ''}`}
      aria-label={children}
    >
      {units.map((u, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="text-animate-char"
          style={{ '--char-i': i, '--char-delay': `${delayMs}ms`, '--char-step': `${step}ms` } as React.CSSProperties}
        >
          {u === ' ' ? ' ' : u}
        </span>
      ))}
    </span>
  );
}
