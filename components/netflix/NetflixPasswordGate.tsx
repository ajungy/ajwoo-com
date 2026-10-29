'use client';

import { useEffect, useRef, useState } from 'react';
import type { Project } from '@/content/projects';
import type { EncryptedNetflixProject, NetflixPayload } from '@/lib/netflix/types';
import { NetflixProject } from './NetflixProject';
import { CopyEmailButton } from '@/components/CopyEmailButton';
import { Action } from '@/components/Action';
import styles from './NetflixPasswordGate.module.css';

const bytes = (value: string) => Uint8Array.from(atob(value), (character) => character.charCodeAt(0));

async function unlock(password: string, encrypted: EncryptedNetflixProject): Promise<NetflixPayload> {
  const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: bytes(encrypted.salt), iterations: encrypted.iterations, hash: 'SHA-256' },
    material, { name: 'AES-GCM', length: 256 }, false, ['decrypt'],
  );
  const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: bytes(encrypted.iv) }, key, bytes(encrypted.ciphertext));
  return JSON.parse(new TextDecoder().decode(plaintext));
}

export function NetflixPasswordGate({ project, encrypted }: { project: Project; encrypted: EncryptedNetflixProject }) {
  const [password, setPassword] = useState('');
  const [payload, setPayload] = useState<NetflixPayload | null>(null);
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState('');
  const [submission, setSubmission] = useState(0);
  const content = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!password || payload) return;
    let cancelled = false;
    let entryTimer: ReturnType<typeof setTimeout>;
    const timer = setTimeout(async () => {
      try {
        const result = await unlock(password, encrypted);
        if (cancelled) return;
        setAccepted(true);
        setError('');
        entryTimer = setTimeout(() => { if (!cancelled) setPayload(result); }, 450);
      } catch {
        if (!cancelled && submission > 0) setError('That password doesn’t match.');
      }
    }, 100);
    return () => { cancelled = true; clearTimeout(timer); clearTimeout(entryTimer); };
  }, [password, encrypted, submission, payload]);

  useEffect(() => {
    if (!payload) return;
    const heading = content.current?.querySelector('h1');
    heading?.setAttribute('tabindex', '-1');
    heading?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }, [payload]);

  if (payload) return <div ref={content} className="ph-no-capture" data-private><NetflixProject project={project} {...payload} /></div>;

  return (
    <section className={`${styles.gate} ph-no-capture`} data-private aria-labelledby="netflix-password-title">
      <div className={styles.panel}>
        <h1 id="netflix-password-title" className="text-title text-fg">{project.title}</h1>
        <p className="mt-4 text-body text-fg-secondary">Enter the password to view this project.</p>
        <form className="mt-8" onSubmit={(event) => { event.preventDefault(); setSubmission((value) => value + 1); }}>
          <label htmlFor="netflix-password" className="sr-only">Project password</label>
          <div className={styles.field}>
            <input id="netflix-password" type="password" autoComplete="current-password"
              placeholder="Password" value={password} readOnly={accepted}
              aria-describedby="netflix-password-status"
              onChange={(event) => { setPassword(event.target.value); setError(''); setSubmission(0); }}
              className={styles.input} />
            <button type="submit" className={styles.button} disabled={accepted}
              aria-label={accepted ? 'Password accepted' : 'Unlock project'}>
              {accepted ? (
                <svg className={`${styles.check} text-success`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="m5 12 4 4L19 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          </div>
          <p id="netflix-password-status" role="status" className="mt-4 text-caption text-fg-secondary">
            {accepted ? 'Password accepted. Opening project…' : error || '\u00a0'}
          </p>
        </form>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <CopyEmailButton label="Email Alex" />
          <Action href="/work/#704" variant="tertiary">See other work</Action>
        </div>
      </div>
    </section>
  );
}
