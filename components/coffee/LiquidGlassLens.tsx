'use client';

import { useEffect, useRef, type RefObject } from 'react';
import { liquidGlassFragment } from './liquidGlassShader';
import styles from './CoffeeCarousel.module.css';

/** Refracts a photo-only texture, leaving semantic links and text in the DOM.
 * One WebGL context; redraws only on scroll, resize, image load and theme change.
 * If WebGL is unavailable/lost, the native gallery remains fully usable. */
export function LiquidGlassLens({ rail }: { rail: RefObject<HTMLDivElement> }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const output = canvas.current;
    const track = rail.current;
    if (!output || !track) return;
    const gl = output.getContext('webgl', { alpha: false, antialias: false, preserveDrawingBuffer: true });
    if (!gl) return;
    const source = document.createElement('canvas');
    const ctx = source.getContext('2d');
    if (!ctx) return;
    const shaders: WebGLShader[] = [];
    function compile(type: number, code: string) {
      const shader = gl!.createShader(type)!;
      gl!.shaderSource(shader, code);
      gl!.compileShader(shader);
      shaders.push(shader);
      return gl!.getShaderParameter(shader, gl!.COMPILE_STATUS) ? shader : null;
    }
    const vertex = compile(gl.VERTEX_SHADER, `attribute vec2 position; varying vec2 vUv;
      void main(){vUv=position*0.5+0.5; gl_Position=vec4(position,0.,1.);}`);
    const fragment = compile(gl.FRAGMENT_SHADER, liquidGlassFragment);
    const program = gl.createProgram()!;
    if (!vertex || !fragment) {
      shaders.forEach((shader) => gl.deleteShader(shader));
      gl.deleteProgram(program);
      return;
    }
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      shaders.forEach((shader) => gl.deleteShader(shader));
      gl.deleteProgram(program);
      return;
    }
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    const uniform = (name: string) => gl.getUniformLocation(program, name);
    const settings: Record<string, number> = {
      uSizeX: 0.565, uSizeY: 1, uRotation: 65 * Math.PI / 180,
      uZoom: 0, uDispersion: 2.5, uBlur: 0, uGlow: 4.2, uWhiteGlow: 0.24,
      uNovaSize: 12, uBlueRing: 6, uRingRadius: 0.49, uRingWidth: 0.014,
      uShimmer: 0, uShimmerFreq: 12, uShimmerSpeed: 3.5, uShimmerDepth: 0.12,
      uTime: 0, uRimStart: 0.578, uRimTangential: 0.28, uRimInward: 0,
      uRimFreq1: 2, uRimFreq2: 1, uRimLine: 1.4, uRimLinePos: 0.488,
      uRimLineWidth: 0.003, uVignette: 0, uVignetteSize: 1,
      uShape: 0, uSquareRound: 0,
    };
    Object.entries(settings).forEach(([name, value]) => gl.uniform1f(uniform(name), value));
    gl.uniform1i(uniform('uTex'), 0);
    gl.uniform1i(uniform('uSamples'), 12);
    gl.uniform2f(uniform('uCenter'), 0.5, 0.5);
    // Optical dispersion uses the reference's physical blue rim, independent of UI colors.
    gl.uniform3f(uniform('uBlueColor'), 0, 0.337, 1);
    let frame = 0;
    let previousScroll = track.scrollLeft;
    let motion = 0;
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    let disposed = false;
    const images = Array.from(track.querySelectorAll('img'));
    function draw() {
      frame = 0;
      if (disposed || !ctx || !gl || !track || !output) return;
      const bounds = track.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      const delta = Math.abs(track.scrollLeft - previousScroll);
      previousScroll = track.scrollLeft;
      // Ignore the invisible rebase between identical copies of the loop.
      const speed = delta > bounds.width ? 0 : Math.min(1, delta / 24);
      motion += (speed - motion) * (speed > motion ? 0.35 : 0.10);
      if (motion < 0.001 || reducedMotion.matches) motion = 0;
      for (const card of Array.from(track.children) as HTMLElement[]) {
        card.style.transform = motion ? `scale(${1 - motion * 0.16})` : '';
      }
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.round(bounds.width * ratio);
      const height = Math.round(bounds.height * ratio);
      if (output.width !== width || output.height !== height) {
        output.width = source.width = width;
        output.height = source.height = height;
        gl.viewport(0, 0, width, height);
      }
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      const background = getComputedStyle(document.body).backgroundColor;
      ctx.fillStyle = background;
      const channels = background.match(/[\d.]+/g)?.slice(0, 3).map(Number) ?? [0, 0, 0];
      gl.uniform3f(uniform('uBackground'), channels[0] / 255, channels[1] / 255, channels[2] / 255);
      ctx.fillRect(0, 0, bounds.width, bounds.height);
      for (const image of images) {
        const box = image.getBoundingClientRect();
        if (!image.complete || !image.naturalWidth || box.right < bounds.left || box.left > bounds.right) continue;
        const scale = Math.max(box.width / image.naturalWidth, box.height / image.naturalHeight);
        const sw = box.width / scale;
        const sh = box.height / scale;
        ctx.drawImage(image, (image.naturalWidth - sw) / 2, (image.naturalHeight - sh) / 2,
          sw, sh, box.left - bounds.left, box.top - bounds.top, box.width, box.height);
      }
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
      gl.uniform2f(uniform('uRes'), width, height);
      const aspect = bounds.width / bounds.height;
      // Match the reference's viewport-height lens while this canvas excludes
      // the persistent header/footer. Cropping the enlarged ellipse keeps its
      // curved rims at the ends instead of displaying a complete central disc.
      const lensScale = 1.95;
      const theme = document.documentElement.dataset.theme;
      const dark = theme === 'dark' || (!theme && colorScheme.matches);
      // Keep spectral separation in the photo samples, but never draw a
      // luminous oval over the page. Dark backgrounds need no additive glow.
      gl.uniform1f(uniform('uBlueRing'), 0);
      gl.uniform1f(uniform('uRimLine'), 0);
      gl.uniform1f(uniform('uWhiteGlow'), dark ? 0 : 0.04);
      gl.uniform1f(uniform('uGlow'), dark ? 0 : 1.2);
      gl.uniform1f(uniform('uEdgeStretch'), bounds.width < 600 ? 0.12 : 0.16);
      gl.uniform1f(uniform('uAspect'), Math.max(1.9, aspect));
      gl.uniform1f(uniform('uSizeX'), 0.565 * lensScale);
      gl.uniform1f(uniform('uSizeY'), lensScale);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      output.style.opacity = '1';
      track.dataset.lensReady = 'true';
      if (motion > 0) schedule();
    }
    function schedule() { if (!disposed && !frame) frame = requestAnimationFrame(draw); }
    function lost(event: Event) { event.preventDefault(); output!.style.opacity = '0'; delete track!.dataset.lensReady; }
    track.addEventListener('scroll', schedule, { passive: true });
    output.addEventListener('webglcontextlost', lost);
    document.body.addEventListener('transitionend', schedule);
    images.forEach((image) => image.addEventListener('load', schedule));
    const resize = new ResizeObserver(schedule);
    resize.observe(track);
    const theme = new MutationObserver(schedule);
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'style', 'class'] });
    const colorScheme = matchMedia('(prefers-color-scheme: dark)');
    colorScheme.addEventListener('change', schedule);
    schedule();
    return () => {
      disposed = true;
      delete track.dataset.lensReady;
      for (const card of Array.from(track.children) as HTMLElement[]) card.style.transform = '';
      cancelAnimationFrame(frame);
      resize.disconnect();
      theme.disconnect();
      colorScheme.removeEventListener('change', schedule);
      track.removeEventListener('scroll', schedule);
      output.removeEventListener('webglcontextlost', lost);
      document.body.removeEventListener('transitionend', schedule);
      images.forEach((image) => image.removeEventListener('load', schedule));
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      shaders.forEach((shader) => gl.deleteShader(shader));
      gl.deleteProgram(program);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [rail]);
  return <canvas ref={canvas} className={styles.lens} aria-hidden="true" />;
}
