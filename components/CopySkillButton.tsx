/**
 * Downloads the full minimal design system (public/minimal-design-system.md
 * — the same file this entire site is built from) as SKILL.md, so a visitor
 * can drop it straight into their own AI coding tool. A plain anchor with
 * `download` — the browser handles the save UI itself, no fetch/clipboard
 * round-trip and no toast needed.
 */
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
