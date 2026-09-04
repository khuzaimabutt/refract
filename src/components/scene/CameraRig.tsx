"use client";

import { useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Group } from "three";
import { scrollProgress } from "./scroll-progress";

/**
 * Scroll position, expressed as where the object should be and how close the camera is.
 *
 * Columns: [progress, cameraZ, cameraY, objectX, objectY, scale]
 *
 * The object crosses to whichever side the text is not on, and on the beats it settles
 * roughly where the mocked plate sits. That is deliberate: the plate is translucent, so
 * the glass passing behind it blooms through the frosted panel instead of colliding with
 * it. The two pieces of glass are meant to read as the same material.
 */
const KEYS: [number, number, number, number, number, number][] = [
  [0.0, 8.0, 0.0, 0.55, 0.1, 0.78],
  [0.2, 7.0, 0.1, 1.7, 0.0, 0.72],
  [0.44, 6.3, 0.15, -1.7, 0.0, 0.68],
  [0.66, 5.8, 0.1, 1.6, 0.0, 0.62],
  [0.84, 6.6, 0.0, 0.0, 0.0, 0.4],
  // The closing headline is centred, so the crystal returns to the middle behind it.
  [0.93, 7.6, 0.0, 0.0, 0.0, 0.85],
  // The footer is left-aligned and signed with a name set large. The crystal moves
  // right and lifts out of its way rather than sitting behind the last few letters.
  [1.0, 8.2, 0.25, 1.85, 0.15, 0.6],
];

function sample(p: number): [number, number, number, number, number] {
  const t = Math.min(1, Math.max(0, p));
  for (let i = 0; i < KEYS.length - 1; i++) {
    const a = KEYS[i];
    const b = KEYS[i + 1];
    if (t >= a[0] && t <= b[0]) {
      const span = b[0] - a[0] || 1;
      const k = (t - a[0]) / span;
      // Smoothstep between keyframes, so the object eases through each stop rather
      // than changing direction on a corner.
      const e = k * k * (3 - 2 * k);
      return [
        a[1] + (b[1] - a[1]) * e,
        a[2] + (b[2] - a[2]) * e,
        a[3] + (b[3] - a[3]) * e,
        a[4] + (b[4] - a[4]) * e,
        a[5] + (b[5] - a[5]) * e,
      ];
    }
  }
  const last = KEYS[KEYS.length - 1];
  return [last[1], last[2], last[3], last[4], last[5]];
}

export function CameraRig({ objectRef }: { objectRef: React.RefObject<Group | null> }) {
  const { camera } = useThree();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const st = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      // Written to a ref, never to React state. Setting state on every scroll frame
      // would re-render the whole tree sixty times a second.
      onUpdate: (self) => {
        scrollProgress.value = self.progress;
      },
    });
    return () => st.kill();
  }, []);

  useFrame((_, delta) => {
    const [cz, cy, ox, oy, scale] = sample(scrollProgress.value);
    const dt = Math.min(delta, 0.05);
    // Lerped rather than assigned, so the travel keeps a little inertia and never
    // steps when the scroll position jumps.
    const k = 1 - Math.pow(0.0015, dt);

    camera.position.z += (cz - camera.position.z) * k;
    camera.position.y += (cy - camera.position.y) * k;

    const g = objectRef.current;
    if (g) {
      g.position.x += (ox - g.position.x) * k;
      g.position.y += (oy - g.position.y) * k;
      const s = g.scale.x + (scale - g.scale.x) * k;
      g.scale.setScalar(s);
    }
  });

  return null;
}
