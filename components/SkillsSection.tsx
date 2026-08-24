import { site } from '@/content/site';
import { CopySkillButton } from './CopySkillButton';

/**
 * "Try Alex's SKILL.md", the code/AI counterpart to the laurel-bracketed
 * "Alex's choice" badge on this same page. Leaves don't make sense as the
 * ornament here (this isn't a favorite, it's a tool), so the brackets are
 * angle brackets, `< >` in mono, the same visual grammar a real tag or a
 * template placeholder uses, flanking the label instead of laurels.
 *
 * No bounding border, at Alex's direction: no card, just type and space,
 * matching the rest of the page. mt-[245px], no pb: every major section on
 * this page is spaced from the next by that same 245px (144px increased
 * ~70%, at Alex's direction), so the gap language stays consistent
 * (Principle 10 in the sidebar above: spacing is a language).
 *
 * "Download SKILL.md" downloads the actual file this whole site is built
 * from (public/minimal-design-system.md), not a summary of it: a visitor
 * can drop it straight into their own AI coding tool. Secondary button, at
 * Alex's direction; "Book 20 minutes" stays the only primary on this page.
 *
 * No "Skills" section heading: the callout's own "Try Alex's SKILL.md"
 * already says what this is, so a heading directly above it restating
 * "Skills" was pure redundancy, at Alex's direction.
 *
 * One combined paragraph rather than a separate description-and-CTA pair,
 * at Alex's direction: the file's purpose and the offer to reach out read
 * as one thought, not two.
 */
export function SkillsSection() {
  return (
    <section className="mt-[245px]">
      <div className="flex flex-col items-center px-9 text-center">
        <div className="flex items-center gap-3 text-fg-tertiary">
          <span aria-hidden="true" className="font-mono text-h1 font-bold text-fg">{'<'}</span>
          <p className="text-title font-bold text-fg whitespace-nowrap">Try Alex&apos;s SKILL.md</p>
          <span aria-hidden="true" className="font-mono text-h1 font-bold text-fg">{'>'}</span>
        </div>
        <p className="mt-4 max-w-content text-body text-fg-secondary">
          The single file this site and several apps are built from, every
          rule in one drop. Want more?{' '}
          <a
            href={`mailto:${site.email}`}
            data-cursor-label="Email Alex"
            className="text-fg underline underline-offset-2 transition-colors duration-fast ease-standard can-hover:hover:text-fg-secondary"
          >
            Email me
          </a>
          .
        </p>
        <div className="mt-8">
          <CopySkillButton />
        </div>
      </div>
    </section>
  );
}
