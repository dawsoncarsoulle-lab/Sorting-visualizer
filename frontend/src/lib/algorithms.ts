import type { AlgorithmInfo } from "../types/sorting";

export function isAlgorithmInfo(value: unknown): value is AlgorithmInfo {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === "string" &&
    candidate.id.length > 0 &&
    typeof candidate.name === "string" &&
    typeof candidate.family === "string" &&
    candidate.family.length > 0 &&
    typeof candidate.description === "string" &&
    typeof candidate.sourcePath === "string" &&
    typeof candidate.source === "string" &&
    typeof candidate.bestCase === "string" &&
    typeof candidate.averageCase === "string" &&
    typeof candidate.worstCase === "string" &&
    typeof candidate.stable === "boolean" &&
    typeof candidate.inPlace === "boolean" &&
    typeof candidate.memory === "string"
  );
}
