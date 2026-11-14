import { Action } from './Action';
import { CopyEmailButton } from './CopyEmailButton';

export function WorkProjectActions({ section = 'Work' }: { section?: 'Work' | 'Apps' | 'Coffee' }) {
  const href = section === 'Apps' ? '/apps/' : section === 'Coffee' ? '/coffee/' : '/work/';
  return (
    <div data-work-actions className="mt-12 flex flex-wrap gap-4">
      <Action href={href}>{`All ${section.toLowerCase()}`}</Action>
      <CopyEmailButton label="Email questions" />
    </div>
  );
}
