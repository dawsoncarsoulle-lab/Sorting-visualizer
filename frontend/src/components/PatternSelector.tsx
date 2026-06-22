import { useEffect, useRef, useState } from "react";

import { VALUE_PATTERNS, type ValuePattern } from "../lib/generateValues";

type PatternSelectorProps = {
  value: ValuePattern;
  disabled: boolean;
  onChange: (pattern: ValuePattern) => void;
};

export function PatternSelector({ value, disabled, onChange }: PatternSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = VALUE_PATTERNS.find((pattern) => pattern.id === value) ?? VALUE_PATTERNS[0];

  useEffect(() => {
    if (!isOpen) return;
    const close = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [isOpen]);

  return (
    <div className="pattern-select-root" ref={rootRef}>
      <button
        type="button"
        className="pattern-select-trigger"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby="pattern-label pattern-selected-name"
        disabled={disabled}
        onClick={() => setIsOpen((open) => !open)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setIsOpen(false);
        }}
      >
        <span id="pattern-selected-name">{selected.name}</span>
        <svg className="select-chevron" viewBox="0 0 12 8" aria-hidden="true">
          <path d="m1 1.5 5 5 5-5" />
        </svg>
      </button>
      {isOpen && (
        <div className="pattern-listbox" role="listbox" aria-labelledby="pattern-label">
          {VALUE_PATTERNS.map((pattern) => (
            <button
              type="button"
              role="option"
              aria-selected={pattern.id === value}
              className={`pattern-option${pattern.id === value ? " selected" : ""}`}
              key={pattern.id}
              onClick={() => {
                onChange(pattern.id);
                setIsOpen(false);
              }}
            >
              {pattern.name}
              {pattern.id === value && <span aria-hidden="true">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
