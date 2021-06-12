export function simpsonIntegration(
  func: (x: number) => number,
  range: [number, number],
): number {
  const start = range[0];
  const end = range[1];
  const n = 1000;
  const h = (end - start) / n;
  let sum1 = 0.0;
  let sum2 = 0.0;

  for (let i = 1; i <= n / 2 - 1; i++) {
    sum1 += func(start + 2.0 * i * h);
  }

  for (let i = 1; i <= n / 2; i++) {
    sum2 += func(start + (2.0 * i - 1.0) * h);
  }

  return (h / 3.0) * (func(start) + func(end) + 2.0 * sum1 + 4.0 * sum2);
}
