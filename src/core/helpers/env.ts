function resolveRequired(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`env: '${key}' is empty`);
  }

  return value;
}

export const JWT_SECRET = resolveRequired("JWT_SECRET");
export const JWT_SIGNING_KEY = resolveRequired("JWT_SIGNING_KEY");
export const JWT_ENCRYPTION_KEY = resolveRequired("JWT_ENCRYPTION_KEY");

export const SESSION_SECRET = resolveRequired("SESSION_SECRET");
export const TASKS_API_SECRET = resolveRequired("TASKS_API_SECRET");

export const GITHUB_CLIENT_ID = resolveRequired("GITHUB_ID");
export const GITHUB_CLIENT_SECRET = resolveRequired("GITHUB_SECRET");
