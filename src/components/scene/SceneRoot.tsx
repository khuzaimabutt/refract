"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Decides whether the 3D layer runs at all, and keeps it off the critical path.
 *
 * The Stage is imported dynamically so three.js and the R3F runtime are not in the
 * bundle that renders the headline. The headline is the largest paint on the page, and
 * it should not wait behind a 3D engine to appear.
 *
 * Three conditions send us to the still image instead: the visitor asked for reduced
 * motion, the browser cannot give us a WebGL context, or the context is lost later and
 * does not come back. In every case the page keeps its composition, because the poster
 * is a render of this same object in the same position.
 */
const Stage = dynamic(() => import("./Stage").then((m) => m.Stage), { ssr: false });

function canRenderWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") ?? c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function SceneRoot() {
  const [mode, setMode] = useState<"pending" | "live" | "poster">("pending");

  useEffect(() => {
    if (prefersReducedMotion() || !canRenderWebGL()) {
      setMode("poster");
      // Tells the document to bring the headline back, since the version that would
      // have been rendered in the scene is never going to appear.
      document.documentElement.dataset.scene = "poster";
      return;
    }
    setMode("live");
    document.documentElement.dataset.scene = "live";

    const onLost = () => {
      setMode("poster");
      document.documentElement.dataset.scene = "poster";
    };
    window.addEventListener("webglcontextlost", onLost);
    return () => window.removeEventListener("webglcontextlost", onLost);
  }, []);

  if (mode === "poster") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img className="scene-poster" src="/poster.jpg" alt="" aria-hidden />
    );
  }
  if (mode === "pending") return null;
  return <Stage />;
}
