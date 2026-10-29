import { Action } from './Action';
import { CopyEmailButton } from './CopyEmailButton';

export function WorkProjectActions() {
  return (
    <div className="mt-12 flex flex-wrap gap-4">
      <Action href="/work/" cursorLabel="Work">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mr-2 h-7 w-7">
          <path d="m12 5-7 7 7 7M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Work
      </Action>
      <CopyEmailButton label="Email questions" />
    </div>
  );
}
