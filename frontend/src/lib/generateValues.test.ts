import { describe, expect, it } from "vitest";

import { generateValues } from "./generateValues";

describe("generateValues", () => {
  it("returns every value exactly once", () => {
    const values = generateValues(5, "random", () => 0);
    expect([...values].sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5]);
  });

  it("generates the ordered structural patterns", () => {
    expect(generateValues(5, "sorted")).toEqual([1, 2, 3, 4, 5]);
    expect(generateValues(5, "reversed")).toEqual([5, 4, 3, 2, 1]);
    expect(generateValues(5, "mountain")).toEqual([1, 2, 3, 2, 1]);
    expect(generateValues(5, "valley")).toEqual([3, 2, 1, 2, 3]);
  });

  it("limits few unique values", () => {
    expect(new Set(generateValues(100, "few_unique", () => 0)).size).toBe(5);
  });
});
