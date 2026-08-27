'use client';

import { useRef, type ButtonHTMLAttributes, type CSSProperties } from 'react';
import { useSpecularFx } from './useSpecularFx';
import styles from './SpecularButton.module.css';

/**
 * React Bits' SpecularButton (https://reactbits.dev/components/
 * specular-button, variant SpecularButton-JS-CSS), vendored in with only
 * three changes: converted to TypeScript, its stylesheet moved to a CSS
 * Module (Next.js App Router doesn't allow a plain global stylesheet
 * import from inside a component), and the WebGL shader logic itself
 * pulled out into `useSpecularFx` (components/useSpecularFx.ts) so it
 * can also drive `SpecularBorder.tsx` — a wrapper that applies the same
 * effect to an EXISTING element without rendering its own `<button>`.
 * The shader (the rounded-rect signed-distance field, the pointer-
 * steered light angle, the render loop) is untouched from the registry
 * source; see useSpecularFx.ts for it.
 *
 * THIS IS A DELIBERATE, LOGGED EXCEPTION to two rules this codebase
 * otherwise holds everywhere else:
 *   - CLAUDE.md §2 sets "Animation library: None." This pulls in `ogl`
 *     (a WebGL micro-library) and renders a live GLSL fragment shader
 *     per instance via a dedicated <canvas> — further from "plain CSS"
 *     than anything else on this site.
 *   - Principle 14 ("nothing moves unless the user caused it or is
 *     waiting on it") is violated whenever `autoAnimate` is on: the
 *     light angle keeps sweeping and the shine stays lit at rest, with
 *     no user action driving it.
 * Alex asked for this exact component, with this exact prop
 * configuration, after being shown both conflicts directly and
 * confirming the deviation is intentional. It moved from ShareButton.tsx
 * to wrapping "Book 15 min" (app/page.tsx, via SpecularBorder.tsx) at
 * Alex's follow-up direction; this file (the standalone button) is no
 * longer used anywhere but is kept since the effect itself still needs
 * somewhere to live if a future full-button use case comes up.
 */

export interface SpecularButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
  size?: 'sm' | 'md' | 'lg';
  radius?: number;
  tint?: string;
  tintOpacity?: number;
  blur?: number;
  textColor?: string;
  lineColor?: string;
  baseColor?: string;
  intensity?: number;
  shineSize?: number;
  shineFade?: number;
  thickness?: number;
  speed?: number;
  followMouse?: boolean;
  proximity?: number;
  autoAnimate?: boolean;
}

export default function SpecularButton({
  children = 'Get Started',
  size = 'lg',
  radius = 18,
  tint = '#ffffff',
  tintOpacity = 0,
  blur = 0,
  textColor = '#f5f5f5',
  lineColor = '#ffffff',
  baseColor = '#525252',
  intensity = 1,
  shineSize = 10,
  shineFade = 40,
  thickness = 1,
  speed = 0.35,
  followMouse = true,
  proximity = 250,
  autoAnimate = false,
  disabled = false,
  onClick,
  className = '',
  type = 'button',
  ...rest
}: SpecularButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const fxRef = useRef<HTMLSpanElement>(null);

  useSpecularFx(btnRef, fxRef, {
    radius, lineColor, baseColor, intensity, shineSize, shineFade, thickness, speed, followMouse, proximity, autoAnimate,
  });

  const sizeClass = size === 'sm' ? styles.sizeSm : size === 'md' ? styles.sizeMd : styles.sizeLg;

  return (
    <button
      ref={btnRef}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${styles.specularButton} ${sizeClass}${className ? ` ${className}` : ''}`}
      style={
        {
          '--sb-radius': `${radius}px`,
          '--sb-tint': tint,
          '--sb-tint-opacity': tintOpacity,
          '--sb-blur': `${blur}px`,
          '--sb-text-color': textColor,
        } as CSSProperties
      }
      {...rest}
    >
      <span ref={fxRef} className={styles.fx} aria-hidden="true" />
      <span className={styles.label}>{children}</span>
    </button>
  );
}
