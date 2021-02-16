export function toPageParam(input: unknown): number {
  if (typeof input == "string") {
    input = parseInt(input, 10);
  }

  if (typeof input == "number" && Number.isFinite(input)) {
    return Math.max(0, Math.round(input));
  }

  return 0;
}

export function toRowsPerPageParam(
  input: unknown,
  rowsPerPageOptions: readonly number[]
): number {
  if (typeof input == "string") {
    input = parseInt(input, 10);
  }

  return typeof input === "number" && rowsPerPageOptions.includes(input)
    ? input
    : rowsPerPageOptions[0];
}
