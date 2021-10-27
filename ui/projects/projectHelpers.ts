import { Project } from "@prisma/client";

export function formatProjectName({ org, repo }: Project): string {
  return `${org}/${repo}`;
}
