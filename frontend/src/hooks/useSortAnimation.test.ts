// @vitest-environment jsdom

import { invoke } from "@tauri-apps/api/core";
import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { SortResult } from "../types/sorting";
import { useSortAnimation } from "./useSortAnimation";

vi.mock("@tauri-apps/api/core", () => ({ invoke: vi.fn() }));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("useSortAnimation", () => {
  it("ignores a stale Rust result after changing algorithm", async () => {
    let resolveRequest: (result: SortResult) => void = () => undefined;
    vi.mocked(invoke).mockReturnValueOnce(
      new Promise<SortResult>((resolve) => {
        resolveRequest = resolve;
      }),
    );
    const { result } = renderHook(() => useSortAnimation());

    act(() => result.current.play());
    await waitFor(() => expect(result.current.state.status).toBe("loading"));

    act(() => result.current.setAlgorithm("quick"));
    act(() => {
      resolveRequest({
        steps: [{ type: "MarkSorted", i: 0, sourceLine: 20 }],
        stats: { comparisons: 0, swaps: 0, writes: 0 },
      });
    });

    await waitFor(() => expect(result.current.algorithm).toBe("quick"));
    expect(result.current.state.status).toBe("idle");
    expect(result.current.state.steps).toEqual([]);
  });
});
