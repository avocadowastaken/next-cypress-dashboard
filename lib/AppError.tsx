export type AppErrorCode = typeof APP_ERROR_CODES[number];
export const APP_ERROR_CODES = [
  "UNKNOWN_ERROR",

  // HTTP Errors

  "FORBIDDEN",
  "NOT_FOUND",
  "BAD_REQUEST",
  "UNAUTHORIZED",

  // Git Integration Errors

  "INVALID_GIT_URL",
  "UNSUPPORTED_GIT_PROVIDER",

  // GitHub Integration Errors

  "GITHUB_REPO_NOT_FOUND",
  "GITHUB_REPO_ACCESS_DENIED",
] as const;

export class AppError extends Error {
  constructor(code: AppErrorCode) {
    super(code);
    this.name = "AppError";
  }
}

export function extractErrorCode(error: unknown): AppErrorCode {
  if (error instanceof Error) {
    error = error.message;
  }

  if (APP_ERROR_CODES.includes(error as AppErrorCode)) {
    return error as AppErrorCode;
  }

  return "UNKNOWN_ERROR";
}

export function formatAppError(error: unknown): string {
  const code = extractErrorCode(error);

  switch (code) {
    case "UNAUTHORIZED":
      return "Unauthorized";
    case "UNKNOWN_ERROR":
      return "Unknown Error";
    case "BAD_REQUEST":
      return "Bad Request";
    case "NOT_FOUND":
      return "Resource not found";
    case "INVALID_GIT_URL":
      return "Invalid Git url";
    case "UNSUPPORTED_GIT_PROVIDER":
      return "Git provider is not supported";
    case "GITHUB_REPO_NOT_FOUND":
      return "GitHub repository not found";
    case "GITHUB_REPO_ACCESS_DENIED":
      return "Insufficient permissions to the GitHub repository";

    default:
      return code;
  }
}

export function getAppErrorStatusCode(error: unknown): number {
  const code = extractErrorCode(error);
  switch (code) {
    case "BAD_REQUEST":
    case "INVALID_GIT_URL":
    case "UNSUPPORTED_GIT_PROVIDER":
      return 400;
    case "UNAUTHORIZED":
      return 401;
    case "FORBIDDEN":
    case "GITHUB_REPO_ACCESS_DENIED":
      return 403;
    case "NOT_FOUND":
    case "GITHUB_REPO_NOT_FOUND":
      return 404;

    case "UNKNOWN_ERROR":
    default:
      return 500;
  }
}
