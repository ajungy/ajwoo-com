'use client';

import { useEffect, useId, useRef } from 'react';
import styles from './GlassSurfaceFill.module.css';

/**
 * The inside of the water-drop cursor (components/Cursor.tsx), replacing
 * the earlier WebGL FluidGlass attempt — at Alex's direction ("the React
 * bit is not really working... try to use this other one instead"):
 * React Bits' GlassSurface, an SVG feDisplacementMap lens (RGB channels
 * displaced by different amounts for a chromatic-aberration fringe, plus a
 * Gaussian blur), not a 3D/WebGL render. This is a much closer technical
 * fit for this cursor than FluidGlass was — the drop ALREADY used its own
 * static SVG lens filter (the old `dropletLens` in Cursor.tsx, now
 * removed in favor of this dynamic one) for exactly the same kind of
 * effect, just hand-built and non-resizing.
 *
 * Adaptations from the stock component, since it's built to be its own
 * fixed-size card rather than fill an already-shaped, constantly-resizing
 * parent:
 *   - No `width`/`height` props sizing its own box — this fills 100% of
 *     `.cursor-drop-body` (the parent already owns position/size/morph via
 *     Cursor.tsx's rAF loop) and a ResizeObserver on this element's own
 *     root re-measures and regenerates the displacement map whenever that
 *     parent resizes it, same mechanism the stock component uses for its
 *     own resizes.
 *   - No background/border/box-shadow of its own (the registry version's
 *     `.glass-surface--svg` class draws a card's whole chrome) — the
 *     drop's existing rim/Fresnel/shadow stack in globals.css is
 *     untouched and unrelated to this component.
 *   - `borderRadius` is fixed at a large constant (always-round edge
 *     falloff) rather than tracking the drop's own per-frame radius —
 *     that per-frame value lives only in Cursor.tsx's plain-object physics
 *     state, not React state, specifically so the whole cursor can run
 *     imperatively at 60fps without triggering React re-renders; wiring it
 *     through as a prop here would mean re-rendering this component every
 *     frame too. The drop is circular or very close to it almost all the
 *     time in practice, so a fixed round falloff reads correctly.
 *   - No Safari/Firefox `--fallback` chrome path — those browsers still
 *     get the plain SVG filter (degrading exactly like the old
 *     `dropletLens` filter already did: a soft blur instead of true
 *     refraction, same documented gap as before), rather than a separate
 *     frosted-glass fallback that would visually clash with the rest of
 *     the drop's own optics.
 *
 * Exact prop values are the ones Alex's own pasted "Advanced Glass
 * Distortion" example used: displace=0, distortionScale=-180,
 * redOffset=0, greenOffset=10, blueOffset=20, brightness=50, opacity=1,
 * mixBlendMode="screen".
 */
export interface GlassSurfaceFillProps {
  displace?: number;
  distortionScale?: number;
  redOffset?: number;
  greenOffset?: number;
  blueOffset?: number;
  brightness?: number;
  opacity?: number;
  blur?: number;
  borderWidth?: number;
  saturation?: number;
  xChannel?: 'R' | 'G' | 'B';
  yChannel?: 'R' | 'G' | 'B';
  mixBlendMode?: string;
}

