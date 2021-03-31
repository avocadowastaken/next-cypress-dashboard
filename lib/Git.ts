import { AppError } from "@/lib/AppError";
import gitUrlParse from "git-url-parse";

const resourceProviderMap = new Map<string, string>().set(
  "github.com",
  "github"
);

export function parseGitUrl(
  url: string
): [providerId: string, owner: string, name: string] {
  if (!url) {
    throw new AppError("INVALID_GIT_URL");
  }

  const { resource, name, owner } = gitUrlParse(url);
  const provider = resourceProviderMap.get(resource);

  if (!name || !owner || !resource) {
    throw new AppError("INVALID_GIT_URL");
  }

  if (!provider) {
    throw new AppError("UNSUPPORTED_GIT_PROVIDER");
  }

  return [provider, owner, name];
}
