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
