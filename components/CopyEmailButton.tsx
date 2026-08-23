'use client';

import { useState } from 'react';
import { Toast } from './Toast';
import { site } from '@/content/site';

/**
 * Same visual language as Action's "secondary" variant (components/Action.tsx)
 * on a <button> rather than an <a> — Alex asked for Email to copy the address
 * to the clipboard and confirm with a toast, rather than open a mailto: link.
 */
export function CopyEmailButton() {
  const [showToast, setShowToast] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <>
      <button
        onClick={handleCopy}
        data-cursor-label="Email"
        className={
          'inline-flex items-center justify-center h-control-md rounded-control border ' +
          'text-label font-medium transition duration-fast ease-standard motion-safe:active:scale-press ' +
          'bg-secondary text-secondary-fg border-secondary-line px-6 ' +
          'can-hover:hover:bg-secondary-hover can-hover:hover:border-secondary-line-hover active:bg-secondary-active'
        }
      >
        Email
      </button>
      {showToast && <Toast message="Alex's email copied to clipboard" duration={3000} />}
    </>
  );
}
