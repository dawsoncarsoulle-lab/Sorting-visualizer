import { type RefObject, useEffect, useState } from "react";

import type { OperationKind } from "../types/sorting";

type CanvasRenderOptions = {
  values: number[];
  highlighted: number[];
  sortedIndices: Set<number>;
  operation: OperationKind | null;
};

const colors = {
  normalTop: "#77a7ff",
  normalBottom: "#3569e8",
  compareTop: "#fde68a",
  compareBottom: "#d99a18",
  swapTop: "#fdba74",
  swapBottom: "#ea580c",
  setTop: "#fda4af",
  setBottom: "#e11d48",
  sortedTop: "#63e6ad",
  sortedBottom: "#20a96b",
  baseline: "rgba(148, 163, 184, 0.18)",
};

type CanvasSize = {
  width: number;
  height: number;
  ratio: number;
};

export function useCanvasRenderer(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  { values, highlighted, sortedIndices, operation }: CanvasRenderOptions,
) {
  const [size, setSize] = useState<CanvasSize>({ width: 0, height: 0, ratio: 1 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateSize = () => {
      const bounds = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(bounds.width * ratio));
      canvas.height = Math.max(1, Math.floor(bounds.height * ratio));
      setSize({ width: bounds.width, height: bounds.height, ratio });
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [canvasRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || size.width === 0 || size.height === 0) return;

    const frame = window.requestAnimationFrame(() => {
      const { width: canvasWidth, height: canvasHeight, ratio } = size;

      const context = canvas.getContext("2d");
      if (!context) return;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, canvasWidth, canvasHeight);

      const horizontalPadding = 18;
      const topPadding = 18;
      const bottomPadding = 12;
      const width = Math.max(1, canvasWidth - horizontalPadding * 2);
      const height = Math.max(1, canvasHeight - topPadding - bottomPadding);
      const slotWidth = width / Math.max(values.length, 1);
      const gap = values.length > 120 ? 0.4 : Math.min(2.5, slotWidth * 0.16);
      const maxValue = Math.max(...values, 1);

      context.fillStyle = colors.baseline;
      context.fillRect(horizontalPadding, topPadding + height, width, 1);

      values.forEach((value, index) => {
        const barHeight = Math.max(2, (value / maxValue) * height);
        const x = horizontalPadding + index * slotWidth + gap / 2;
        const y = topPadding + height - barHeight;
        const barWidth = Math.max(0.7, slotWidth - gap);
        const isHighlighted = highlighted.includes(index);
        const isSorted = sortedIndices.has(index);
        const activeTop =
          operation === "set"
            ? colors.setTop
            : operation === "swap"
              ? colors.swapTop
              : colors.compareTop;
        const activeBottom =
          operation === "set"
            ? colors.setBottom
            : operation === "swap"
              ? colors.swapBottom
              : colors.compareBottom;
        const top = isHighlighted
          ? activeTop
          : isSorted
            ? colors.sortedTop
            : colors.normalTop;
        const bottom = isHighlighted
          ? activeBottom
          : isSorted
            ? colors.sortedBottom
            : colors.normalBottom;
        const gradient = context.createLinearGradient(0, y, 0, y + barHeight);
        gradient.addColorStop(0, top);
        gradient.addColorStop(1, bottom);
        context.fillStyle = gradient;
        context.fillRect(x, y, barWidth, barHeight);
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [canvasRef, highlighted, operation, size, sortedIndices, values]);
}
