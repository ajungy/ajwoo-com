import { SkillPrompt } from './SkillPrompt';

/** Self-contained design-system download with a quick-start prompt. */
export function SkillsSection() {
  return (
    <section className="mt-7">
      <div className="flex flex-col items-center px-9 text-center">
        <div className="flex items-center gap-3 text-fg-tertiary">
          <span aria-hidden="true" className="font-mono text-h1 font-bold text-fg">
            {'<'}
          </span>
          <p className="text-title font-bold text-fg whitespace-nowrap">
            {"Try Alex's SKILL.md"}
          </p>
          <span aria-hidden="true" className="font-mono text-h1 font-bold text-fg">
            {'>'}
          </span>
        </div>
        <div className="mt-4 flex flex-col items-center gap-8">
          <SkillPrompt />
        </div>
      </div>
    </section>
  );
}
