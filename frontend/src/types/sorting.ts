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

export type OperationKind = "compare" | "swap" | "set" | "markSorted";

export type ActiveOperation = {
  kind: OperationKind;
  description: string;
};

export type AnimationMode = "educational" | "fast";

export type AlgorithmId = string;

export type AlgorithmInfo = {
  id: AlgorithmId;
  name: string;
  family: string;
  description: string;
  sourcePath: string;
  source: string;
  bestCase: string;
  averageCase: string;
  worstCase: string;
  stable: boolean;
  inPlace: boolean;
  memory: string;
};
