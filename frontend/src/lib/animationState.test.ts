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
          { type: "Compare", i: 0, j: 1, sourceLine: 10 },
          { type: "Swap", i: 0, j: 1, sourceLine: 12 },
          { type: "MarkSorted", i: 1, sourceLine: 14 },
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
    expect(state.activeSourceLine).toBeNull();
  });

  it("restores the initial values on reset", () => {
    const state = animationReducer(createAnimationState([3, 1, 2]), { type: "reset" });
    expect(state.values).toEqual([3, 1, 2]);
    expect(state.currentStep).toBe(0);
    expect(state.activeSourceLine).toBeNull();
  });

  it("tracks the current source line while playing or paused", () => {
    let state = createAnimationState([2, 1]);
    state = animationReducer(state, {
      type: "loaded",
      play: true,
      result: {
        steps: [
          { type: "Compare", i: 0, j: 1, sourceLine: 21 },
          { type: "Swap", i: 0, j: 1, sourceLine: 23 },
        ],
        stats: { comparisons: 1, swaps: 1, writes: 0 },
      },
    });
    state = animationReducer(state, { type: "applyNext" });
    expect(state.activeSourceLine).toBe(21);

    state = animationReducer(state, { type: "pause" });
    expect(state.activeSourceLine).toBe(21);

    state = animationReducer(state, { type: "reset" });
    expect(state.activeSourceLine).toBeNull();
  });
});
