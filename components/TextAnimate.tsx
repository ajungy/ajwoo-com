/**
 * A trimmed, CSS-only port of Magic UI's TextAnimate ("blurInUp", by
 * character) — at Alex's direction, for the landing page's "Enable
 * creativity." headline. Magic UI's own component runs on framer-motion;
 * CLAUDE.md's stack decisions reject that dependency outright ("Animation
 * library: None... Framer Motion is ~34kB gzipped to do what 40 lines of
 * CSS does... Rejected"), so this reproduces just the one preset actually
 * asked for as plain CSS keyframes (see .text-animate-char in
 * globals.css) instead of pulling in the library.
 *
 * This is the fourth pass at motion on this exact headline (CLAUDE.md
 * §6(d) already logs two superseded ones: a typing-verb loop, then
 * ParticleText, both reverted back to plain static text) — but it's not a
 * new Principle 14 exception on its own. It reuses the SAME
 * `[data-entrance="run"]` gate §6(a)'s already-approved entrance sequence
 * uses: set once, before first paint, on a visitor's genuine first visit
 * this session, never again after a route change or reload. Without that
 * flag present these spans render at their plain, fully-visible resting
 * state — no motion, no dependency on JS having run — so a no-entrance
 * page view (or prefers-reduced-motion) never sees the effect appear
 * empty or partially rendered.
 */
export function TextAnimate({ children, className }: { children: string; className?: string }) {
  const chars = Array.from(children);
  return (
    <span className={className} aria-label={children}>
      {chars.map((ch, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="text-animate-char"
          style={{ '--char-i': i } as React.CSSProperties}
        >
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
    </span>
  );
}
