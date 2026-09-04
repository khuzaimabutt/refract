/**
 * A still grain layer over the whole page.
 *
 * This is not texture for its own sake. A near-black ground with a soft, bright 3D
 * object on it bands badly on 8-bit displays, showing concentric rings around the
 * highlights. A few percent of noise dithers those rings away. Inlined as a URI so it
 * costs no network request, and URI-encoded rather than base64 so it does not depend on
 * btoa existing in whichever runtime renders this.
 */
const NOISE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="140" height="140"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/></filter><rect width="140" height="140" filter="url(#n)" opacity="0.5"/></svg>`;

const NOISE = `data:image/svg+xml;utf8,${encodeURIComponent(NOISE_SVG)}`;

export function Grain() {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 3,
        pointerEvents: "none",
        backgroundImage: `url("${NOISE}")`,
        backgroundRepeat: "repeat",
        opacity: 0.038,
        mixBlendMode: "overlay",
      }}
    />
  );
}
