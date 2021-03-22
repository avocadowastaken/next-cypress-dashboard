function resolveRequired(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`env: '${key}' is empty`);
  }

  return value;
}

export const SESSION_SECRET = resolveRequired("SESSION_SECRET");
export const TASKS_API_SECRET = resolveRequired("TASKS_API_SECRET");

export const GITHUB_CLIENT_ID = resolveRequired("GITHUB_ID");
export const GITHUB_CLIENT_SECRET = resolveRequired("GITHUB_SECRET");
