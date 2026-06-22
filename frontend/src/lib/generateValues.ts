export type ValuePattern =
  | "random"
  | "reversed"
  | "sorted"
  | "almost_sorted"
  | "few_unique"
  | "sawtooth"
  | "mountain"
  | "valley";

export type PatternOption = {
  id: ValuePattern;
  name: string;
};

export const VALUE_PATTERNS: readonly PatternOption[] = [
  { id: "random", name: "Aléatoire" },
  { id: "reversed", name: "Inversée" },
  { id: "sorted", name: "Déjà triée" },
  { id: "almost_sorted", name: "Presque triée" },
  { id: "few_unique", name: "Peu de valeurs" },
  { id: "sawtooth", name: "Dents de scie" },
  { id: "mountain", name: "Montagne" },
  { id: "valley", name: "Vallée" },
] as const;

function shuffle(values: number[], random: () => number): number[] {
  for (let index = values.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [values[index], values[swapIndex]] = [values[swapIndex], values[index]];
  }
  return values;
}

export function generateValues(
  size: number,
  pattern: ValuePattern = "random",
  random = Math.random,
): number[] {
  const sorted = Array.from({ length: size }, (_, index) => index + 1);

  switch (pattern) {
    case "random":
      return shuffle(sorted, random);
    case "reversed":
      return sorted.reverse();
    case "sorted":
      return sorted;
    case "almost_sorted": {
      if (size < 2) return sorted;
      const swaps = Math.max(1, Math.floor(size * 0.08));
      for (let count = 0; count < swaps; count += 1) {
        const first = Math.floor(random() * size);
        const second = Math.floor(random() * size);
        [sorted[first], sorted[second]] = [sorted[second], sorted[first]];
      }
      return sorted;
    }
    case "few_unique": {
      const uniqueCount = Math.min(5, Math.max(1, size));
      const values = Array.from({ length: size }, (_, index) => (index % uniqueCount) + 1);
      return shuffle(values, random);
    }
    case "sawtooth": {
      const period = Math.max(3, Math.round(Math.sqrt(size)));
      return Array.from({ length: size }, (_, index) => (index % period) + 1);
    }
    case "mountain":
      return Array.from({ length: size }, (_, index) => Math.min(index + 1, size - index));
    case "valley": {
      const peak = Math.ceil(size / 2);
      return Array.from(
        { length: size },
        (_, index) => peak - Math.min(index, size - index - 1),
      );
    }
  }
}
