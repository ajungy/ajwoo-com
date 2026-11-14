'use client';

import { useId, useRef, useState } from 'react';
import { actionClassName } from './Action';
import { createPortal } from 'react-dom';

/** Shared beta disclosure for every Capture Install entry point. No tracking. */
export function CaptureInstallButton({ href }: { href: string }) {
  const dialog = useRef<HTMLDialogElement | null>(null);
  const titleId = useId();
  const [mounted, setMounted] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
  const action = actionClassName();

  function open(event: React.MouseEvent) {
    event.stopPropagation();
    setAcknowledged(false);
    setMounted(true);
  }

  return <>
    <button type="button" onClick={open} className={action} data-cursor-label="Install" aria-haspopup="dialog">Install</button>
    {mounted && createPortal(
      <dialog ref={(node) => {
        dialog.current = node;
        if (node && !node.open) node.showModal();
      }} aria-labelledby={titleId} onClose={() => setMounted(false)}
        className="m-auto w-[calc(100%_-_32px)] max-w-lg max-h-[85dvh] overflow-y-auto rounded-lg border border-line-subtle bg-raised p-6 text-fg backdrop:bg-black/50">
        <h2 id={titleId} className="type-section-heading">Install Capture Beta</h2>
        <p className="mt-4 type-caption">Free beta · Apple silicon or Intel · macOS 14 or later</p>
        <p className="mt-4 type-body">Still in development. Recording and editing can have errors. Back up important files and test a short recording before relying on Capture.</p>
        <p className="mt-4 type-body">Unzip the download, drag Capture to Applications, then open it. Capture saves recordings on your Mac; it does not create automatic backups. Apple may download speech-language files.</p>
        <div className="mt-4 flex flex-wrap gap-4 type-caption">
          <a className="underline" href="/downloads/capture-beta-notice.txt" target="_blank" rel="noopener noreferrer">Beta & installation notice</a>
          <a className="underline" href="/downloads/capture-privacy-notice.txt" target="_blank" rel="noopener noreferrer">App privacy</a>
          <a className="underline" href="mailto:alex@ajwoo.com">Support</a>
        </div>
        <label className="mt-6 flex items-start gap-4 type-body cursor-pointer">
          <input type="checkbox" checked={acknowledged} onChange={(event) => setAcknowledged(event.target.checked)} className="shrink-0 cursor-pointer" style={{ width: 18, height: 18, minWidth: 18, margin: 0, marginTop: 'calc((1lh - 18px) / 2)' }} />
          <span>I understand this beta requires my own backups.</span>
        </label>
        <p className="mt-4 type-caption">GG Creative Studios, LLC. No payment or subscription. This notice does not waive your statutory rights.</p>
        <div className="mt-6 flex flex-wrap justify-end gap-4">
          <button type="button" className={action} onClick={() => dialog.current?.close()}>Cancel</button>
          {acknowledged ? <a href={href} download className={action} onClick={() => dialog.current?.close()}>Download ZIP</a>
            : <button type="button" disabled className={`${action} opacity-50 cursor-not-allowed`}>Download ZIP</button>}
        </div>
      </dialog>, document.body
    )}
  </>;
}
