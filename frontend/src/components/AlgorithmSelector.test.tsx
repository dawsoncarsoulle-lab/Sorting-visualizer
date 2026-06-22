// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { AlgorithmInfo } from "../types/sorting";
import { AlgorithmSelector } from "./AlgorithmSelector";

const algorithms: AlgorithmInfo[] = [
  {
    id: "bubble",
    name: "Bubble Sort",
    family: "Simple",
    description: "Bubble description",
    sourcePath: "bubble.rs",
    source: "fn bubble_sort() {}",
    bestCase: "O(n)",
    averageCase: "O(n²)",
    worstCase: "O(n²)",
    stable: true,
    inPlace: true,
    memory: "O(1)",
  },
  {
    id: "quick",
    name: "Quick Sort",
    family: "Efficient",
    description: "Quick description",
    sourcePath: "quick.rs",
    source: "fn quick_sort() {}",
    bestCase: "O(n log n)",
    averageCase: "O(n log n)",
    worstCase: "O(n²)",
    stable: false,
    inPlace: true,
    memory: "O(log n)",
  },
];

afterEach(cleanup);

describe("AlgorithmSelector", () => {
  it("opens its dark custom list and selects an algorithm", () => {
    const onChange = vi.fn();
    render(
      <AlgorithmSelector
        algorithms={algorithms}
        value="bubble"
        disabled={false}
        onChange={onChange}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /Bubble Sort/ }));
    expect(screen.getByRole("listbox")).toBeTruthy();
    fireEvent.click(screen.getByRole("option", { name: "Quick Sort" }));

    expect(onChange).toHaveBeenCalledWith("quick");
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("supports arrows, Enter and Escape from the trigger", () => {
    const onChange = vi.fn();
    render(
      <AlgorithmSelector
        algorithms={algorithms}
        value="bubble"
        disabled={false}
        onChange={onChange}
      />,
    );
    const trigger = screen.getByRole("button", { name: /Bubble Sort/ });
    trigger.focus();

    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    fireEvent.keyDown(trigger, { key: "Enter" });
    expect(onChange).toHaveBeenCalledWith("quick");

    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    fireEvent.keyDown(trigger, { key: "Escape" });
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });
});
