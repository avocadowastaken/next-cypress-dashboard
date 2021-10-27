export function trim(input: unknown): string {
  if (typeof input == "string") {
    return input.trim();
  }

  return "";
}

export function capitalize(input: string): string {
  return input.charAt(0).toLocaleUpperCase() + input.slice(1);
}
