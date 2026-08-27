'use client';

import { useState } from 'react';
import SpecularButton from './SpecularButton';
import { Toast } from './Toast';

/**
 * Downgraded from Action's "primary" visual language to a quieter,
 * secondary-weight button, at Alex's direction — the landing page's
 * "Book 15 min" stays the one primary action site-wide (Principle 3/
 * CLAUDE.md §0); Share doesn't need to compete with it for emphasis on
 * every other page. The chrome itself is now React Bits' SpecularButton
 * (see SpecularButton.tsx for the full reasoning on why a WebGL
 * dependency is here at all — a deliberate, logged exception, not an
 * oversight), with the exact prop configuration Alex specified: a
 * transparent tint (tintOpacity 0) over this project's own chrome/page
 * surface, white text and shine line, a mid-gray base stroke.
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
      <SpecularButton
        onClick={handleShare}
        data-cursor-label="Share"
        size="md"
        radius={8}
        tint="#ffffff"
        tintOpacity={0}
        blur={0}
        textColor="#ffffff"
        lineColor="#ffffff"
        baseColor="#525252"
        intensity={1}
        shineSize={10}
        shineFade={40}
        thickness={1}
        speed={0.5}
        followMouse
        proximity={250}
        autoAnimate
      >
        Share
      </SpecularButton>
      {showToast && <Toast message="Link has been copied" duration={3000} />}
    </>
  );
}
