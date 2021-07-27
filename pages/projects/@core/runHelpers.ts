import { Run } from "@prisma/client";

export function getRunName({ ciBuildId, commitMessage }: Run): string {
  if (commitMessage) {
    const name = commitMessage.split("\n").find((line) => line.length > 0);
    if (name) return name;
  }

  return ciBuildId;
}
