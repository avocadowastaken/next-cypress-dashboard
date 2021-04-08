function resolve(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`secret: '${key}' is empty`);
  }

  return value;
}

export const SESSION_SECRET = resolve("SESSION_SECRET");
export const TASKS_API_SECRET = resolve("TASKS_API_SECRET");

export const GITHUB_CLIENT_ID = resolve("GITHUB_ID");
export const GITHUB_CLIENT_SECRET = resolve("GITHUB_SECRET");
