import { describe, expect, it } from "vitest";

import { animationReducer, createAnimationState } from "./animationState";

describe("animationReducer", () => {
  it("replays comparison, swap and sorted steps", () => {
    let state = createAnimationState([2, 1]);
    state = animationReducer(state, {
      type: "loaded",
      play: true,
      result: {
        steps: [
          { type: "Compare", i: 0, j: 1 },
          { type: "Swap", i: 0, j: 1 },
          { type: "MarkSorted", i: 1 },
        ],
        stats: { comparisons: 1, swaps: 1, writes: 0 },
      },
    });

    state = animationReducer(state, { type: "applyNext" });
    state = animationReducer(state, { type: "applyNext" });
    state = animationReducer(state, { type: "applyNext" });

    expect(state.values).toEqual([1, 2]);
    expect(state.liveStats).toEqual({ comparisons: 1, swaps: 1, writes: 0 });
    expect(state.sortedIndices.has(1)).toBe(true);
    expect(state.status).toBe("complete");
  });

  it("restores the initial values on reset", () => {
    const state = animationReducer(createAnimationState([3, 1, 2]), { type: "reset" });
    expect(state.values).toEqual([3, 1, 2]);
    expect(state.currentStep).toBe(0);
  });
});

