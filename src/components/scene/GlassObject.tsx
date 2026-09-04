"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial } from "@react-three/drei";
import type { Group, Mesh } from "three";

/**
 * The one loud thing on the page.
 *
 * MeshTransmissionMaterial does the work a hand-written refraction shader would: it
 * renders what is behind the mesh into a buffer and samples it back through the surface,
 * so the headline genuinely bends through the glass rather than sitting behind a frosted
 * rectangle. chromaticAberration is what produces the only colour on the site, splitting
 * the white type into spectral fringes at the facet edges.
 *
 * Two rotations run at once and they are deliberately different in kind. The idle drift
 * is constant and slow, so the object is never quite still. The pointer response is a
 * lerp toward a target, so it has weight and keeps moving after the cursor stops. Setting
 * rotation directly from the pointer is what makes these objects feel like cheap toys.
 */
export function GlassObject({
  groupRef,
  quality,
}: {
  groupRef: React.RefObject<Group | null>;
  /** Phones get fewer samples and no distortion; the effect survives, the frame rate does too. */
  quality: "high" | "low";
}) {
  const spin = useRef<Group>(null);
  const mesh = useRef<Mesh>(null);
  const target = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    const g = spin.current;
    if (!g) return;

    // Clamp: a background tab can hand back a delta of several seconds, which would
    // snap the object round in one frame the moment the visitor returns.
    const dt = Math.min(delta, 0.05);

    g.rotation.x += dt * 0.09;
    g.rotation.y += dt * 0.14;

    target.current.x = state.pointer.y * 0.3;
    target.current.y = state.pointer.x * 0.45;
    g.rotation.x += (target.current.x - g.rotation.x * 0.06) * dt * 0.6;
    g.rotation.y += (target.current.y - g.rotation.y * 0.06) * dt * 0.6;
  });

  const low = quality === "low";

  return (
    <group ref={groupRef}>
      <group ref={spin}>
        <mesh ref={mesh} scale={1.24}>
          {/* A faceted crystal rather than a torus knot. The knot was the first
              attempt and it failed for a reason worth recording: it is a thick,
              closed form, so it absorbed almost all the light passing through and
              rendered as black plastic, and at any size large enough to read as
              glass it buried the headline it was supposed to bend.

              Twenty faces, deliberately. Subdividing further rounds the silhouette
              into an orb and the flat planes stop reading as cut facets, which is
              the whole character of the object. Sharp edges are the point.

              Scaled evenly, so the crystal fills a spherical volume rather than a
              flattened, disc-like one. The shape stays angular; only the space it
              occupies is even in all three axes. */}
          <icosahedronGeometry args={[1, 0]} />
          <MeshTransmissionMaterial
            transmission={1}
            thickness={0.75}
            roughness={0.09}
            ior={1.42}
            chromaticAberration={low ? 0.16 : 0.3}
            anisotropicBlur={0.35}
            distortion={low ? 0 : 0.28}
            distortionScale={0.4}
            temporalDistortion={low ? 0 : 0.08}
            samples={low ? 4 : 8}
            resolution={low ? 512 : 1024}
            backside={false}

          />
        </mesh>
      </group>
    </group>
  );
}
