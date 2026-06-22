import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { PatternSelector } from "./PatternSelector";

afterEach(cleanup);

describe("PatternSelector", () => {
  it("selects a generation pattern", () => {
    const onChange = vi.fn();
    render(<PatternSelector value="random" disabled={false} onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: /Aléatoire/ }));
    fireEvent.click(screen.getByRole("option", { name: "Montagne" }));

    expect(onChange).toHaveBeenCalledWith("mountain");
    expect(screen.queryByRole("listbox")).toBeNull();
  });
});
