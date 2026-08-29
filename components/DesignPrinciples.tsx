import { StaggerReveal } from './StaggerReveal';
import { principles } from '@/content/site';

/**
 * Ten principles pulled from the "minimal" design system itself — the same
 * house style this whole site is built from (see SkillsSection.tsx, right
 * below this on the landing page, which lets a visitor take the actual file).
 * Showing the principles here rather than just linking the file makes the
 * claim "I designed this system" checkable in five seconds of scrolling,
 * not just asserted.
 */
export function DesignPrinciples() {
  // Split 1–5 / 6–10 for the two-column layout below — reverted back to
  // two columns at Alex's direction, after an earlier pass had already
  // reverted this same component FROM two columns to one (see git history):
  // logging both directions rather than only the final state, since the
  // reversal itself is the useful fact if this comes up again.
  const left = principles.slice(0, 5);
  const right = principles.slice(5);
  return (
    // 245px (mt-36's 144px, increased ~70% at Alex's direction — "more
    // space gives luxury") — bigger than the 48px between "Alex's choice"
    // and the Capture card above it: this is a bigger jump in topic (from
    // one featured app to the philosophy behind the whole site) and the gap
    // should read as a bigger jump too. Every major section gap on this
    // page shares this same 245px value (SkillsSection, Education grid
    // below) — spacing is a consistent language, not a per-section guess
    // (see Principle 10).
    <section className="mt-[245px]">
      <h2 className="text-h3 text-fg">Favorite design principles</h2>
      {/* Two columns, 1–5 left and 6–10 right, at Alex's direction. Each
          column is its own StaggerReveal (rather than one shared grid) so
          the two reveal top-to-bottom independently, side by side, instead
          of the reveal order zigzagging across columns. */}
      <div className="mt-8 grid grid-cols-1 gap-x-12 gap-y-8 medium:grid-cols-2">
        <StaggerReveal className="flex flex-col gap-6">
          {left.map((p) => (
            <PrincipleRow key={p.n} n={p.n} title={p.title} body={p.body} />
          ))}
        </StaggerReveal>
        <StaggerReveal className="flex flex-col gap-6">
          {right.map((p) => (
            <PrincipleRow key={p.n} n={p.n} title={p.title} body={p.body} />
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}

function PrincipleRow({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <div className="flex gap-5">
      {/* Plain 1–10, not 01–10 — no zero-padding. Same font (mono) as
          every other numbered/tabular column on the site (coffee scores,
          award years). */}
      <span className="w-6 shrink-0 font-mono text-body text-fg-tertiary tabular-nums">
        {n}
      </span>
      <div>
        <p className="text-body font-semibold text-fg">{title}</p>
        <p className="mt-1 text-body text-fg-secondary">{body}</p>
      </div>
    </div>
  );
}
