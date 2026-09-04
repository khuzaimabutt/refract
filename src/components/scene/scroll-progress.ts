/**
 * Scroll position through the page, 0 at the top and 1 at the bottom.
 *
 * A plain mutable object rather than React state, because it is written on every scroll
 * frame and read inside useFrame. Putting this in state would re-render the tree sixty
 * times a second to communicate a number that only the render loop cares about.
 *
 * CameraRig owns the writing; anything inside the canvas may read it.
 */
export const scrollProgress = { value: 0 };

/**
 * Progress through the pinned capability sequence, 0 before it and 1 after.
 *
 * Separate from page scroll on purpose: the crystal's performance is tied to where you
 * are inside that pinned stage, which is not the same thing as where you are in the
 * document.
 */
export const beatStage = { value: 0 };
