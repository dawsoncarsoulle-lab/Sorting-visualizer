// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
  },
  {
    id: "quick",
    name: "Quick Sort",
    family: "Efficient",
    description: "Quick description",
    sourcePath: "quick.rs",
    source: "fn quick_sort() {}",
  },
];

afterEach(cleanup);

describe("AlgorithmSelector", () => {
  it("opens its dark custom list and selects an algorithm", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <AlgorithmSelector
        algorithms={algorithms}
        value="bubble"
        disabled={false}
        onChange={onChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: /Bubble Sort/ }));
    expect(screen.getByRole("listbox")).toBeTruthy();
    await user.click(screen.getByRole("option", { name: "Quick Sort" }));

    expect(onChange).toHaveBeenCalledWith("quick");
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("supports arrows, Enter and Escape from the trigger", async () => {
    const user = userEvent.setup();
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

    await user.keyboard("{ArrowDown}{ArrowDown}{Enter}");
    expect(onChange).toHaveBeenCalledWith("quick");

    await user.keyboard("{ArrowDown}{Escape}");
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });
});
