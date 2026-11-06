'use client';

import { useState } from 'react';
import { Toast } from './Toast';

/** Outlined secondary action for the native share sheet or clipboard fallback. */
export function ShareButton() {
  const [showToast, setShowToast] = useState(false);

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';

    // Check if native share API is available (mobile). `url` ONLY — no
    // `title`/`text` fields. Those used to carry "Alex Woo" / "Creative
    // tools at Netflix.", and on several share targets (Notes, Messages,
    // some third-party apps) the OS-level share sheet concatenates
    // title+text+url into a single string rather than keeping them
    // separate, which is what produced the corrupted, space-as-%20
    // garbled link Alex reported ("Alex%20Woo%20Creative%20tools%20
    // at%20Netflix...") — and in at least one destination, a 404, since
    // that concatenated string is no longer a valid URL at all. A bare
    // `{ url }` is what every receiving app can only ever treat as a link.
    if (navigator.share) {
      try {
        await navigator.share({ url });
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
          'bg-secondary text-secondary-fg border-secondary-line px-6 ' +
          'can-hover:hover:bg-secondary-hover can-hover:hover:border-secondary-line-hover ' +
          'active:bg-secondary-active'
        }
      >
        Share
      </button>
      {showToast && <Toast message="Link has been copied" duration={3000} />}
    </>
  );
}
