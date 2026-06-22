import { describe, expect, it } from "vitest";

import { generateValues } from "./generateValues";

describe("generateValues", () => {
  it("returns every value exactly once", () => {
    const values = generateValues(5, () => 0);
    expect([...values].sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5]);
  });
});

