import { AppError } from "@/core/data/AppError";
import { prisma } from "@/core/helpers/db";
import { Octokit } from "@octokit/core";
import { components } from "@octokit/openapi-types";
import { RequestError } from "@octokit/request-error";

export async function verifyGitHubRepoAccess(
  userId: string,
  owner: string,
  repo: string
): Promise<void> {
  const account = await prisma.userAccount.findUnique({
    select: { accessToken: true },
    where: { userId_providerId: { userId, providerId: "github" } },
  });

  if (!account?.accessToken) {
    throw new AppError("UNAUTHORIZED");
  }

  const octokit = new Octokit({ auth: account.accessToken });

  let repository: components["schemas"]["full-repository"];

  try {
    const response = await octokit.request("GET /repos/{owner}/{repo}", {
      repo,
      owner,
    });

    repository = response.data;
  } catch (error: unknown) {
    if (error instanceof RequestError) {
      if (error.status === 401) {
        throw new AppError("UNAUTHORIZED");
      }

      if (error.status === 404) {
        throw new AppError("GITHUB_REPO_NOT_FOUND");
      }
    }

    throw error;
  }

  if (!repository.permissions?.push) {
    throw new AppError("GITHUB_REPO_ACCESS_DENIED");
  }
}
