'use client';

import { useEffect, useRef } from 'react';
import { Mesh, Program, Renderer, Triangle } from 'ogl';
import styles from './GlowCursor.module.css';

/**
 * Vendored from React Bits (GlowCursor-JS-CSS), at Alex's direction, to
 * replace the water-drop cursor (archived outside this repo — see
 * /Users/alexwoo/Desktop/ajwoo-water-cursor-backup/README.md for the
 * restoration steps if it ever comes back).
 *
 * Structural change from the stock component: the registry version tracks
 * pointer position and sizes its canvas against its OWN container element
 * (`containerRef`), meant for a bounded demo `<div>` per the published usage
 * example. Alex's ask was the opposite — a light trail that follows the
 * REAL, native OS cursor everywhere on the site, layered on top of it, not
 * a swap-in replacement confined to one box. So here:
 *   - Pointer tracking listens on `window`, not the container.
 *   - The container is `position: fixed; inset: 0; pointer-events: none;`
 *     (see GlowCursor.module.css) sized from `window.innerWidth/innerHeight`
 *     rather than a container rect, and never intercepts real clicks.
 *   - No `children`/content slot — the demo wrapped page content inside the
 *     effect's container; there is nothing to wrap for a page-wide overlay,
 *     and the real page background is left alone rather than the demo's
 *     `#050610` filler.
 *   - The native cursor is left fully in place (nothing hides it, unlike
 *     the old water cursor's `cursor: none` treatment) — this is meant to
 *     sit ON TOP of it, per Alex's wording, not replace it.
 * The shader, uniforms, and trail/falloff math are otherwise unchanged from
 * the vendored source.
 *
 * Gated to `(any-pointer: fine)` and `prefers-reduced-motion: no-preference`
 * — a touch device has no continuous hover to trail, and reduced-motion
 * should see nothing extra layered onto its cursor.
 */

const MAX_POINTS = 64;

const VERTEX_SHADER = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;
varying vec2 vUv;
uniform vec2 uResolution;
uniform vec2 uPoints[${MAX_POINTS}];
uniform int uPointCount;
uniform vec3 uColor;
uniform vec3 uSecondaryColor;
uniform float uTrailWidth;
uniform float uTaper;
uniform float uGlowIntensity;
uniform float uGlowSpread;
uniform float uHotspot;
uniform float uBrightness;
uniform float uOpacity;
uniform float uPulseSpeed;
uniform float uNoiseStrength;
uniform float uTime;
uniform float uFade;

float filmGrain(vec2 uv, float t) {
  return fract(sin(dot(uv * t, vec2(12.9898, 78.233))) * 43758.5453);
}

float segDist(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-6), 0.0, 1.0);
  return length(pa - ba * h);
}

