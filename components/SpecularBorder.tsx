'use client';

import { useRef, type ReactNode } from 'react';
import { useSpecularFx, type SpecularFxOptions } from './useSpecularFx';
import styles from './SpecularButton.module.css';

/**
 * Wraps an EXISTING element in React Bits' SpecularButton shine effect
 * (see the long comment at the top of SpecularButton.tsx for the full
 * reasoning on why a WebGL dependency is in this codebase at all) without
 * rendering a button of its own, changing the child's markup, or touching
 * its size/colors — at Alex's direction, moving the effect from Share to
 * "Book 15 min" (app/page.tsx) "but keep the button dimensions and colors
 * the same, just the border animation and the cursor interaction."
 *
 * The wrapper is a bare `inline-block` with no padding/border/margin of
 * its own, so it hugs the child exactly — its `getBoundingClientRect()`
 * is the child's own box, which is what the fx canvas (positioned
 * absolutely, sized via the same ResizeObserver-driven logic
 * SpecularButton itself uses) tracks. The child's own background,
 * border, text color, and hover/press states are completely untouched;
 * this only adds a light-reactive shine line riding on top.
 */
export function SpecularBorder({
  children,
  className = '',
  ...fx
}: { children: ReactNode; className?: string } & SpecularFxOptions) {
  const targetRef = useRef<HTMLSpanElement>(null);
  const fxRef = useRef<HTMLSpanElement>(null);

  useSpecularFx(targetRef, fxRef, fx);

  return (
    <span ref={targetRef} className={`relative inline-block${className ? ` ${className}` : ''}`}>
      <span ref={fxRef} className={styles.fx} aria-hidden="true" />
      {children}
    </span>
  );
}
