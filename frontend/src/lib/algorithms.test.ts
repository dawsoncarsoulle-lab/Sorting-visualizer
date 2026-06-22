import { describe, expect, it } from "vitest";

import { isAlgorithmInfo } from "./algorithms";

describe("algorithm registry", () => {
  it("validates catalog entries received from Rust", () => {
    expect(
      isAlgorithmInfo({
        id: "quick",
        name: "Quick Sort",
        family: "Efficient",
        description: "Description",
        sourcePath: "quick.rs",
        source: "fn quick_sort() {}",
        bestCase: "O(n log n)",
        averageCase: "O(n log n)",
        worstCase: "O(n²)",
        stable: false,
        inPlace: true,
        memory: "O(log n)",
      }),
    ).toBe(true);
    expect(isAlgorithmInfo({ id: "" })).toBe(false);
  });
});
