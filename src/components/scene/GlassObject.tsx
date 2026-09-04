"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial } from "@react-three/drei";
import { IcosahedronGeometry, Vector3 } from "three";
import type { BufferAttribute, Group, Mesh } from "three";
import { beatStage } from "./scroll-progress";

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

  /**
   * A crystal whose twenty faces can come apart.
   *
   * The geometry is de-indexed first, which sounds like a detail and is the whole
   * trick: an indexed icosahedron shares each corner between five faces, so moving one
   * face drags its neighbours with it and the solid deforms instead of separating.
   * De-indexed, every triangle owns its three corners and can travel alone.
   *
   * Normals and rest positions are computed once here rather than per frame. Twenty
   * faces is small enough that the per-frame work is only writing sixty vectors.
   */
  const { geometry, rest, normals } = useMemo(() => {
    const g = new IcosahedronGeometry(1, 0).toNonIndexed();
    const pos = g.attributes.position as BufferAttribute;
    const rest = Float32Array.from(pos.array);
    const faces = pos.count / 3;
    const normals = new Float32Array(faces * 3);
    const a = new Vector3(), b = new Vector3(), c = new Vector3();
    for (let f = 0; f < faces; f++) {
      const i = f * 3;
      a.fromArray(rest, i * 3);
      b.fromArray(rest, (i + 1) * 3);
      c.fromArray(rest, (i + 2) * 3);
      // The face's own outward direction, which is the line it travels along.
      const n = a.clone().add(b).add(c).divideScalar(3).normalize();
      normals[f * 3] = n.x;
      normals[f * 3 + 1] = n.y;
      normals[f * 3 + 2] = n.z;
    }
    return { geometry: g, rest, normals };
  }, []);

  useFrame((state, delta) => {
    const g = spin.current;
    if (!g) return;

    // Clamp: a background tab can hand back a delta of several seconds, which would
    // snap the object round in one frame the moment the visitor returns.
    const dt = Math.min(delta, 0.05);

    // The crystal opens through the middle of the pinned sequence and closes again by
    // the end of it, so it is whole whenever it is not performing.
    const p = beatStage.value;
    const open = Math.sin(Math.min(1, Math.max(0, p)) * Math.PI);
    // Kept deliberately small. Pushed far apart, each triangle becomes an isolated
    // flat plane with no depth for light to cross, and transmission has nothing to
    // refract: the crystal stops being glass and shades like grey card. A narrow
    // break reads as a crystal fracturing and keeps every facet lit from within.
    const spread = open * open * 0.12;

    const attr = mesh.current?.geometry.attributes.position as BufferAttribute | undefined;
    if (attr) {
      const arr = attr.array as Float32Array;
      for (let f = 0; f < normals.length / 3; f++) {
        const nx = normals[f * 3] * spread;
        const ny = normals[f * 3 + 1] * spread;
        const nz = normals[f * 3 + 2] * spread;
        for (let v = 0; v < 3; v++) {
          const i = (f * 3 + v) * 3;
          arr[i] = rest[i] + nx;
          arr[i + 1] = rest[i + 1] + ny;
          arr[i + 2] = rest[i + 2] + nz;
        }
      }
      attr.needsUpdate = true;
    }

    // It turns faster while it is open, which is what makes the break read as an event
    // rather than as the object quietly inflating.
    const urgency = 1 + open * 2.2;
    g.rotation.x += dt * 0.09 * urgency;
    g.rotation.y += dt * 0.14 * urgency;

    target.current.x = state.pointer.y * 0.3;
    target.current.y = state.pointer.x * 0.45;
    g.rotation.x += (target.current.x - g.rotation.x * 0.06) * dt * 0.6;
    g.rotation.y += (target.current.y - g.rotation.y * 0.06) * dt * 0.6;
  });

  const low = quality === "low";

  return (
    <group ref={groupRef}>
      <group ref={spin}>
        <mesh ref={mesh} scale={1.24} geometry={geometry}>
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
