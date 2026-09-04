"use client";

import { Text } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

/**
 * The headline, rendered inside the 3D scene rather than in the DOM.
 *
 * This is the piece that makes the whole idea work. WebGL cannot see the document, so
 * transmissive glass sitting in front of an HTML heading refracts nothing: it samples
 * the 3D scene behind it, finds an empty black room, and reads as polished plastic.
 * Putting the type in the scene gives the glass something real to bend, which is the
 * entire premise of the page.
 *
 * The DOM keeps a visually hidden copy of the same words, so the page still has one
 * real <h1> for search engines, screen readers and text selection.
 */
export function HeroType() {
  const { viewport } = useThree();

  /**
   * The poster capture asks for the scene without its type.
   *
   * The still fallback is object-fit: cover, so on a narrow phone a landscape image
   * with words baked into it would crop them in half, and the document already shows
   * a real headline in that mode. So the poster carries the crystal and its light and
   * nothing else, and stays correct at any aspect ratio.
   */
  if (typeof window !== "undefined" && window.location.search.includes("poster")) {
    return null;
  }
  // Track the viewport in world units so the type scales with the frame the way a CSS
  // vw-based headline does, instead of drifting off the sides on a wide monitor.
  const size = Math.min(viewport.width * 0.115, 1.35);

  return (
    <group position={[0, 0, -1.6]}>
      <Text
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
