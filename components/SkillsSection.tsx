import { SkillPrompt } from './SkillPrompt';

/** Self-contained design-system download with a quick-start prompt. */
export function SkillsSection() {
  return (
    <section>
      <div className="flex flex-col items-center px-9 text-center">
        <div className="flex items-center gap-3 text-fg-tertiary">
          <span aria-hidden="true" className="font-mono text-h1 font-bold text-fg">
            {'<'}
          </span>
          <h2 className="type-section-heading">
            {"Try Alex's SKILL.md"}
          </h2>
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
