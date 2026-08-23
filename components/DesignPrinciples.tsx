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
  return (
    // mt-36 (144px) — bigger than the 48px between "Alex's choice" and the
    // Capture card above it, at Alex's direction: this is a bigger jump in
    // topic (from one featured app to the philosophy behind the whole site)
    // and the gap should read as a bigger jump too. Every major section gap
    // on this page shares this same 144px value (SkillsSection, Education
    // grid below) — spacing is a consistent language, not a per-section
    // guess (see Principle 10).
    <section className="mt-36">
      <h2 className="text-h3 text-fg">Favorite design principles</h2>
      {/* Single column — a "vertical row" per item, not the earlier 2-column
          grid, at Alex's direction. */}
      <StaggerReveal className="mt-8 flex flex-col gap-6">
        {principles.map((p, i) => (
          <div key={p.n} className="flex gap-5">
            {/* Plain 1–10, not 01–10 — no zero-padding. Same font (mono) as
                every other numbered/tabular column on the site (coffee
                scores, award years). */}
            <span className="w-6 shrink-0 font-mono text-body text-fg-tertiary tabular-nums">
              {i + 1}
            </span>
            <div>
              <p className="text-body font-semibold text-fg">{p.title}</p>
              <p className="mt-1 text-body text-fg-secondary">{p.body}</p>
            </div>
          </div>
        ))}
      </StaggerReveal>
    </section>
  );
}
