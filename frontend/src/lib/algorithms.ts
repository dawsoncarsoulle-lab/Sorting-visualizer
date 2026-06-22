import type { AlgorithmId, AlgorithmInfo } from "../types/sorting";

export const ALGORITHM_IDS = [
  "bubble",
  "selection",
  "insertion",
  "cocktail",
  "comb",
  "shell",
  "quick",
  "merge",
  "heap",
  "gnome",
] as const satisfies readonly AlgorithmId[];

export function isAlgorithmId(value: string): value is AlgorithmId {
  return (ALGORITHM_IDS as readonly string[]).includes(value);
}

export function isAlgorithmInfo(value: unknown): value is AlgorithmInfo {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === "string" &&
    isAlgorithmId(candidate.id) &&
    typeof candidate.name === "string" &&
    (candidate.family === "Simple" || candidate.family === "Efficient") &&
    typeof candidate.description === "string" &&
    typeof candidate.sourcePath === "string" &&
    typeof candidate.source === "string"
  );
}
