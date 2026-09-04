"use client";

import { useMemo, useRef } from "react";
import { CanvasTexture, SRGBColorSpace } from "three";
import { useFrame } from "@react-three/fiber";
import type { Group, Mesh } from "three";

/**
 * A very dark gradient wall behind everything in the scene.
 *
 * Transmissive glass can only show you what is behind it. With an empty black room back
 * there, every facet that does not happen to line up with the headline samples nothing
 * and renders as a flat black shard, which is what made the first version read as
 * plastic. This gives the material something to find in every direction: a faint pool of
 * light that the facets pick up, bend and disperse.
 *
 * It is drawn once into a canvas rather than shipped as an image, so it costs no request
 * and stays perfectly smooth at any size.
 */
export function Backdrop({
  width,
  height,
  follow,
}: {
  width: number;
  height: number;
  /** The object the pool of light should stay behind. */
  follow?: React.RefObject<Group | null>;
}) {
  const mesh = useRef<Mesh>(null);

  /**
   * The light travels with the crystal.
   *
   * The pool is deliberately tight, so a fixed one lit only the centre of the frame.
   * As soon as the crystal moved aside for a section of text it left the light behind,
   * and glass with nothing bright behind it goes dark: the same failure that made the
   * first version read as black plastic, arriving later by a different route. Following
   * at a fraction of the object's travel keeps the crystal lit without the background
   * visibly sliding around behind the type.
   */
  useFrame(() => {
    const m = mesh.current;
    const target = follow?.current;
    if (!m || !target) return;
    m.position.x += (target.position.x * 0.75 - m.position.x) * 0.06;
    m.position.y += (target.position.y * 0.75 - m.position.y) * 0.06;
  });

  const texture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 64;
    c.height = 64;
    const ctx = c.getContext("2d");
    if (ctx) {
      // The pool has to stay small. This texture is stretched across a plane several
      // times the size of the viewport, so a gradient that looks tight at 64px still
      // covers the screen once scaled: the first attempt lifted the entire page off
      // near-black into teal. Reaching ground colour by 30% of the radius keeps the
      // light where the glass can find it and leaves the rest of the page alone.
      const g = ctx.createRadialGradient(32, 30, 1, 32, 32, 32);
      g.addColorStop(0, "#24393f");
      g.addColorStop(0.12, "#12242a");
      g.addColorStop(0.3, "#04090b");
      g.addColorStop(1, "#04090b");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 64, 64);
    }
    const t = new CanvasTexture(c);
    t.colorSpace = SRGBColorSpace;
    return t;
  }, []);

  return (
    <mesh ref={mesh} position={[0, 0, -6]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}
