function ensure(name: string, input: unknown): string {
  if (typeof input != "string" || !input.length) {
    throw new Error(`env: '${name}' is empty`);
  }

  return input;
}

export const NCD_SECRET = ensure("NCD_SECRET", process.env["NCD_SECRET"]);

export const SESSION_COOKIE_NAME =
  process.env["SESSION_COOKIE_NAME"] || "__nis";
export const SESSION_SECRET = ensure(
  "SESSION_SECRET",
  process.env["SESSION_SECRET"]
);

export const GITHUB_CLIENT_ID = ensure("GITHUB_ID", process.env["GITHUB_ID"]);
export const GITHUB_CLIENT_SECRET = ensure(
  "GITHUB_SECRET",
  process.env["GITHUB_SECRET"]
);
