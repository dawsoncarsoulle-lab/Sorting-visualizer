export type SortStep =
  | { type: "Compare"; i: number; j: number; sourceLine: number }
  | { type: "Swap"; i: number; j: number; sourceLine: number }
  | { type: "Set"; i: number; value: number; sourceLine: number }
  | { type: "MarkSorted"; i: number; sourceLine: number };

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

export type AlgorithmId =
  | "bubble"
  | "selection"
  | "insertion"
  | "cocktail"
  | "comb"
  | "shell"
  | "quick"
  | "merge"
  | "heap"
  | "gnome";

export type AlgorithmInfo = {
  id: AlgorithmId;
  name: string;
  family: "Simple" | "Efficient";
  description: string;
  sourcePath: string;
  source: string;
};
