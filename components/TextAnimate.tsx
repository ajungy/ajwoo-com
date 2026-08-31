'use client';

import { useEffect, useRef, useState } from 'react';

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
}: {
  children: string;
  className?: string;
  by?: 'character' | 'word';
  trigger?: 'entrance' | 'scroll';
  delayMs?: number;
  stepMs?: number;
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
    if (rect.top < window.innerHeight && rect.bottom > 0) {
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
      { threshold: 0, rootMargin: '0px 0px 150px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [trigger]);

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
