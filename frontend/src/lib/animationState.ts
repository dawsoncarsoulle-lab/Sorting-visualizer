import type { AnimationStatus, SortResult, SortStats, SortStep } from "../types/sorting";

export type AnimationState = {
  initialValues: number[];
  values: number[];
  steps: SortStep[];
  expectedStats: SortStats;
  liveStats: SortStats;
  currentStep: number;
  highlighted: number[];
  sortedIndices: Set<number>;
  status: AnimationStatus;
  error: string | null;
};

export type AnimationAction =
  | { type: "replaceValues"; values: number[] }
  | { type: "loading" }
  | { type: "loaded"; result: SortResult; play: boolean }
  | { type: "play" }
  | { type: "pause" }
  | { type: "applyNext" }
  | { type: "reset" }
  | { type: "failure"; message: string };

const emptyStats = (): SortStats => ({ comparisons: 0, swaps: 0, writes: 0 });

export function createAnimationState(values: number[]): AnimationState {
  return {
    initialValues: [...values],
    values: [...values],
    steps: [],
    expectedStats: emptyStats(),
    liveStats: emptyStats(),
    currentStep: 0,
    highlighted: [],
    sortedIndices: new Set(),
    status: "idle",
    error: null,
  };
}

function applyStep(state: AnimationState, step: SortStep): AnimationState {
  const values = [...state.values];
  const sortedIndices = new Set(state.sortedIndices);
  const liveStats = { ...state.liveStats };
  let highlighted: number[] = [];

  switch (step.type) {
    case "Compare":
      highlighted = [step.i, step.j];
      liveStats.comparisons += 1;
      break;
    case "Swap":
      [values[step.i], values[step.j]] = [values[step.j], values[step.i]];
      highlighted = [step.i, step.j];
      liveStats.swaps += 1;
      break;
    case "Set":
      values[step.i] = step.value;
      highlighted = [step.i];
      liveStats.writes += 1;
      break;
    case "MarkSorted":
      sortedIndices.add(step.i);
      break;
  }

  return { ...state, values, sortedIndices, liveStats, highlighted };
}

export function animationReducer(state: AnimationState, action: AnimationAction): AnimationState {
  switch (action.type) {
    case "replaceValues":
      return createAnimationState(action.values);
    case "loading":
      return { ...state, status: "loading", error: null };
    case "loaded":
      return {
        ...createAnimationState(state.initialValues),
        steps: action.result.steps,
        expectedStats: action.result.stats,
        status: action.play ? "playing" : "ready",
      };
    case "play":
      return { ...state, status: "playing", error: null };
    case "pause":
      return { ...state, status: state.currentStep > 0 ? "ready" : "idle" };
    case "applyNext": {
      if (state.currentStep >= state.steps.length) {
        return { ...state, highlighted: [], status: "complete" };
      }

      const nextState = applyStep(state, state.steps[state.currentStep]);
      const currentStep = state.currentStep + 1;
      const complete = currentStep >= state.steps.length;
      return {
        ...nextState,
        currentStep,
        highlighted: complete ? [] : nextState.highlighted,
        status: complete ? "complete" : state.status,
      };
    }
    case "reset":
      return createAnimationState(state.initialValues);
    case "failure":
      return { ...state, status: "idle", error: action.message };
  }
}

