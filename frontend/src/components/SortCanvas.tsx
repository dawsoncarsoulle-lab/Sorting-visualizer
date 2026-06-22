import { useRef } from "react";

import { useCanvasRenderer } from "../hooks/useCanvasRenderer";
import type { OperationKind } from "../types/sorting";

type SortCanvasProps = {
  values: number[];
  highlighted: number[];
  sortedIndices: Set<number>;
  operation: OperationKind | null;
};

export function SortCanvas({ values, highlighted, sortedIndices, operation }: SortCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useCanvasRenderer(canvasRef, { values, highlighted, sortedIndices, operation });

  return (
    <canvas
      ref={canvasRef}
      className="h-full min-h-72 w-full"
      aria-label={`Visualisation de ${values.length} valeurs sous forme de barres`}
      role="img"
    />
  );
}
