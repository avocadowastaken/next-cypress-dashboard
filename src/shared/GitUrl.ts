import gitUrlParse from "git-url-parse";

const resourceProviderMap = new Map<string, string>().set(
  "github.com",
  "github"
);

export function parseGitUrl(
  url: string
): [providerId: string, owner: string, name: string] {
  const { resource, name, owner } = gitUrlParse(url);
  const provider = resourceProviderMap.get(resource);

  if (!name || !owner || !resource) {
    throw new Error("Invalid url");
  }

  if (!provider) {
    throw new Error("Unsupported provider");
  }

  return [provider, owner, name];
}
