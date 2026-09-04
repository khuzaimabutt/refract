"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import type { Group } from "three";
import { SceneContents } from "./SceneContents";

/**
 * The fixed 3D layer. It sits behind the whole document and never scrolls itself; the
 * camera moves instead, driven by scroll progress, which is what lets one object travel
 * the length of a page without any section owning it.
 *
 * The environment map is doing more work than the lights here. Transmissive glass shows
 * you its surroundings, so with nothing to reflect it reads as grey jelly. "studio"
 * gives it bright panels to catch along the facet edges.
 */
export function Stage() {
  const objectRef = useRef<Group>(null);
  const [quality, setQuality] = useState<"high" | "low">("high");

  useEffect(() => {
    const decide = () => setQuality(window.innerWidth < 768 ? "low" : "high");
    decide();
    window.addEventListener("resize", decide);
    return () => window.removeEventListener("resize", decide);
  }, []);

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ fov: 35, position: [0, 0, 8] }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
    >
      <SceneContents objectRef={objectRef} quality={quality} />
    </Canvas>
  );
}
