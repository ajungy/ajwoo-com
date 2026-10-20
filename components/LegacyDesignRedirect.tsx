'use client';

import { useEffect } from 'react';

export function LegacyDesignRedirect() {
  useEffect(() => {
    window.location.replace(`/work/${window.location.search}${window.location.hash}`);
  }, []);
  return null;
}
