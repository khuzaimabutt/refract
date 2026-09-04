"use client";

import { Environment } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import type { Group } from "three";
import { GlassObject } from "./GlassObject";
import { CameraRig } from "./CameraRig";
import { HeroType } from "./HeroType";
import { Backdrop } from "./Backdrop";

/**
 * Everything inside the canvas. Separated from Stage because these pieces need the
 * viewport in world units, which only exists inside the R3F tree.
 *
 * Order matters here: the backdrop sits furthest away, the headline in front of it, and
 * the glass in front of both, so the material has two layers of content to bend.
 */
export function SceneContents({
  objectRef,
  quality,
}: {
  objectRef: React.RefObject<Group | null>;
  quality: "high" | "low";
}) {
  const { viewport } = useThree();

  return (
    <>
      {/* The environment does more than the lights here. Transmissive glass shows its
          surroundings, so with nothing around it the material reads as grey jelly.

          Not "studio": that preset is built from hard rectangular softboxes, and on
          twenty flat facets with almost no roughness each panel came back as a sharp
          white polygon sitting inside the crystal. "city" is broken up and directional
          without a single dominant bright rectangle to mirror. */}
      <Environment preset="city" environmentIntensity={1.05} />
      <directionalLight position={[4, 3, -6]} intensity={2.2} />
      <directionalLight position={[-5, -2, -4]} intensity={1.4} />

      {/* Generously oversized: the camera pulls back to z=8 and pans, and any edge of
          this plane appearing in frame would read as a seam in the dark. */}
      <Backdrop width={viewport.width * 3} height={viewport.height * 3} follow={objectRef} />
      <HeroType />
      <GlassObject groupRef={objectRef} quality={quality} />
      <CameraRig objectRef={objectRef} />
    </>
  );
}
