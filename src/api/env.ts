function resolveKey(key: string): string {
  const { [key]: env } = process.env;

  if (!env) {
    throw new Error(`"${key}" environment was not defined`);
  }

  return env;
}

export const APP_ENV = resolveKey("APP_ENV");
export const NODE_ENV = resolveKey("NODE_ENV");
export const CYPRESS_RECORD_KEY = resolveKey("CYPRESS_RECORD_KEY");
