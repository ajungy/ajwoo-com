'use client';

import { useState } from 'react';
import { Toast } from './Toast';
import { site } from '@/content/site';

/**
 * The inline "Email me" text in SkillsSection.tsx — copies the address to
 * the clipboard and confirms with a toast, same behavior as the top-of-page
 * Email button (CopyEmailButton.tsx), at Alex's direction, rather than
 * opening a mailto: link. Kept as its own small component (like
 * CopyEmailButton) since this needs client-side state and SkillsSection
 * itself stays a Server Component otherwise.
 */
export function EmailMeLink() {
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
        type="button"
        onClick={handleCopy}
        data-cursor-label="Email"
        className="text-fg underline underline-offset-2 transition-colors duration-fast ease-standard can-hover:hover:text-fg-secondary"
      >
        Email me
      </button>
      {showToast && <Toast message="Alex's email copied to clipboard" duration={3000} />}
    </>
  );
}
