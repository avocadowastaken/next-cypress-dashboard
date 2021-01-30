function resolveKey(key: string): string {
  const { [key]: env } = process.env;

  if (!env) {
    throw new Error(`"${key}" environment was not defined`);
  }

  return env;
}

export const CYPRESS_RECORD_KEY = resolveKey("CYPRESS_RECORD_KEY");
