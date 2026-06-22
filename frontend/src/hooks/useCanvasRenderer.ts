import { type RefObject, useEffect } from "react";

type CanvasRenderOptions = {
  values: number[];
  highlighted: number[];
  sortedIndices: Set<number>;
};

const colors = {
  normalTop: "#77a7ff",
  normalBottom: "#3569e8",
  highlightedTop: "#ffd36a",
  highlightedBottom: "#f08a24",
  sortedTop: "#63e6ad",
  sortedBottom: "#20a96b",
  baseline: "rgba(148, 163, 184, 0.18)",
};

export function useCanvasRenderer(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  { values, highlighted, sortedIndices }: CanvasRenderOptions,
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const render = () => {
      const bounds = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(bounds.width * ratio));
      canvas.height = Math.max(1, Math.floor(bounds.height * ratio));

      const context = canvas.getContext("2d");
      if (!context) return;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, bounds.width, bounds.height);

      const horizontalPadding = 18;
      const topPadding = 18;
      const bottomPadding = 12;
      const width = Math.max(1, bounds.width - horizontalPadding * 2);
      const height = Math.max(1, bounds.height - topPadding - bottomPadding);
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
        const top = isHighlighted
          ? colors.highlightedTop
          : isSorted
            ? colors.sortedTop
            : colors.normalTop;
        const bottom = isHighlighted
          ? colors.highlightedBottom
          : isSorted
            ? colors.sortedBottom
            : colors.normalBottom;
        const gradient = context.createLinearGradient(0, y, 0, y + barHeight);
        gradient.addColorStop(0, top);
        gradient.addColorStop(1, bottom);
        context.fillStyle = gradient;
        context.fillRect(x, y, barWidth, barHeight);
      });
    };

    render();
    const observer = new ResizeObserver(render);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [canvasRef, highlighted, sortedIndices, values]);
}

