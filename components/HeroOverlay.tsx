'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * The headline's verb, typed and deleted in place: "designs" → "builds" →
 * "codes" → "creates" → "pioneers" → loops back to "designs". Everything else
 * in the h1 ("Alex Woo ___ creative tools at Netflix.") stays fixed text.
 *
 * DOCUMENTED DEVIATION — Principle 14 says nothing moves unless the user
 * caused it or is waiting on it, and a typing loop is time-driven by
 * definition. This was originally built as an overlay on the hero photo and
 * moved here on Alex's instruction; the deviation itself was already accepted
 * and is recorded in CLAUDE.md. Same two guards carry over:
 *   1. `prefers-reduced-motion: reduce` renders the first word statically and
 *      never starts a timer.
 *   2. It stops when the headline scrolls out of view, so it is not burning
 *      frames behind the rest of the page.
 *
 * STABILITY (Principle 4), and the one place this component does NOT hold the
 * line: an inline-block reserved to the longest word ("pioneers") was tried
 * first and broke text wrapping inside the headline — a rigid inline-block
 * inside wrapping text forces the browser to lay the rest of the line out
 * around a box instead of flowing through it, which is worse than the
 * reflow it was meant to prevent. The word is plain inline text instead, so
 * the headline may re-break by a few pixels as the word's length changes.
 * That is a real, accepted deviation, not an oversight.
 */
const WORDS = ['designs', 'builds', 'codes', 'creates', 'pioneers'];

const TYPE_MS = 90;
const DELETE_MS = 46;
const HOLD_MS = 1500;
const EMPTY_MS = 260;

export function TypingWord() {
  const [text, setText] = useState(WORDS[0]);
  const [animate, setAnimate] = useState(false);
  const hostRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia('(prefers-reduced-motion: no-preference)').matches) return;
    setAnimate(true);

    let word = 0;
    let chars = WORDS[0].length;
    let deleting = true;
    let timer: ReturnType<typeof setTimeout>;
    let running = true;

    const step = () => {
      if (!running) return;
      const full = WORDS[word];
      let delay = TYPE_MS;
      if (deleting) {
        chars -= 1;
        if (chars <= 0) { chars = 0; deleting = false; word = (word + 1) % WORDS.length; delay = EMPTY_MS; }
        else delay = DELETE_MS;
      } else {
        chars += 1;
        if (chars >= full.length) { chars = full.length; deleting = true; delay = HOLD_MS; }
      }
      setText(WORDS[word].slice(0, chars));
      timer = setTimeout(step, delay);
    };
    timer = setTimeout(step, HOLD_MS);

    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !running) { running = true; timer = setTimeout(step, TYPE_MS); }
      if (!e.isIntersecting) { running = false; clearTimeout(timer); }
    });
    if (hostRef.current) io.observe(hostRef.current);

    return () => { running = false; clearTimeout(timer); io.disconnect(); };
  }, []);

  return (
    <span ref={hostRef} className="relative">
      <span aria-hidden="true">{text}</span>
      <span
        aria-hidden="true"
        className={'ml-0.5 inline-block w-px self-stretch bg-current ' + (animate ? 'caret-blink' : '')}
      />
      {/* The static, fully-formed sentence for assistive tech — a caption
          rewriting every 60ms would flood a screen reader. */}
      <span className="sr-only">designs</span>
    </span>
  );
}
