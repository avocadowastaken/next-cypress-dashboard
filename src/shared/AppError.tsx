export type AppErrorCode = typeof APP_ERROR_CODES[number];
export const APP_ERROR_CODES = [
  "UNKNOWN_ERROR",

  // HTTP Errors

  "FORBIDDEN",
  "BAD_REQUEST",

  // Git Integration Errors

  "INVALID_GIT_URL",
  "UNSUPPORTED_GIT_PROVIDER",

  // GitHub Integration Errors

  "GITHUB_ACCOUNT_NOT_LINKED",
  "GITHUB_ACCOUNT_INVALID_ACCESS_TOKEN",

  "GITHUB_REPO_NOT_FOUND",
  "GITHUB_REPO_ACCESS_DENIED",
] as const;

export function createAppError(code: AppErrorCode): Error {
  return new Error(code);
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

export function formatErrorCode(error: AppErrorCode): string {
  switch (error) {
    case "UNKNOWN_ERROR":
      return "Unknown Error";
    case "BAD_REQUEST":
      return "Bad Request";
    case "INVALID_GIT_URL":
      return "Invalid Git url";
    case "UNSUPPORTED_GIT_PROVIDER":
      return "Git provider is not supported";
    case "GITHUB_REPO_NOT_FOUND":
      return "GitHub repository not found";
    case "GITHUB_REPO_ACCESS_DENIED":
      return "Insufficient permissions to the GitHub repository";

    default:
      return error;
  }
}

export function isGitHubIntegrationError(error: AppErrorCode): boolean {
  switch (error) {
    case "GITHUB_ACCOUNT_NOT_LINKED":
    case "GITHUB_ACCOUNT_INVALID_ACCESS_TOKEN":
      return true;
  }

  return false;
}
