// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import type { AlgorithmInfo } from "../types/sorting";
import { AlgorithmCodePanel } from "./AlgorithmCodePanel";

const algorithm: AlgorithmInfo = {
  id: "bubble",
  name: "Bubble Sort",
  family: "Simple",
  description: "Compare les valeurs voisines.",
  sourcePath: "src-tauri/src/algorithms/bubble.rs",
  source: "fn bubble_sort() {\n    let value = 1;\n}",
};

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

afterEach(cleanup);

describe("AlgorithmCodePanel", () => {
  it("highlights the exact active Rust source line", () => {
    render(<AlgorithmCodePanel algorithm={algorithm} activeSourceLine={2} status="playing" />);

    expect(screen.getByText("Ligne 2")).toBeTruthy();
    const activeLine = document.querySelector('[aria-current="step"]');
    expect(activeLine?.textContent).toContain("let value = 1;");
    expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
  });

  it("shows the collapsible algorithm description", () => {
    render(<AlgorithmCodePanel algorithm={algorithm} activeSourceLine={null} status="idle" />);

    expect(screen.getByText("À propos de l’algorithme")).toBeTruthy();
    expect(screen.getByText(algorithm.description)).toBeTruthy();
    expect(screen.getByText("En attente d’exécution")).toBeTruthy();
  });
});
