import type {
  ActiveOperation,
  AnimationStatus,
  SortResult,
  SortStats,
  SortStep,
} from "../types/sorting";

export type AnimationState = {
  initialValues: number[];
  values: number[];
  steps: SortStep[];
  expectedStats: SortStats;
  liveStats: SortStats;
  currentStep: number;
  highlighted: number[];
  sortedIndices: Set<number>;
  activeSourceLine: number | null;
  activeOperation: ActiveOperation | null;
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
  | { type: "applyMany"; count: number }
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
    activeSourceLine: null,
    activeOperation: null,
    status: "idle",
    error: null,
  };
}

function applyMany(state: AnimationState, count: number): AnimationState {
  if (state.currentStep >= state.steps.length) {
    return {
      ...state,
      highlighted: [],
      activeSourceLine: null,
      activeOperation: null,
      status: "complete",
    };
  }

  const values = [...state.values];
  const sortedIndices = new Set(state.sortedIndices);
  const liveStats = { ...state.liveStats };
  let highlighted: number[] = [];
  let activeSourceLine: number | null = null;
  let activeOperation: ActiveOperation | null = null;
  const end = Math.min(state.currentStep + Math.max(1, count), state.steps.length);

  for (let index = state.currentStep; index < end; index += 1) {
    const step = state.steps[index];
    activeSourceLine = step.sourceLine;
    switch (step.type) {
      case "Compare":
        highlighted = [step.i, step.j];
        liveStats.comparisons += 1;
        activeOperation = {
          kind: "compare",
          description: `Comparaison des indices ${step.i} et ${step.j}`,
        };
        break;
      case "Swap":
        [values[step.i], values[step.j]] = [values[step.j], values[step.i]];
        highlighted = [step.i, step.j];
        liveStats.swaps += 1;
        activeOperation = {
          kind: "swap",
          description: `Échange des indices ${step.i} et ${step.j}`,
        };
        break;
      case "Set":
        values[step.i] = step.value;
        highlighted = [step.i];
        liveStats.writes += 1;
        activeOperation = {
          kind: "set",
          description: `Écriture de ${step.value} à l’indice ${step.i}`,
        };
        break;
      case "MarkSorted":
        sortedIndices.add(step.i);
        highlighted = [];
        activeOperation = {
          kind: "markSorted",
          description: `Indice ${step.i} marqué comme trié`,
        };
        break;
    }
  }

  const complete = end >= state.steps.length;
  return {
    ...state,
    values,
    sortedIndices,
    liveStats,
    currentStep: end,
    highlighted: complete ? [] : highlighted,
    activeSourceLine: complete ? null : activeSourceLine,
    activeOperation: complete ? null : activeOperation,
    status: complete ? "complete" : state.status,
  };
}

export function animationReducer(state: AnimationState, action: AnimationAction): AnimationState {
  switch (action.type) {
    case "replaceValues":
      return createAnimationState(action.values);
    case "loading":
      return {
        ...state,
        status: "loading",
        activeSourceLine: null,
        activeOperation: null,
        error: null,
      };
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
    case "applyNext":
      return applyMany(state, 1);
    case "applyMany":
      return applyMany(state, action.count);
    case "reset":
      return createAnimationState(state.initialValues);
    case "failure":
      return { ...state, status: "idle", error: action.message };
  }
}
