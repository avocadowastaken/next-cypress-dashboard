export function toPageParam(input: unknown): number {
  if (typeof input == "string") {
    input = parseInt(input, 10);
  }

  if (typeof input == "number" && Number.isFinite(input)) {
    return Math.max(1, Math.round(input));
  }

  return 1;
}
