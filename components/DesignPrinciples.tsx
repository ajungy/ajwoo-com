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
    <section className="mt-[140px]">
      <div className="grid grid-cols-1 large:grid-cols-4">
        <div className="landing-reading-column">
          <h2 className="type-section-heading">
            Favorite design principles
          </h2>
          <div className="mt-8 flex flex-col gap-6">
            {principles.map((p) => (
              <PrincipleRow key={p.n} n={p.n} title={p.title} body={p.body} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PrincipleRow({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <div className="flex gap-5">
      {/* Plain 1–10, not 01–10 — no zero-padding. font-sans, not
          tabular-nums: tabular-nums is only a digit-width feature (for
          columns of numbers that need to align), but it also swaps in a
          font's alternate tabular-figure glyphs, which visibly read as a
          different typeface next to the title/body's own plain digits —
          at Alex's direction ("the typography for numbering the
          principles... doesn't match the other typography... use the same
          font"). These numbers aren't a column that needs alignment, so
          the feature was buying nothing and costing a mismatch. */}
      <span className="w-6 shrink-0 font-sans text-body text-fg-tertiary">
        {n}
      </span>
      <div>
        <p className="type-decision">{title}</p>
        <p className="mt-4 type-body">{body}</p>
      </div>
    </div>
  );
}
