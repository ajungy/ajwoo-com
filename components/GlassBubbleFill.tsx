'use client';

import { Canvas } from '@react-three/fiber';
import { MeshTransmissionMaterial } from '@react-three/drei';

/**
 * The inside of the water-drop cursor (components/Cursor.tsx), replacing
 * the flat CSS sheen + iridescent colour-wash gradients this used to carry
 * — at Alex's direction: "remove all colors, ingredients that we put in
 * previously... use the fluid glass effect for the inside of the bubble".
 *
 * Ported from React Bits' FluidGlass (lens mode), with two real
 * adaptations rather than a literal drop-in:
 *
 *   1. FluidGlass's stock component loads a 3D model (lens.glb) from
 *      public/assets/3d/ to shape the glass mesh. No such model was
 *      supplied, and CLAUDE.md's asset policy is self-hosted-only — no
 *      third-party fetch, which also rules out drei's built-in
 *      <Environment preset="..."> (it pulls an HDRI from a CDN by
 *      default). So the "lens" here is a plain procedural sphere, and the
 *      light it refracts comes from three positioned, coloured point
 *      lights instead of an environment map — same MeshTransmissionMaterial
 *      doing the actual glass optics (ior/thickness/chromaticAberration/
 *      anisotropy), just a lighter-weight light source feeding it.
 *   2. This renders as a plain absolutely-positioned fill INSIDE the
 *      existing .cursor-drop-body — Cursor.tsx's outer container still
 *      owns position, size, morph, stretch, the rim/Fresnel box-shadow,
 *      and the drop shadow entirely unchanged (Alex: "keep the bubble and
 *      interaction and even the outline border and the shadow"). This
 *      component only fills what's already clipped to that shape via
 *      `border-radius: inherit; overflow: hidden` on its parent — it has
 *      no idea what size or shape it's in, same as the sheen gradient it
 *      replaced.
 *
 * The colours themselves (warm amber, cool cyan, soft violet) are what
 * were previously CSS gradient tokens (--water-iris-*, now removed) — kept
 * here only as light sources feeding real refraction, not as flat paint.
 */
export function GlassBubbleFill() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true }}
      camera={{ position: [0, 0, 2.4], fov: 40 }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <ambientLight intensity={0.15} />
      <pointLight position={[1.4, 1.2, 1.6]} intensity={14} color="#ffd699" />
      <pointLight position={[-1.3, -0.8, 1.4]} intensity={10} color="#6fe0ff" />
      <pointLight position={[0.2, -1.4, 1.2]} intensity={8} color="#c9a0ff" />
      <mesh>
        <sphereGeometry args={[1, 48, 48]} />
        <MeshTransmissionMaterial
          samples={4}
          resolution={128}
          thickness={0.9}
          roughness={0.05}
          transmission={1}
          ior={1.15}
          chromaticAberration={0.12}
          anisotropy={0.02}
          distortion={0.15}
          distortionScale={0.4}
          temporalDistortion={0}
          color="#ffffff"
        />
      </mesh>
    </Canvas>
  );
}
