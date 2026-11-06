/** Downloads the skill with all of its reference documents and token files. */
export function CopySkillButton() {
  return (
    <a
      href="/minimal-design-system.md"
      download="SKILL.md"
      data-cursor-label="Download SKILL.md"
      className={
        'inline-flex items-center justify-center h-control-md rounded-control border ' +
        'text-label font-medium transition duration-fast ease-standard motion-safe:active:scale-press ' +
        'bg-secondary text-secondary-fg border-secondary-line px-6 ' +
        'can-hover:hover:bg-secondary-hover can-hover:hover:border-secondary-line-hover ' +
        'active:bg-secondary-active'
      }
    >
      Download SKILL.md
    </a>
  );
}
