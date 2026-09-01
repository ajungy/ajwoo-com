import { StaggerReveal } from './StaggerReveal';
import { TextAnimate } from './TextAnimate';
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
          {/* Same "blurInUp" TextAnimate the headline uses, at Alex's
              direction ("use the same animation effect... for the text
              appearing for favorite design principles") — `trigger="scroll"`
              since this heading sits well below the fold and needs its
              own reveal-on-scroll rather than the landing page's one-time
              load sequence (see TextAnimate.tsx's own comment).
              `rootMargin="-80% 0px 0px 0px"` on both this and the
              StaggerReveal below, at Alex's direction ("make the text
              animation apply later... let's say when the text hits near
              the lower 20% of the window area") — shrinks the observed
              area to just the BOTTOM 20% of the viewport (a negative TOP
              margin excludes everything above it from counting), so the
              reveal only fires once the heading has scrolled up into that
              band, later than the site-wide default (see StaggerReveal's
              own `rootMargin` prop doc for that default and the reasoning
              behind it). The sync-bypass fix in StaggerReveal.tsx/
              TextAnimate.tsx this round is what actually addresses Alex's
              "happens too soon, I never see it" report — this -80%
              value itself is unchanged; the trigger was silently being
              bypassed on load rather than honoring it. See that fix's own
              comment.
              `delayMs={500}` on the heading, at Alex's direction ("delay
              the animation... by 500ms"). `delayMs={1750}` on the list
              below sequences it to start once the heading's own
              text-reveal has finished, plus a further 100ms gap — at
              Alex's direction ("within one hundred milliseconds, start
              the motion to animate in the text below") — computed by
              hand: "Favorite design principles" is 26 characters, so 500
              (the heading's own delay) + 25*22 (its per-character
              stagger) + 600 (each character's own animation length) +
              100 (the gap) = 1750ms. */}
          <h2 className="text-h3 text-fg">
            <TextAnimate trigger="scroll" rootMargin="-80% 0px 0px 0px" delayMs={500}>Favorite design principles</TextAnimate>
          </h2>
          <StaggerReveal className="mt-8 flex flex-col gap-6" rootMargin="-80% 0px 0px 0px" delayMs={1750}>
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
        <p className="text-body font-semibold text-fg">{title}</p>
        <p className="mt-1 text-body text-fg-secondary">{body}</p>
      </div>
    </div>
  );
}
