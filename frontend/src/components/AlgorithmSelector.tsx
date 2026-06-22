import { useEffect, useMemo, useRef, useState } from "react";

import type { AlgorithmId, AlgorithmInfo } from "../types/sorting";

type AlgorithmSelectorProps = {
  algorithms: readonly AlgorithmInfo[];
  value: AlgorithmId;
  disabled: boolean;
  onChange: (algorithm: AlgorithmId) => void;
};

export function AlgorithmSelector({
  algorithms,
  value,
  disabled,
  onChange,
}: AlgorithmSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const selectedIndex = Math.max(
    0,
    algorithms.findIndex((algorithm) => algorithm.id === value),
  );
  const selected = algorithms[selectedIndex];

  const groupedAlgorithms = useMemo(
    () =>
      (["Simple", "Efficient"] as const).map((family) => ({
        family,
        algorithms: algorithms.filter((algorithm) => algorithm.family === family),
      })),
    [algorithms],
  );

  useEffect(() => {
    if (!isOpen) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, [isOpen]);

  const open = (index = selectedIndex) => {
    if (disabled || algorithms.length === 0) return;
    setActiveIndex(index);
    setIsOpen(true);
  };

  const close = (restoreFocus = false) => {
    setIsOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  };

  const selectAt = (index: number) => {
    const algorithm = algorithms[index];
    if (!algorithm) return;
    onChange(algorithm.id);
    close(true);
  };

  const moveActive = (direction: 1 | -1) => {
    if (algorithms.length === 0) return;
    setActiveIndex((current) => (current + direction + algorithms.length) % algorithms.length);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!isOpen) open();
        else moveActive(1);
        break;
      case "ArrowUp":
        event.preventDefault();
        if (!isOpen) open();
        else moveActive(-1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (isOpen) selectAt(activeIndex);
        else open();
        break;
      case "Escape":
        if (isOpen) {
          event.preventDefault();
          close(true);
        }
        break;
    }
  };

  return (
    <div className="algorithm-select-root" ref={rootRef}>
      <button
        ref={triggerRef}
        id="algorithm"
        type="button"
        className="algorithm-select-trigger"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls="algorithm-listbox"
        disabled={disabled || algorithms.length === 0}
        onClick={() => (isOpen ? close() : open())}
        onKeyDown={handleKeyDown}
      >
        <span className="algorithm-dot" aria-hidden="true" />
        <span className="algorithm-selected-name">{selected?.name ?? "Chargement…"}</span>
        <span className="algorithm-count">{algorithms.length || "—"} algos</span>
        <svg className="select-chevron" viewBox="0 0 12 8" aria-hidden="true">
          <path d="m1 1.5 5 5 5-5" />
        </svg>
      </button>

      {isOpen && (
        <div id="algorithm-listbox" className="algorithm-listbox" role="listbox">
          {groupedAlgorithms.map(({ family, algorithms: familyAlgorithms }) => (
            <div className="algorithm-option-group" key={family} role="group" aria-label={family}>
              <div className="algorithm-group-label">
                {family === "Simple" ? "Tris simples" : "Tris efficaces"}
              </div>
              {familyAlgorithms.map((algorithm) => {
                const index = algorithms.findIndex((entry) => entry.id === algorithm.id);
                const isSelected = algorithm.id === value;
                const isActive = index === activeIndex;
                return (
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    tabIndex={-1}
                    key={algorithm.id}
                    className={`algorithm-option${isActive ? " active" : ""}${isSelected ? " selected" : ""}`}
                    onPointerMove={() => setActiveIndex(index)}
                    onClick={() => selectAt(index)}
                  >
                    <span>{algorithm.name}</span>
                    {isSelected && <span className="option-check" aria-hidden="true">✓</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
