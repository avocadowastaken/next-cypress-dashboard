function resolveKey<T extends string | null>(key: string, defaultValue: T): T {
  return (process.env[key] as T) || defaultValue;
}

export const CYPRESS_RECORD_KEY = resolveKey("CYPRESS_RECORD_KEY", null);
