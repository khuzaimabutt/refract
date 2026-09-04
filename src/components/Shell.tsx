"use client";

import { useCallback, useState, type ReactNode } from "react";
import { MotionRoot } from "./MotionRoot";
import { Preloader } from "./Preloader";
import { EnteredContext } from "./entered";

/**
 * Holds the one piece of state the whole page shares: whether the load sequence has
 * finished. The hero waits for it so its reveal does not play behind the preloader,
 * and everything below is driven by scroll instead, so nothing else needs to know.
 */
export function Shell({ children }: { children: ReactNode }) {
  const [entered, setEntered] = useState(false);
  const onDone = useCallback(() => setEntered(true), []);

  return (
    <MotionRoot>
      <Preloader onDone={onDone} />
      <EnteredContext.Provider value={entered}>{children}</EnteredContext.Provider>
    </MotionRoot>
  );
}
