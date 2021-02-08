function resolveKey<T extends string | null>(key: string, defaultValue: T): T {
  return (process.env[key] as T) || defaultValue;
}

export const CYPRESS_RECORD_KEY = resolveKey("CYPRESS_RECORD_KEY", null);

export function env(key: string): string {
  if (!(key in process.env)) {
    throw new Error(`env: '${key}' is not defined`);
  }

  const value = process.env[key];

  if (!value) {
    throw new Error(`env: '${key}' is empty`);
  }

  return value;
}
