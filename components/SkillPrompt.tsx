'use client';

import { useEffect, useRef, useState } from 'react';
import prompt from '@/content/skill-prompt.json';
import { actionClassName } from './Action';
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
    <div className="relative flex w-full max-w-content flex-col items-center gap-4">
          <p id="minimal-prompt-help" className="w-full text-center type-body">
            <a href="/minimal-design-system.md" download="SKILL.md"
              aria-label="Download SKILL.md"
              className="underline underline-offset-4 can-hover:hover:text-fg">
              SKILL.md
            </a>{' '}behind my apps. Paste in your coding tool. Follow safeguards and review before publishing.
          </p>
        <button type="button" onClick={copyPrompt}
          aria-describedby="minimal-prompt-help"
          className={actionClassName()}>
          Copy prompt + skill link
        </button>
      <button type="button" aria-expanded={showPrompt} aria-controls="minimal-prompt-preview"
        onClick={() => setShowPrompt((visible) => !visible)}
        className={`gap-3 border-0 ${actionClassName('tertiary')}`}>
        See prompt
        <svg aria-hidden="true" viewBox="0 0 16 16" fill="none"
          className={`h-6 w-6 motion-safe:transition-transform ${showPrompt ? 'rotate-180' : ''}`}>
          <path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
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
        className={`${showPrompt ? 'block' : 'hidden'} w-full rounded-control border border-line bg-sunken p-6 text-left text-body text-fg`}
      />

        <p role="status" aria-live="polite" className="absolute top-full mt-4 flex items-center gap-4 type-body">
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
