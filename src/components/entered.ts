"use client";

import { createContext, useContext } from "react";

/**
 * True once the load sequence has finished.
 *
 * The hero's reveal keys off this rather than off scroll: playing it on arrival would
 * mean playing it behind the preloader, so the visitor would watch the wipe lift on
 * content that had already finished animating.
 */
export const EnteredContext = createContext(false);
export const useEntered = () => useContext(EnteredContext);