void main() {
  vec2 uv = vUv * uResolution;
  float glow = 0.0;
  float core = 0.0;

  for (int i = 0; i < ${MAX_POINTS}; i++) {
    if (i >= uPointCount - 1) break;
    vec2 a = uPoints[i];
    vec2 b = uPoints[i + 1];
    float life = 1.0 - (float(i) / max(float(uPointCount - 1), 1.0));
    float width = uTrailWidth * pow(life, uTaper);
    float d = segDist(uv, a, b);

    float pulse = 0.85 + 0.15 * sin(uTime * uPulseSpeed + float(i) * 0.3);
    float beam = smoothstep(width * uGlowSpread, 0.0, d) * life * pulse;
    float c = smoothstep(width * 0.5, 0.0, d) * life;

    glow += beam * uGlowIntensity;
    core += c;
  }

  glow = clamp(glow, 0.0, 3.0);
  core = clamp(core, 0.0, 1.0);

  vec3 color = mix(uSecondaryColor, uColor, core);
  vec3 result = color * (glow + core * uHotspot) * uBrightness;

  float grain = (filmGrain(vUv, uTime) - 0.5) * uNoiseStrength;
  result += grain;

  result = pow(max(result, 0.0), vec3(1.0 / 2.2));

  float alpha = clamp(glow + core, 0.0, 1.0) * uOpacity * uFade;
  gl_FragColor = vec4(result * alpha, alpha);
}
`;

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean.length === 3
    ? clean.split('').map((c) => c + c).join('')
    : clean, 16);
  return [((bigint >> 16) & 255) / 255, ((bigint >> 8) & 255) / 255, (bigint & 255) / 255];
}

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

export interface GlowCursorProps {
  color?: string;
  secondaryColor?: string;
  trailLength?: number;
  trailWidth?: number;
  trailTaper?: number;
  followSpeed?: number;
  glowIntensity?: number;
  glowSpread?: number;
  hotspot?: number;
  brightness?: number;
  opacity?: number;
  pulseSpeed?: number;
  noiseStrength?: number;
  idleFade?: boolean;
  idleTimeout?: number;
  fadeDuration?: number;
  blendMode?: string;
  maxDevicePixelRatio?: number;
  enabled?: boolean;
}

export function GlowCursor({
  color = '#67E8F9',
  secondaryColor = '#A78BFA',
  trailLength = 40,
  trailWidth = 8,
  trailTaper = 0.8,
  followSpeed = 0.16,
  glowIntensity = 1.9,
  glowSpread = 1.2,
  hotspot = 0.65,
  brightness = 1.25,
  opacity = 1,
  pulseSpeed = 1.1,
  noiseStrength = 0.035,
  idleFade = true,
  idleTimeout = 700,
  fadeDuration = 900,
  blendMode = 'screen',
  maxDevicePixelRatio = 1.5,
  enabled = true,
}: GlowCursorProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enabled) return;
    if (typeof window === 'undefined') return;

    const finePointer = window.matchMedia('(any-pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!finePointer || reducedMotion) return;

    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio || 1, maxDevicePixelRatio), alpha: true });
    const gl = renderer.gl;
    gl.canvas.className = styles.canvas;
    container.appendChild(gl.canvas);
    gl.clearColor(0, 0, 0, 0);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: VERTEX_SHADER,
      fragment: FRAGMENT_SHADER,
      uniforms: {
        uResolution: { value: [1, 1] },
        uPoints: { value: Array.from({ length: MAX_POINTS }, () => [0, 0]) },
        uPointCount: { value: 0 },
        uColor: { value: hexToRgb(color) },
        uSecondaryColor: { value: hexToRgb(secondaryColor) },
        uTrailWidth: { value: trailWidth },
        uTaper: { value: trailTaper },
        uGlowIntensity: { value: glowIntensity },
        uGlowSpread: { value: glowSpread },
        uHotspot: { value: hotspot },
        uBrightness: { value: brightness },
        uOpacity: { value: opacity },
        uPulseSpeed: { value: pulseSpeed },
        uNoiseStrength: { value: noiseStrength },
        uTime: { value: 0 },
        uFade: { value: 0 },
      },
      transparent: true,
    });
    const mesh = new Mesh(gl, { geometry, program });

    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      renderer.setSize(width, height);
      program.uniforms.uResolution.value = [width, height];
    };
    resize();
    window.addEventListener('resize', resize);

    const target = { x: width / 2, y: height / 2 };
    const current = { x: width / 2, y: height / 2 };
    const trail: Array<[number, number]> = [];
    let lastMoveAt = performance.now();
    let hasMoved = false;
    let raf = 0;

    const updatePointer = (event: PointerEvent) => {
      target.x = event.clientX;
      target.y = height - event.clientY;
      lastMoveAt = performance.now();
      hasMoved = true;
    };
    const onLeave = () => {
      lastMoveAt = 0;
    };

    window.addEventListener('pointermove', updatePointer, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    window.addEventListener('blur', onLeave);

    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);

      current.x += (target.x - current.x) * followSpeed;
      current.y += (target.y - current.y) * followSpeed;

      if (hasMoved) {
        trail.unshift([current.x, current.y]);
        if (trail.length > trailLength) trail.length = trailLength;
      }

      const flat: number[] = [];
      for (let i = 0; i < MAX_POINTS; i++) {
        const p = trail[i];
        flat.push(p ? p[0] : 0, p ? p[1] : 0);
      }
      program.uniforms.uPoints.value = trail.length ? trail : [[current.x, current.y]];
      program.uniforms.uPointCount.value = Math.max(trail.length, 1);
      program.uniforms.uTime.value = t * 0.001;

      let fade = 1;
      if (idleFade) {
        const idleFor = lastMoveAt === 0 ? Infinity : performance.now() - lastMoveAt;
        if (idleFor > idleTimeout) {
          const fadeProgress = clamp((idleFor - idleTimeout) / Math.max(fadeDuration, 1), 0, 1);
          fade = 1 - fadeProgress;
        }
      }
      if (!hasMoved) fade = 0;
      program.uniforms.uFade.value = fade;

      renderer.render({ scene: mesh });
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', updatePointer);
      document.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('blur', onLeave);
      container.removeChild(gl.canvas);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  return <div ref={containerRef} className={styles.glowCursor} style={{ mixBlendMode: blendMode as never }} aria-hidden="true" />;
}
