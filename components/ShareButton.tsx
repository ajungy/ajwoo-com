'use client';

import { useState } from 'react';
import { Toast } from './Toast';

/**
 * Same visual language as Action's "primary" variant (components/Action.tsx),
 * reproduced on a <button> rather than an <a> because Share triggers a JS
 * action (native share sheet or clipboard write), not navigation. No icon —
 * Alex asked for the plain primary button, matching Book 30 minutes' shape.
 * `--action-primary-bg`/`-fg` already flip per theme via light-dark(), so
 * this is a white button with black text in dark mode for free.
 */
export function ShareButton() {
  const [showToast, setShowToast] = useState(false);

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';

    // Check if native share API is available (mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Alex Woo',
          text: 'Creative tools at Netflix.',
          url,
        });
      } catch (err) {
        // User cancelled share
      }
    } else {
      // Desktop: copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  return (
    <>
      <button
        onClick={handleShare}
        data-cursor-label="Share"
        className={
          'inline-flex items-center justify-center h-control-md rounded-control border ' +
          'text-label font-medium transition duration-fast ease-standard motion-safe:active:scale-press ' +
          'bg-primary text-primary-fg border-transparent px-6 ' +
          'can-hover:hover:bg-primary-hover active:bg-primary-active'
        }
      >
        Share
      </button>
      {showToast && <Toast message="Link has been copied" duration={3000} />}
    </>
  );
}
