export function generateValues(size: number, random = Math.random): number[] {
  const values = Array.from({ length: size }, (_, index) => index + 1);

  for (let index = values.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [values[index], values[swapIndex]] = [values[swapIndex], values[index]];
  }

  return values;
}

