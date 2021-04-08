import { Run } from "@prisma/client";

export function getRunName({ ciBuildId, commitMessage }: Run): string {
  if (commitMessage) {
    const name = commitMessage.split("\n").find((line) => line.length > 0);

    if (name) {
      return name;
    }
  }

  return ciBuildId;
}

export function createRunUrl(run: Run): string {
  const host =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : `https://${process.env.NEXT_PUBLIC_VERCEL_ENV}`;

  return `${host}/projects/${run.projectId}/runs/${run.id}`;
}
