'use client';

import { useEffect, useRef, useState } from 'react';
import prompt from '@/content/skill-prompt.json';
import styles from './SkillPrompt.module.css';

export function SkillPrompt() {
  const field = useRef<HTMLTextAreaElement>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  useEffect(() => {
    if (showPrompt && copyFailed) { field.current?.focus(); field.current?.select(); }
  }, [showPrompt, copyFailed]);
  const [status, setStatus] = useState('');
  const [copyCount, setCopyCount] = useState(0);

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopyCount((count) => count + 1);
      setCopyFailed(false);
      setStatus('Copied');
    } catch {
      setShowPrompt(true);
      setCopyFailed(true);
      setStatus('Select and copy the prompt from the text box.');
    }
  }

  return (
    <div className="relative flex w-full max-w-content flex-col items-center">
          <p id="minimal-prompt-help" className="max-w-content text-body text-fg-secondary">
            <a href="/minimal-design-system.md" download="SKILL.md"
              aria-label="Download SKILL.md"
              className="underline underline-offset-4 can-hover:hover:text-fg">
              SKILL.md
            </a>{' '}behind this site and apps. Paste into your coding tool. Follow safeguards; review before publishing.{' '}
            <button type="button" aria-expanded={showPrompt} aria-controls="minimal-prompt-preview"
              onClick={() => setShowPrompt((visible) => !visible)}
              className="underline underline-offset-4 can-hover:hover:text-fg">
              {showPrompt ? 'Hide prompt' : 'See prompt'}
            </button>
          </p>
      <textarea
        id="minimal-prompt-preview"
        hidden={!showPrompt}
        ref={field}
        aria-label="Prompt and skill link"
        aria-describedby="minimal-prompt-help"
        readOnly
        value={prompt}
        rows={6}
        spellCheck={false}
        className={`${showPrompt ? 'block' : 'hidden'} mt-8 w-full rounded-control border border-line bg-sunken p-6 text-left text-body text-fg`}
      />
        <button type="button" onClick={copyPrompt}
          aria-describedby="minimal-prompt-help"
          className="mt-8 inline-flex h-control-md items-center justify-center rounded-control border border-secondary-line bg-secondary px-6 text-label font-medium text-secondary-fg transition duration-fast ease-standard motion-safe:active:scale-press can-hover:hover:bg-secondary-hover can-hover:hover:border-secondary-line-hover active:bg-secondary-active">
          Copy prompt + skill link
        </button>
        <p role="status" aria-live="polite" className="absolute top-full mt-4 flex items-center gap-4 text-body text-fg-secondary">
          {status === 'Copied' && (
            <svg key={copyCount} className="h-[20px] w-[20px] shrink-0 text-success" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path className={styles.checkStroke} pathLength="1" d="m5 12 4 4L19 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          {status}
        </p>
    </div>
  );
}
