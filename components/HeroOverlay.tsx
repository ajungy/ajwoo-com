'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Typing overlay for the landing portrait.
 *
 * DOCUMENTED DEVIATION — Principle 14 says nothing moves unless the user caused
 * it or is waiting on it, and a typing loop is time-driven by definition. Alex
 * asked for it directly, so it ships, with the two guards that keep it from
 * being the worst version of itself:
 *   1. `prefers-reduced-motion: reduce` renders the first phrase, statically,
 *      and never starts a timer.
 *   2. It stops entirely when the hero scrolls out of view, so it is not
 *      burning frames behind the rest of the page.
 * The rejection is recorded in CLAUDE.md rather than quietly reversed.
 */
const PHRASES = [
  'Currently at Netflix',
  'Product Design',
  'Loves coffee',
  'Before at Adobe',
  'UX Design',
  'Loves film',
  'Before at Microsoft',
  'Design Lead',
  'Loves building',
];

const TYPE_MS = 68;
const DELETE_MS = 34;   // deleting is faster than typing, as it is in a real editor
const HOLD_MS = 1300;   // long enough to actually read the phrase
const EMPTY_MS = 320;

export function TypingLine() {
  const [text, setText] = useState(PHRASES[0]);
  const [animate, setAnimate] = useState(false);
  const hostRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia('(prefers-reduced-motion: no-preference)').matches) return;
    setAnimate(true);

    let phrase = 0;
    let chars = PHRASES[0].length;
    let deleting = true;
    let timer: ReturnType<typeof setTimeout>;
    let running = true;

    const step = () => {
      if (!running) return;
      const full = PHRASES[phrase];
      let delay = TYPE_MS;
      if (deleting) {
        chars -= 1;
        if (chars <= 0) { chars = 0; deleting = false; phrase = (phrase + 1) % PHRASES.length; delay = EMPTY_MS; }
        else delay = DELETE_MS;
      } else {
        chars += 1;
        if (chars >= full.length) { chars = full.length; deleting = true; delay = HOLD_MS; }
      }
      setText(PHRASES[phrase].slice(0, chars));
      timer = setTimeout(step, delay);
    };
    timer = setTimeout(step, HOLD_MS);

    // Stop when the hero leaves the viewport — no reason to run behind content.
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !running) { running = true; timer = setTimeout(step, TYPE_MS); }
      if (!e.isIntersecting) { running = false; clearTimeout(timer); }
    });
    if (hostRef.current) io.observe(hostRef.current);

    return () => { running = false; clearTimeout(timer); io.disconnect(); };
  }, []);

  return (
    <span ref={hostRef} className="inline-flex items-baseline">
      {/* aria-live is deliberately off: a caption that rewrites itself every
          70ms would flood a screen reader. The same facts are in the bio. */}
      <span aria-hidden="true">{text}</span>
      <span
        aria-hidden="true"
        className={'ml-1 inline-block w-px self-stretch bg-current ' + (animate ? 'caret-blink' : '')}
      />
      <span className="sr-only">{PHRASES.join('. ')}</span>
    </span>
  );
}
