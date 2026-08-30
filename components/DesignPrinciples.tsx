import { StaggerReveal } from './StaggerReveal';
import { principles } from '@/content/site';

/**
 * Ten principles pulled from the "minimal" design system itself — the same
 * house style this whole site is built from (see SkillsSection.tsx, right
 * below this on the landing page, which lets a visitor take the actual file).
 * Showing the principles here rather than just linking the file makes the
 * claim "I designed this system" checkable in five seconds of scrolling,
 * not just asserted.
 *
 * Back to one column, 1-10 stacked in document order — reverted again after
 * the two-column (1-5 left, 6-10 right) pass, at Alex's direction, and now
 * placed on the same 4-column/columns-2-3 grid as Experience/Education/
 * Featured/Worked-with below (app/page.tsx) rather than its own bespoke
 * layout — one shared grid language across every list section on the page.
 * `large:col-start-2 large:col-span-2` centers the single column inside
 * columns 2-3 with 1 and 4 left empty at `large` (1200px) and up; below
 * that the grid collapses to one column and the content just sits full-
 * width, left-aligned — the same responsive shape used everywhere else
 * this grid appears.
 */
export function DesignPrinciples() {
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
      <div className="grid grid-cols-1 large:grid-cols-4">
        <div className="large:col-start-2 large:col-span-2">
          <h2 className="text-h3 text-fg">Favorite design principles</h2>
          <StaggerReveal className="mt-8 flex flex-col gap-6">
            {principles.map((p) => (
              <PrincipleRow key={p.n} n={p.n} title={p.title} body={p.body} />
            ))}
          </StaggerReveal>
        </div>
      </div>
    </section>
  );
}

function PrincipleRow({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <div className="flex gap-5">
      {/* Plain 1–10, not 01–10 — no zero-padding. */}
      <span className="w-6 shrink-0 text-body text-fg-tertiary tabular-nums">
        {n}
      </span>
      <div>
        <p className="text-body font-semibold text-fg">{title}</p>
        <p className="mt-1 text-body text-fg-secondary">{body}</p>
      </div>
    </div>
  );
}
