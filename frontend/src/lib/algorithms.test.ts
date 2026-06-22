import { describe, expect, it } from "vitest";

import { ALGORITHM_IDS, isAlgorithmInfo } from "./algorithms";

describe("algorithm registry", () => {
  it("exposes ten unique algorithms", () => {
    expect(ALGORITHM_IDS).toHaveLength(10);
    expect(new Set(ALGORITHM_IDS).size).toBe(ALGORITHM_IDS.length);
  });

  it("validates catalog entries received from Rust", () => {
    expect(
      isAlgorithmInfo({
        id: "quick",
        name: "Quick Sort",
        family: "Efficient",
        description: "Description",
        sourcePath: "quick.rs",
        source: "fn quick_sort() {}",
      }),
    ).toBe(true);
    expect(isAlgorithmInfo({ id: "unknown" })).toBe(false);
  });
});
