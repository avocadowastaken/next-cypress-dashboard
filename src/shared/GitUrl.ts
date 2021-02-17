import { createAppError } from "@/shared/AppError";
import gitUrlParse from "git-url-parse";

const resourceProviderMap = new Map<string, string>().set(
  "github.com",
  "github"
);

export function parseGitUrl(
  url: string
): [providerId: string, owner: string, name: string] {
  if (!url) {
    throw createAppError("INVALID_GIT_URL");
  }

  const { resource, name, owner } = gitUrlParse(url);
  const provider = resourceProviderMap.get(resource);

  if (!name || !owner || !resource) {
    throw createAppError("INVALID_GIT_URL");
  }

  if (!provider) {
    throw createAppError("UNSUPPORTED_GIT_PROVIDER");
  }

  return [provider, owner, name];
}