export function GlassSurfaceFill({
  displace = 0,
  distortionScale = -180,
  redOffset = 0,
  greenOffset = 10,
  blueOffset = 20,
  brightness = 50,
  opacity = 1,
  blur = 11,
  borderWidth = 0.07,
  saturation = 1,
  xChannel = 'R',
  yChannel = 'G',
  mixBlendMode = 'screen',
}: GlassSurfaceFillProps) {
  const uniqueId = useId().replace(/:/g, '-');
  const filterId = `glass-filter-${uniqueId}`;
  const redGradId = `red-grad-${uniqueId}`;
  const blueGradId = `blue-grad-${uniqueId}`;

  const rootRef = useRef<HTMLDivElement>(null);
  const feImageRef = useRef<SVGFEImageElement>(null);
  const redChannelRef = useRef<SVGFEDisplacementMapElement>(null);
  const greenChannelRef = useRef<SVGFEDisplacementMapElement>(null);
  const blueChannelRef = useRef<SVGFEDisplacementMapElement>(null);
  const gaussianBlurRef = useRef<SVGFEGaussianBlurElement>(null);

  const borderRadius = 9999; // always-round edge falloff — see file comment

  const generateDisplacementMap = () => {
    const rect = rootRef.current?.getBoundingClientRect();
    const w = rect?.width || 40;
    const h = rect?.height || 40;
    const edgeSize = Math.min(w, h) * (borderWidth * 0.5);

    const svgContent = `
      <svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="${redGradId}" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#0000"/>
            <stop offset="100%" stop-color="red"/>
          </linearGradient>
          <linearGradient id="${blueGradId}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#0000"/>
            <stop offset="100%" stop-color="blue"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="${w}" height="${h}" fill="black"></rect>
        <rect x="0" y="0" width="${w}" height="${h}" rx="${borderRadius}" fill="url(#${redGradId})" />
        <rect x="0" y="0" width="${w}" height="${h}" rx="${borderRadius}" fill="url(#${blueGradId})" style="mix-blend-mode: ${mixBlendMode}" />
        <rect x="${edgeSize}" y="${edgeSize}" width="${w - edgeSize * 2}" height="${h - edgeSize * 2}" rx="${borderRadius}" fill="hsl(0 0% ${brightness}% / ${opacity})" style="filter:blur(${blur}px)" />
      </svg>
    `;

    return `data:image/svg+xml,${encodeURIComponent(svgContent)}`;
  };

  const updateDisplacementMap = () => {
    feImageRef.current?.setAttribute('href', generateDisplacementMap());
  };

  useEffect(() => {
    updateDisplacementMap();
    [
      { ref: redChannelRef, offset: redOffset },
      { ref: greenChannelRef, offset: greenOffset },
      { ref: blueChannelRef, offset: blueOffset },
    ].forEach(({ ref, offset }) => {
      ref.current?.setAttribute('scale', String(distortionScale + offset));
      ref.current?.setAttribute('xChannelSelector', xChannel);
      ref.current?.setAttribute('yChannelSelector', yChannel);
    });
    gaussianBlurRef.current?.setAttribute('stdDeviation', String(displace));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [distortionScale, redOffset, greenOffset, blueOffset, xChannel, yChannel, displace]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const resizeObserver = new ResizeObserver(() => {
      setTimeout(updateDisplacementMap, 0);
    });
    resizeObserver.observe(root);
    return () => resizeObserver.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={rootRef}
      className={styles.glassRoot}
      style={{
        backdropFilter: `url(#${filterId}) saturate(${saturation})`,
        WebkitBackdropFilter: `saturate(${saturation})`,
      }}
      aria-hidden="true"
    >
      <svg className={styles.filterSvg}>
        <defs>
          <filter id={filterId} colorInterpolationFilters="sRGB" x="0%" y="0%" width="100%" height="100%">
            <feImage ref={feImageRef} x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="map" />

            <feDisplacementMap ref={redChannelRef} in="SourceGraphic" in2="map" result="dispRed" />
            <feColorMatrix
              in="dispRed"
              type="matrix"
              values="1 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
              result="red"
            />

            <feDisplacementMap ref={greenChannelRef} in="SourceGraphic" in2="map" result="dispGreen" />
            <feColorMatrix
              in="dispGreen"
              type="matrix"
              values="0 0 0 0 0
                      0 1 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
              result="green"
            />

            <feDisplacementMap ref={blueChannelRef} in="SourceGraphic" in2="map" result="dispBlue" />
            <feColorMatrix
              in="dispBlue"
              type="matrix"
              values="0 0 0 0 0
                      0 0 0 0 0
                      0 0 1 0 0
                      0 0 0 1 0"
              result="blue"
            />

            <feBlend in="red" in2="green" mode="screen" result="rg" />
            <feBlend in="rg" in2="blue" mode="screen" result="output" />
            <feGaussianBlur ref={gaussianBlurRef} in="output" stdDeviation="0.7" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}
