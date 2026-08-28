'use client';

import { useCallback, useEffect, useRef, type ReactNode } from 'react';
import styles from './BorderGlow.module.css';

/**
 * Wraps an EXISTING element in React Bits' BorderGlow effect, trimmed down
 * to JUST the edge-light glow ring (see BorderGlow.module.css's file
 * comment for what got cut and why) — at Alex's direction, replacing the
 * SpecularBorder shine that used to wrap "Book 15 min" (BookTimeAction.tsx)
 * with this instead, on the same original plain secondary <Action> button.
 * Same shape as SpecularBorder.tsx: a bare `inline-block` with no padding/
 * border/margin of its own, so it hugs the child exactly and never touches
 * the child's own background, border, text color, or hover/press states.
 */

function parseHSL(hslStr: string) {
  const match = hslStr.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
  if (!match) return { h: 40, s: 80, l: 80 };
  return { h: parseFloat(match[1]), s: parseFloat(match[2]), l: parseFloat(match[3]) };
}

function buildGlowVars(glowColor: string, intensity: number): Record<string, string> {
  const { h, s, l } = parseHSL(glowColor);
  const base = `${h}deg ${s}% ${l}%`;
  const opacities = [100, 60, 50, 40, 30, 20, 10];
  const keys = ['', '-60', '-50', '-40', '-30', '-20', '-10'];
  const vars: Record<string, string> = {};
  for (let i = 0; i < opacities.length; i++) {
    vars[`--glow-color${keys[i]}`] = `hsl(${base} / ${Math.min(opacities[i] * intensity, 100)}%)`;
  }
  return vars;
}

function easeOutCubic(x: number) { return 1 - Math.pow(1 - x, 3); }
function easeInCubic(x: number) { return x * x * x; }

function animateValue({
  start = 0, end = 100, duration = 1000, delay = 0, ease = easeOutCubic, onUpdate, onEnd,
}: {
  start?: number; end?: number; duration?: number; delay?: number;
  ease?: (x: number) => number; onUpdate: (v: number) => void; onEnd?: () => void;
}) {
  const t0 = performance.now() + delay;
  function tick() {
    const elapsed = performance.now() - t0;
    const t = Math.min(elapsed / duration, 1);
    onUpdate(start + (end - start) * ease(t));
    if (t < 1) requestAnimationFrame(tick);
    else if (onEnd) onEnd();
  }
  setTimeout(() => requestAnimationFrame(tick), delay);
}

export interface BorderGlowProps {
  children: ReactNode;
  className?: string;
  edgeSensitivity?: number;
  glowColor?: string;
  borderRadius?: number;
  glowRadius?: number;
  glowIntensity?: number;
  coneSpread?: number;
  animated?: boolean;
  /** CSS `mix-blend-mode` for the glow ring. Defaults to `plus-lighter`
   * (the registry's own choice) which only ever brightens — a black
   * `glowColor` disappears under it against a light background. Pass
   * `'multiply'` (with a black/dark `glowColor`) for a glow meant to read
   * as darkening instead, e.g. a light-mode variant of an otherwise
   * bright/warm dark-mode glow. */
  blendMode?: string;
}

export function BorderGlow({
  children,
  className = '',
  edgeSensitivity = 30,
  glowColor = '40 80 80',
  borderRadius = 28,
  glowRadius = 40,
  glowIntensity = 1.0,
  coneSpread = 25,
  animated = false,
  blendMode = 'plus-lighter',
}: BorderGlowProps) {
  const rootRef = useRef<HTMLSpanElement>(null);

  const getCenter = useCallback((el: HTMLElement): [number, number] => {
    const { width, height } = el.getBoundingClientRect();
    return [width / 2, height / 2];
  }, []);

  const getEdgeProximity = useCallback((el: HTMLElement, x: number, y: number) => {
    const [cx, cy] = getCenter(el);
    const dx = x - cx;
    const dy = y - cy;
    let kx = Infinity;
    let ky = Infinity;
    if (dx !== 0) kx = cx / Math.abs(dx);
    if (dy !== 0) ky = cy / Math.abs(dy);
    return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
  }, [getCenter]);

  const getCursorAngle = useCallback((el: HTMLElement, x: number, y: number) => {
    const [cx, cy] = getCenter(el);
    const dx = x - cx;
    const dy = y - cy;
    if (dx === 0 && dy === 0) return 0;
    const radians = Math.atan2(dy, dx);
    let degrees = radians * (180 / Math.PI) + 90;
    if (degrees < 0) degrees += 360;
    return degrees;
  }, [getCenter]);

  const handlePointerMove = useCallback((e: PointerEvent) => {
    const root = rootRef.current;
    if (!root) return;
    const rect = root.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const edge = getEdgeProximity(root, x, y);
    const angle = getCursorAngle(root, x, y);
    root.style.setProperty('--edge-proximity', `${(edge * 100).toFixed(3)}`);
    root.style.setProperty('--cursor-angle', `${angle.toFixed(3)}deg`);
  }, [getEdgeProximity, getCursorAngle]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.addEventListener('pointermove', handlePointerMove);
    return () => root.removeEventListener('pointermove', handlePointerMove);
  }, [handlePointerMove]);

  useEffect(() => {
    const root = rootRef.current;
    if (!animated || !root) return;
    const angleStart = 110;
    const angleEnd = 465;
    root.classList.add(styles.sweepActive);
    root.style.setProperty('--cursor-angle', `${angleStart}deg`);

    animateValue({ duration: 500, onUpdate: (v) => root.style.setProperty('--edge-proximity', `${v}`) });
    animateValue({
      ease: easeInCubic, duration: 1500, end: 50,
      onUpdate: (v) => root.style.setProperty('--cursor-angle', `${(angleEnd - angleStart) * (v / 100) + angleStart}deg`),
    });
    animateValue({
      ease: easeOutCubic, delay: 1500, duration: 2250, start: 50, end: 100,
      onUpdate: (v) => root.style.setProperty('--cursor-angle', `${(angleEnd - angleStart) * (v / 100) + angleStart}deg`),
    });
    animateValue({
      ease: easeInCubic, delay: 2500, duration: 1500, start: 100, end: 0,
      onUpdate: (v) => root.style.setProperty('--edge-proximity', `${v}`),
      onEnd: () => root.classList.remove(styles.sweepActive),
    });
  }, [animated]);

  const glowVars = buildGlowVars(glowColor, glowIntensity);

  return (
    <span
      ref={rootRef}
      className={`${styles.glowRoot}${className ? ` ${className}` : ''}`}
      style={{
        '--edge-sensitivity': edgeSensitivity,
        '--border-radius': `${borderRadius}px`,
        '--glow-padding': `${glowRadius}px`,
        '--cone-spread': coneSpread,
        '--glow-blend': blendMode,
        borderRadius: `${borderRadius}px`,
        ...glowVars,
      } as React.CSSProperties}
    >
      <span className={styles.edgeLight} aria-hidden="true" />
      {children}
    </span>
  );
}
