function get(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`secret: '${key}' is empty`);
  }

  return value;
}

export const NCD_SECRET = get("NCD_SECRET");
export const SESSION_SECRET = get("SESSION_SECRET");

export const GITHUB_CLIENT_ID = get("GITHUB_ID");
export const GITHUB_CLIENT_SECRET = get("GITHUB_SECRET");
export const GITHUB_APP_ID = get("GITHUB_APP_ID");
export const GITHUB_APP_PRIVATE_KEY = new Buffer(
  get("GITHUB_APP_PRIVATE_KEY"),
  "base64"
).toString("utf8");
