'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

/* Groups direct children by visual row (matching offsetTop, 2px tolerance)
   and assigns each row a shared --stagger-i, so a multi-column grid staggers
   top-to-bottom only — no left-to-right offset within a row. Column count
   varies by breakpoint, so this can't be known at CSS-authoring time; it's
   measured after layout instead, once per reveal. Capped at 12 distinct
   rows; anything past that shares the 12th's delay. */
function assignRowStagger(el: HTMLElement) {
  const children = Array.from(el.children) as HTMLElement[];
  let row = -1;
  let lastTop = -Infinity;
  for (const child of children) {
    const top = child.offsetTop;
    if (Math.abs(top - lastTop) > 2) {
      row += 1;
      lastTop = top;
    }
    child.style.setProperty('--stagger-i', String(Math.min(row, 11)));
  }
}

/**
 * Wraps a `.stagger-grid` (see globals.css) so its children animate in when
 * the grid actually scrolls into view, not unconditionally on mount. Above
 * the fold on page load, that's the same instant either way; below the
 * fold, it means a visitor scrolling down keeps discovering new rows
 * animating in as they arrive, rather than everything having silently
 * finished animating off-screen before it was ever seen.
 *
 * Fires once per mount (`io.disconnect()` after the first intersection) —
 * this is a "welcome to this section" animation, not a repeating one that
 * replays every time the user scrolls past the same content twice.
 *
 * IntersectionObserver never runs its callback while `document.hidden` is
 * true (a real, spec'd browser behavior, not a bug) — and on mobile, a page
 * can briefly report hidden during the initial load/paint transition before
 * becoming active. If that happens to overlap the observer's first check,
 * the callback is silently skipped, and nothing else re-triggers it until a
 * scroll event forces a recompute — which is exactly "cards don't appear
 * until the user scrolls a little." The synchronous check below is the
 * fix: right after mount, measure the grid directly with
 * `getBoundingClientRect()` — cheap, and DOM layout is already committed by
 * the time an effect runs — and if it's already on screen, reveal
 * immediately without ever waiting on the observer at all. Below the fold,
 * this check is false and the observer takes over exactly as before. */
export function StaggerReveal({
  className = '',
  children,
  rootMargin = '0px 0px 150px 0px',
  delayMs = 0,
}: {
  className?: string;
  children: ReactNode;
  /** IntersectionObserver rootMargin — when the reveal fires relative to
   *  the viewport. Default (a positive bottom margin) fires just BEFORE a
   *  section reaches the viewport's bottom edge — see the comment below.
   *  Callers that want a later trigger (e.g. "only once the text is near
   *  the bottom 20% of the window") pass a negative TOP margin instead —
   *  see app/page.tsx's Experience/Education/Featured/Worked-with and
   *  DesignPrinciples.tsx for that usage. */
  rootMargin?: string;
  /** Extra flat delay (ms), layered on top of whatever base delay already
   *  applies (the session-wide entrance sequence's 500ms, if active) via
   *  CSS `--stagger-extra` — see that custom property's own comment in
   *  globals.css. For sequencing one section's reveal to start only once
   *  something ABOVE it has visibly finished (a button row, a heading's
   *  own text-reveal), not for the site-wide "fire earlier/later on
   *  scroll" question `rootMargin` answers. */
  delayMs?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const alreadyOnScreen = rect.top < window.innerHeight && rect.bottom > 0;
    if (alreadyOnScreen) {
      assignRowStagger(el);
      setVisible(true);
      return;
    }

    // threshold 0 + a POSITIVE bottom rootMargin (was 0.1 / a NEGATIVE
    // -10%), at Alex's direction ("make the text appear a little bit
    // sooner... if the page scroll shows the title, animate as that
    // happens"). The previous negative margin shrank the observed area
    // above the viewport's bottom edge, which meant a section had to
    // scroll noticeably PAST the fold before it counted as "intersecting"
    // — the opposite of "sooner". A positive margin extends the observed
    // area 150px BELOW the actual viewport, so the reveal fires while the
    // section is still just approaching the bottom edge, reading as
    // "appears as it comes into view" rather than "appears after a beat".
    // (This is the default; some callers now override it with a later
    // trigger — see the `rootMargin` prop doc above.)
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          assignRowStagger(el);
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return (
    <div
      ref={ref}
      className={`stagger-grid ${visible ? 'is-visible' : ''} ${className}`}
      style={delayMs ? ({ '--stagger-extra': `${delayMs}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}
