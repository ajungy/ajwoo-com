'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * The headline's verb, typed and deleted in place: "designs" -> "builds" ->
 * "codes" -> "creates" -> "pioneers" -> loops back to "designs". Everything
 * else in the h1 ("Alex Woo ___ creative tools at Netflix.") stays fixed text.
 *
 * Each word renders in its OWN typeface, chosen on Alex's instruction to look
 * like the word it spells rather than to match the site's one system face.
 * This is a real, stated breach of SKILL.md §3 ("one family, no pairing"),
 * confined to these five words:
 *   designs   Plus Jakarta Sans - the site's own face, unchanged.
 *   builds    Archivo Black - heavy, blocky, load-bearing; reads as
 *             construction rather than as type.
 *   codes     JetBrains Mono - an actual monospace coding font, the same
 *             genre a real terminal or editor would show.
 *   creates   Caveat - a handwritten script; illustrative and loose rather
 *             than engineered, the opposite feeling of "codes" beside it.
 *   pioneers  Playfair Display, bold italic - a slanted, ornamental serif;
 *             "fancy" was the actual word Alex used.
 * Every other typographic decision on the site remains Plus Jakarta Sans
 * alone (see CLAUDE.md §6(f) for the full reasoning per face).
 *
 * DOCUMENTED DEVIATION - Principle 14 says nothing moves unless the user
 * caused it or is waiting on it, and a typing loop is time-driven by
 * definition. This was originally built as an overlay on the hero photo and
 * moved into the headline on Alex's instruction; the deviation itself was
 * already accepted and is recorded in CLAUDE.md. Same two guards carry over:
 *   1. `prefers-reduced-motion: reduce` renders the first word statically and
 *      never starts a timer.
 *   2. It stops when the headline scrolls out of view, so it is not burning
 *      frames behind the rest of the page.
 *
 * STABILITY (Principle 4) — the word is taken OUT of flow entirely, not just
 * reserved space for. An earlier version tried a fixed-width inline-block
 * sized to the longest word ("pioneers"), which broke text wrapping (a rigid
 * box inside wrapping text forces the rest of the line to lay out around it).
 * A later version left it as plain inline text and instead locked the SECOND
 * line's position by giving the FIRST line a fixed-height container — that
 * stopped the line below from moving, but the word itself still flowed
 * in-line, so five different font metrics (Caveat's tall x-height, Playfair's
 * descenders, ...) could still visually crowd or brush against neighboring
 * text on its own line, and it never fully ruled out a layout nudge.
 *
 * This version renders the word as `position: absolute`, anchored to a
 * zero-width, fixed-height marker span that sits inline exactly where the
 * word should start (right after "Alex Woo "). Because it's absolutely
 * positioned, its box — whatever size Archivo Black, Caveat, or Playfair
 * render it at — cannot affect the marker, the line, or anything below,
 * structurally rather than by tuning line-heights to match. It's vertically
 * centered on the marker's fixed height (`lineHeight` prop, matching the
 * headline's fixed-height first line in app/page.tsx) so it still reads as
 * sitting on the same baseline as "Alex Woo".
 */
const WORDS = ['designs', 'builds', 'codes', 'creates', 'pioneers'] as const;

// One class per word, defined in globals.css (.word-designs, .word-builds, …).
const WORD_CLASS: Record<(typeof WORDS)[number], string> = {
  designs: 'word-designs',
  builds: 'word-builds',
  codes: 'word-codes',
  creates: 'word-creates',
  pioneers: 'word-pioneers',
};

const TYPE_MS = 90;
const DELETE_MS = 46;
const HOLD_MS = 1500;
const EMPTY_MS = 260;

export function TypingWord({ lineHeight = 52 }: { lineHeight?: number | string }) {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState<string>(WORDS[0]);
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
      setWordIndex(word);
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

  const word = WORDS[wordIndex];

  return (
    // Zero-width, fixed-height marker: holds the word's start position in the
    // text flow while contributing nothing to line width or height itself.
    <span
      ref={hostRef}
      className="relative inline-block align-top"
      style={{ width: 0, height: lineHeight }}
    >
      {/* Out of flow — sized however the active font renders it, but that
          size cannot push, widen, or heighten anything around it. */}
      <span
        aria-hidden="true"
        className="absolute left-0 top-1/2 -translate-y-1/2 whitespace-nowrap"
      >
        <span className={WORD_CLASS[word]}>{text}</span>
        <span className={'type-caret ' + (animate ? 'caret-blink' : '')} />
      </span>
      {/* The static, fully-formed sentence for assistive tech; a caption
          rewriting every 60ms, in five different faces, would flood a
          screen reader and would say nothing a plain word doesn't already. */}
      <span className="sr-only">designs</span>
    </span>
  );
}
