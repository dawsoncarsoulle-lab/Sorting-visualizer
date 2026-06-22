import { useRef } from "react";

import { useCanvasRenderer } from "../hooks/useCanvasRenderer";

type SortCanvasProps = {
  values: number[];
  highlighted: number[];
  sortedIndices: Set<number>;
};

export function SortCanvas({ values, highlighted, sortedIndices }: SortCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useCanvasRenderer(canvasRef, { values, highlighted, sortedIndices });

  return (
    <canvas
      ref={canvasRef}
      className="h-full min-h-72 w-full"
      aria-label={`Visualisation de ${values.length} valeurs sous forme de barres`}
      role="img"
    />
  );
}

