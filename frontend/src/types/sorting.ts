export type SortStep =
  | { type: "Compare"; i: number; j: number }
  | { type: "Swap"; i: number; j: number }
  | { type: "Set"; i: number; value: number }
  | { type: "MarkSorted"; i: number };

export type SortStats = {
  comparisons: number;
  swaps: number;
  writes: number;
};

export type SortResult = {
  steps: SortStep[];
  stats: SortStats;
};

export type AnimationStatus = "idle" | "loading" | "ready" | "playing" | "complete";

