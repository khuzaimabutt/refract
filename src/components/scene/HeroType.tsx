"use client";

import { useRef } from "react";
import { Text } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import type { Mesh, MeshBasicMaterial } from "three";
import { scrollProgress } from "./scroll-progress";

/**
 * The headline, rendered inside the 3D scene rather than in the DOM.
 *
 * This is the piece that makes the whole idea work. WebGL cannot see the document, so
 * transmissive glass sitting in front of an HTML heading refracts nothing: it samples
 * the 3D scene behind it, finds an empty black room, and reads as polished plastic.
 * Putting the type in the scene gives the glass something real to bend.
 *
 * The DOM keeps a visually hidden copy of the same words, so the page still has one
 * real <h1> for search engines, screen readers and text selection.
 */
export function HeroType() {
  const { viewport } = useThree();
  const ref = useRef<Mesh>(null);

  /**
   * The canvas is fixed, so nothing in the scene scrolls away on its own. Left alone,
   * this headline sat on top of every section for the length of the page and collided
   * with the closing headline. It has to leave when the hero does, so it fades out
   * across the first stretch of scroll and is fully gone before the first beat lands.
   */
  useFrame(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const p = scrollProgress.value;
    const opacity = 1 - Math.min(1, Math.max(0, (p - 0.04) / 0.09));
    const mat = mesh.material as MeshBasicMaterial;
    mat.transparent = true;
    mat.opacity = opacity;
    // Stop drawing it entirely once invisible, so it costs nothing for the rest of
    // the page and can never be picked up by the glass behind a later section.
    mesh.visible = opacity > 0.01;
  });

  /**
   * The poster capture asks for the scene without its type. The still fallback is
   * object-fit: cover, so on a narrow phone a landscape image with words baked into it
   * would crop them in half, and the document already shows a real headline in that
   * mode. So the poster carries the crystal and its light and nothing else.
   */
  if (typeof window !== "undefined" && window.location.search.includes("poster")) {
    return null;
  }

  // Tracked in world units so the type scales with the frame the way a vw-based
  // headline does, instead of drifting off the sides on a wide monitor.
  const size = Math.min(viewport.width * 0.115, 1.35);

  return (
    <group position={[0, 0, -1.6]}>
      <Text
        ref={ref}
        font="/fonts/ClashDisplay-Semibold.ttf"
        fontSize={size}
        color="#e6ece9"
        anchorX="center"
        anchorY="middle"
        lineHeight={0.92}
        letterSpacing={-0.028}
        maxWidth={viewport.width * 0.92}
        textAlign="center"
      >
        {"See through\nyour agents."}
      </Text>
    </group>
  );
}
