export const JWT_SECRET = env("JWT_SECRET");

export const CYPRESS_RECORD_KEY = resolveEnv("CYPRESS_RECORD_KEY", null);

export const GITHUB_CLIENT_ID = env("GITHUB_ID");
export const GITHUB_CLIENT_SECRET = env("GITHUB_SECRET");
export const GITHUB_CLIENT_SLUG = resolveEnv(
  "GITHUB_SLUG",
  "next-cypress-dashboard"
);

function resolveEnv<T extends string | null>(key: string, defaultValue: T): T {
  const value = process.env[key];

  if (value) {
    return value.trim() as T;
  }

  return defaultValue;
}

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
