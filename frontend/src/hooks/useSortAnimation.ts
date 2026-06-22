import { invoke } from "@tauri-apps/api/core";
import { useCallback, useEffect, useMemo, useReducer, useState } from "react";

import { animationReducer, createAnimationState } from "../lib/animationState";
import { generateValues } from "../lib/generateValues";
import type { SortResult } from "../types/sorting";

const INITIAL_SIZE = 64;

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export function useSortAnimation() {
  const [size, setSizeState] = useState(INITIAL_SIZE);
  const [speed, setSpeed] = useState(50);
  const [state, dispatch] = useReducer(
    animationReducer,
    generateValues(INITIAL_SIZE),
    createAnimationState,
  );

  const prepare = useCallback(
    async (play: boolean, stepOnce = false) => {
      dispatch({ type: "loading" });
      try {
        const result = await invoke<SortResult>("generate_sort_steps", {
          algorithm: "bubble",
          values: state.initialValues,
        });
        dispatch({ type: "loaded", result, play });
        if (stepOnce) dispatch({ type: "applyNext" });
      } catch (error) {
        dispatch({ type: "failure", message: errorMessage(error) });
      }
    },
    [state.initialValues],
  );

  const play = useCallback(() => {
    if (state.status === "loading") return;
    if (state.steps.length === 0 || state.status === "complete") {
      void prepare(true);
      return;
    }
    dispatch({ type: "play" });
  }, [prepare, state.status, state.steps.length]);

  const pause = useCallback(() => dispatch({ type: "pause" }), []);
  const reset = useCallback(() => dispatch({ type: "reset" }), []);
  const shuffle = useCallback(() => {
    dispatch({ type: "replaceValues", values: generateValues(size) });
  }, [size]);
  const step = useCallback(() => {
    if (state.status === "loading") return;
    if (state.steps.length === 0 || state.status === "complete") {
      void prepare(false, true);
      return;
    }
    dispatch({ type: "pause" });
    dispatch({ type: "applyNext" });
  }, [prepare, state.status, state.steps.length]);
  const setSize = useCallback((nextSize: number) => {
    setSizeState(nextSize);
    dispatch({ type: "replaceValues", values: generateValues(nextSize) });
  }, []);

  useEffect(() => {
    if (state.status !== "playing") return;
    const delay = Math.max(24, 130 - speed);
    const stepsPerTick = Math.max(1, Math.round((speed / 100) ** 2 * 80));
    const timeout = window.setTimeout(() => {
      for (let index = 0; index < stepsPerTick; index += 1) {
        dispatch({ type: "applyNext" });
      }
    }, delay);
    return () => window.clearTimeout(timeout);
  }, [speed, state.currentStep, state.status]);

  const progress = useMemo(
    () => (state.steps.length === 0 ? 0 : (state.currentStep / state.steps.length) * 100),
    [state.currentStep, state.steps.length],
  );

  return {
    state,
    size,
    speed,
    progress,
    setSize,
    setSpeed,
    shuffle,
    reset,
    play,
    pause,
    step,
  };
}
